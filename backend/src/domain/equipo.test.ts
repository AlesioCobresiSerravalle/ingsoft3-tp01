import { describe, expect, it } from "vitest";
import { conEstadoDerivado, estadoDeEquipo } from "./equipo";

describe("estado derivado del equipo (regla 6: sin estado duplicado)", () => {
  it("sin préstamos activos está DISPONIBLE", () => {
    expect(estadoDeEquipo(0)).toBe("DISPONIBLE");
  });

  it("con un préstamo activo está PRESTADO", () => {
    expect(estadoDeEquipo(1)).toBe("PRESTADO");
  });

  it("la respuesta no expone la lista interna de préstamos y agrega el estado", () => {
    const equipo = conEstadoDerivado({ id: "e1", nombre: "Kit", prestamos: [{}] });

    expect(equipo).toEqual({ id: "e1", nombre: "Kit", estado: "PRESTADO" });
  });
});
