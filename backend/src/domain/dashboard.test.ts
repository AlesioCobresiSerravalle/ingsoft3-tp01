import { describe, expect, it } from "vitest";
import { calcularResumen } from "./dashboard";

const AHORA = new Date("2026-09-10T12:00:00Z");
const dias = (n: number) => new Date(AHORA.getTime() + n * 24 * 60 * 60 * 1000);
const activo = (equipoId: string, d: number) => ({
  equipoId,
  estado: "ACTIVO" as const,
  fechaDevolucionPrevista: dias(d),
});

describe("calcularResumen", () => {
  it("replica el escenario de 5 equipos: 2 disponibles, 3 prestados, 1 vencido, 1 próximo", () => {
    const prestamos = [activo("b", 10), activo("c", -2), activo("d", 1)];

    expect(calcularResumen(5, prestamos, AHORA)).toEqual({
      totalEquipos: 5,
      disponibles: 2,
      prestados: 3,
      vencidos: 1,
      proximosAVencer: 1,
    });
  });

  it("sin préstamos, todos los equipos están disponibles", () => {
    expect(calcularResumen(4, [], AHORA)).toMatchObject({ disponibles: 4, prestados: 0 });
  });

  it("un vencido no se cuenta además como próximo a vencer", () => {
    const resumen = calcularResumen(1, [activo("a", -1)], AHORA);

    expect(resumen.vencidos).toBe(1);
    expect(resumen.proximosAVencer).toBe(0);
  });
});
