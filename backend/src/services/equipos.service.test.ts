import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  equipo: { findUnique: vi.fn(), create: vi.fn(), delete: vi.fn(), update: vi.fn() },
}));
vi.mock("../lib/prisma", () => ({ prisma: db }));

import { ConflictError } from "../errors/AppError";
import { crearEquipo, eliminarEquipo } from "./equipos.service";

const errorPrisma = (code: string) =>
  new Prisma.PrismaClientKnownRequestError("falla", { code, clientVersion: "test" });

beforeEach(() => vi.clearAllMocks());

describe("traducción de errores de Prisma (la base decide, el service traduce)", () => {
  it("código duplicado (P2002) se informa como ConflictError y no como 500", async () => {
    db.equipo.create.mockRejectedValue(errorPrisma("P2002"));

    await expect(crearEquipo({ nombre: "A", categoria: "B", codigo: "X" })).rejects.toThrow(
      "Ya existe un equipo con ese código",
    );
  });

  it("borrar un equipo con préstamos (FK, P2003) da ConflictError", async () => {
    db.equipo.findUnique.mockResolvedValue({ id: "e", prestamos: [] });
    db.equipo.delete.mockRejectedValue(errorPrisma("P2003"));

    await expect(eliminarEquipo("e")).rejects.toBeInstanceOf(ConflictError);
  });

  it("un error de Prisma desconocido NO se disfraza: se propaga tal cual", async () => {
    db.equipo.findUnique.mockResolvedValue({ id: "e", prestamos: [] });
    db.equipo.delete.mockRejectedValue(errorPrisma("P9999"));

    await expect(eliminarEquipo("e")).rejects.not.toBeInstanceOf(ConflictError);
  });
});
