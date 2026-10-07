import { describe, expect, it } from "vitest";
import { etiquetaDeEquipo, etiquetaDePrestamo } from "./estados";

describe("etiquetaDePrestamo: el vencido manda sobre el estado", () => {
  it.each([
    [{ estado: "ACTIVO", vencido: true }, "Vencido", "danger"],
    [{ estado: "ACTIVO", vencido: false }, "Activo", "info"],
    [{ estado: "DEVUELTO", vencido: false }, "Devuelto", "success"],
  ] as const)("%j -> %s", (prestamo, label, tono) => {
    expect(etiquetaDePrestamo(prestamo)).toEqual({ label, tono });
  });
});

describe("etiquetaDeEquipo", () => {
  it.each([
    ["DISPONIBLE", "Disponible", "success"],
    ["PRESTADO", "Prestado", "info"],
  ] as const)("%s -> %s", (estado, label, tono) => {
    expect(etiquetaDeEquipo(estado)).toEqual({ label, tono });
  });
});
