import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { crearPrestamoSchema } from "./prestamo.schema";

const UUID_A = "11111111-1111-4111-8111-111111111111";
const UUID_B = "22222222-2222-4222-8222-222222222222";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-10T12:00:00Z"));
});
afterEach(() => vi.useRealTimers());

const datos = (fecha: string) => ({ equipoId: UUID_A, personaId: UUID_B, fechaDevolucionPrevista: fecha });

describe("crearPrestamoSchema (regla 3: devolución no anterior al préstamo)", () => {
  it("acepta una fecha de devolución futura", () => {
    expect(crearPrestamoSchema.safeParse(datos("2026-09-20")).success).toBe(true);
  });

  it("rechaza una fecha pasada y el mensaje explica la regla", () => {
    const r = crearPrestamoSchema.safeParse(datos("2026-09-01"));

    expect(r.success).toBe(false);
    expect(r.error?.issues[0].message).toContain("no puede ser anterior");
  });

  it.each([["no-es-un-uuid"], [""]])("rechaza un equipoId inválido (%j)", (equipoId) => {
    const r = crearPrestamoSchema.safeParse({ ...datos("2026-09-20"), equipoId });

    expect(r.success).toBe(false);
  });
});
