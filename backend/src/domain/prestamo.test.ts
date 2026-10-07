import { describe, expect, it } from "vitest";
import { esProximoAVencer, estaVencido } from "./prestamo";

const AHORA = new Date("2026-09-10T12:00:00Z");
const dias = (n: number) => new Date(AHORA.getTime() + n * 24 * 60 * 60 * 1000);

describe("estaVencido (regla 5: activo y con fecha prevista ya pasada)", () => {
  it.each([
    ["activo con fecha pasada", "ACTIVO", dias(-1), true],
    ["activo con fecha futura", "ACTIVO", dias(1), false],
    ["devuelto aunque la fecha haya pasado", "DEVUELTO", dias(-10), false],
    ["activo justo en el instante límite (borde: no es vencido)", "ACTIVO", AHORA, false],
  ] as const)("%s", (_caso, estado, fecha, esperado) => {
    const resultado = estaVencido({ estado, fechaDevolucionPrevista: fecha }, AHORA);

    expect(resultado).toBe(esperado);
  });
});

describe("esProximoAVencer (ventana de 3 días)", () => {
  it.each([
    ["dentro de la ventana", dias(2), true],
    ["justo en el límite de 3 días (borde incluido)", dias(3), true],
    ["recién fuera de la ventana", dias(3.01), false],
    ["ya vencido no cuenta como próximo", dias(-1), false],
  ])("%s", (_caso, fecha, esperado) => {
    expect(esProximoAVencer({ estado: "ACTIVO", fechaDevolucionPrevista: fecha }, AHORA)).toBe(esperado);
  });

  it("un préstamo devuelto nunca es próximo a vencer", () => {
    expect(esProximoAVencer({ estado: "DEVUELTO", fechaDevolucionPrevista: dias(1) }, AHORA)).toBe(false);
  });
});
