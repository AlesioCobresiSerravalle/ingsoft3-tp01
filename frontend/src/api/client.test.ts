import { afterEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "./client";
import { listarEquipos } from "./equipos";

// MOCK del fetch del navegador: el test nunca sale a la red. Hace de stub
// (devuelve una respuesta armada) y de mock (después se verifica a qué URL se llamó).
const respuesta = (status: number, cuerpo?: unknown) =>
  new Response(cuerpo === undefined ? null : JSON.stringify(cuerpo), { status });
const fetchFalso = (r: Response) => {
  const f = vi.fn().mockResolvedValue(r);
  vi.stubGlobal("fetch", f);
  return f;
};
afterEach(() => vi.unstubAllGlobals());

describe("apiFetch", () => {
  it("llama siempre a una ruta RELATIVA bajo /api (nunca a un host escrito)", async () => {
    const f = fetchFalso(respuesta(200, []));

    await apiFetch("/equipos");

    expect(f.mock.calls[0][0]).toBe("/api/equipos");
  });

  it("devuelve el JSON del cuerpo en una respuesta exitosa", async () => {
    fetchFalso(respuesta(200, { totalEquipos: 3 }));

    await expect(apiFetch("/dashboard/resumen")).resolves.toEqual({ totalEquipos: 3 });
  });

  it("un 204 (borrado) devuelve undefined sin intentar parsear nada", async () => {
    fetchFalso(respuesta(204));

    await expect(apiFetch("/equipos/x", { method: "DELETE" })).resolves.toBeUndefined();
  });

  it("propaga el mensaje que mandó el backend en un error 409", async () => {
    fetchFalso(respuesta(409, { error: { message: "Ya existe un equipo con ese código" } }));

    await expect(apiFetch("/equipos")).rejects.toThrow("Ya existe un equipo con ese código");
  });

  it("si el error no es JSON (la página 502 de nginx) cae al mensaje de respaldo", async () => {
    fetchFalso(new Response("<html>Bad Gateway</html>", { status: 502 }));

    await expect(apiFetch("/equipos")).rejects.toThrow("Error 502");
  });
});

describe("listarEquipos", () => {
  it("codifica el texto de búsqueda en la URL", async () => {
    const f = fetchFalso(respuesta(200, []));

    await listarEquipos("kit uno&x");

    expect(f.mock.calls[0][0]).toBe("/api/equipos?q=kit%20uno%26x");
  });

  it("sin búsqueda no agrega querystring", async () => {
    const f = fetchFalso(respuesta(200, []));

    await listarEquipos();

    expect(f.mock.calls[0][0]).toBe("/api/equipos");
  });
});
