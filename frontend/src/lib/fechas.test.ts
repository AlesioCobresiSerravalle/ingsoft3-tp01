import { describe, expect, it } from "vitest";
import { fechaInputAIso, formatearFecha } from "./fechas";

describe("formatearFecha (bug real de zona horaria de la Fase 11)", () => {
  it.each([
    ["2026-09-06T00:00:00.000Z", "6/9/2026"],
    ["2026-01-01T00:00:00.000Z", "1/1/2026"],
    ["2026-12-31T23:59:59.000Z", "31/12/2026"],
  ])("el día guardado %s se muestra como %s, sin correrse por la zona horaria", (iso, esperado) => {
    expect(formatearFecha(iso)).toBe(esperado);
  });
});

describe("fechaInputAIso", () => {
  it("convierte el valor de <input type=date> al ISO que espera el backend", () => {
    expect(fechaInputAIso("2026-09-06")).toBe("2026-09-06T00:00:00.000Z");
  });

  it.each([[""], ["no-es-fecha"]])("rechaza una fecha inválida (%j) con un mensaje claro", (valor) => {
    expect(() => fechaInputAIso(valor)).toThrow("La fecha ingresada no es válida");
  });
});
