import { describe, expect, it } from "vitest";
import { textoDeVencimiento } from "./vencimiento";

// Reloj inyectado: "hoy" es el 10/09/2026 a la tarde (UTC).
const ahora = new Date("2026-09-10T15:30:00.000Z");
const activo = (fechaDevolucionPrevista: string) => ({
  estado: "ACTIVO" as const,
  fechaDevolucionPrevista,
  fechaDevolucionReal: null,
});

describe("textoDeVencimiento: un camino por cada salida", () => {
  it.each([
    ["2026-09-07T00:00:00.000Z", "Vencido hace 3 días"],
    ["2026-09-09T00:00:00.000Z", "Vencido ayer"],
    ["2026-09-10T00:00:00.000Z", "Vence hoy"],
    ["2026-09-11T00:00:00.000Z", "Vence mañana"],
    ["2026-09-15T00:00:00.000Z", "Vence en 5 días"],
  ])("préstamo activo con devolución prevista %s -> %s", (prevista, esperado) => {
    expect(textoDeVencimiento(activo(prevista), ahora)).toBe(esperado);
  });

  it("la hora del día no cambia el resultado: a las 23:59 UTC sigue siendo el mismo día", () => {
    const tarde = new Date("2026-09-10T23:59:59.000Z");
    expect(textoDeVencimiento(activo("2026-09-10T00:00:00.000Z"), tarde)).toBe("Vence hoy");
  });

  it("cruza el fin de año sin romperse", () => {
    const fin = new Date("2026-12-31T10:00:00.000Z");
    expect(textoDeVencimiento(activo("2027-01-02T00:00:00.000Z"), fin)).toBe("Vence en 2 días");
  });
});

describe("textoDeVencimiento: préstamos devueltos", () => {
  it("devuelto con fecha real -> Devuelto", () => {
    const p = { estado: "DEVUELTO" as const, fechaDevolucionPrevista: "2020-01-01T00:00:00.000Z", fechaDevolucionReal: "2020-01-02T00:00:00.000Z" };
    expect(textoDeVencimiento(p, ahora)).toBe("Devuelto");
  });

  it("devuelto sin fecha real (dato incompleto) lo dice, no inventa", () => {
    const p = { estado: "DEVUELTO" as const, fechaDevolucionPrevista: "2020-01-01T00:00:00.000Z", fechaDevolucionReal: null };
    expect(textoDeVencimiento(p, ahora)).toBe("Devuelto (sin fecha)");
  });

  it("un préstamo devuelto jamás figura como vencido, aunque la fecha prevista sea vieja", () => {
    const p = { estado: "DEVUELTO" as const, fechaDevolucionPrevista: "2000-01-01T00:00:00.000Z", fechaDevolucionReal: "2000-01-05T00:00:00.000Z" };
    expect(textoDeVencimiento(p, ahora)).not.toMatch(/Vencido/);
  });
});
