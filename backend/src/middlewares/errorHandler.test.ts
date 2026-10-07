import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { ConflictError, NotFoundError } from "../errors/AppError";
import { errorHandler } from "./errorHandler";

function respuestaFalsa() {
  const res = { status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
}
const invocar = (err: unknown) => {
  const res = respuestaFalsa();
  errorHandler(err, {} as Request, res as unknown as Response, vi.fn());
  return res;
};

describe("errorHandler (traducción de errores a HTTP)", () => {
  it.each([
    [new NotFoundError("no está"), 404, "no está"],
    [new ConflictError("choca"), 409, "choca"],
  ])("un AppError conserva su status y mensaje", (err, status, mensaje) => {
    const res = invocar(err);

    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.json).toHaveBeenCalledWith({ error: { message: mensaje } });
  });

  it("un error de body-parser (JSON malformado) responde 400 y no 500", () => {
    const res = invocar(Object.assign(new Error("JSON inválido"), { statusCode: 400, expose: true }));

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("un error inesperado responde 500 SIN filtrar el detalle interno", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = invocar(new Error("password de la base: hunter2"));

    expect(res.status).toHaveBeenCalledWith(500);
    expect(JSON.stringify(res.json.mock.calls)).not.toContain("hunter2");
    log.mockRestore();
  });
});
