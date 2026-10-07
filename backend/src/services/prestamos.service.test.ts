import { beforeEach, describe, expect, it, vi } from "vitest";

// MOCK de la frontera con la base: el service importa `prisma` desde lib/,
// así que se reemplaza ese módulo entero por un doble. $transaction ejecuta
// el callback con el mismo doble, igual que lo hace Prisma con su cliente.
const db = vi.hoisted(() => {
  const tx = {
    equipo: { findUnique: vi.fn() },
    persona: { findUnique: vi.fn() },
    prestamo: { findFirst: vi.fn(), create: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
  };
  return { ...tx, $transaction: vi.fn((cb: (t: typeof tx) => unknown) => cb(tx)) };
});
vi.mock("../lib/prisma", () => ({ prisma: db }));

import { ConflictError, NotFoundError } from "../errors/AppError";
import { crearPrestamo, registrarDevolucion } from "./prestamos.service";

const entrada = {
  equipoId: "e1",
  personaId: "p1",
  fechaDevolucionPrevista: new Date("2030-01-01"),
};

beforeEach(() => {
  vi.clearAllMocks();
  db.equipo.findUnique.mockResolvedValue({ id: "e1" });
  db.persona.findUnique.mockResolvedValue({ id: "p1" });
});

describe("crearPrestamo (regla 2: un equipo prestado no se vuelve a prestar)", () => {
  it("rechaza con ConflictError si el equipo ya tiene un préstamo activo, y NO crea nada", async () => {
    db.prestamo.findFirst.mockResolvedValue({ id: "activo" });

    await expect(crearPrestamo(entrada)).rejects.toBeInstanceOf(ConflictError);
    expect(db.prestamo.create).not.toHaveBeenCalled();
  });

  it("consulta si hay un préstamo SIN devolución real para ese equipo (verifica la interacción)", async () => {
    db.prestamo.findFirst.mockResolvedValue({ id: "activo" });

    await crearPrestamo(entrada).catch(() => {});

    expect(db.prestamo.findFirst).toHaveBeenCalledWith({
      where: { equipoId: "e1", fechaDevolucionReal: null },
    });
  });

  it("crea el préstamo y lo devuelve con vencido=false cuando el equipo está libre", async () => {
    db.prestamo.findFirst.mockResolvedValue(null);
    db.prestamo.create.mockResolvedValue({ id: "n", estado: "ACTIVO", ...entrada });

    const resultado = await crearPrestamo(entrada);

    expect(resultado.vencido).toBe(false);
    expect(db.prestamo.create).toHaveBeenCalledOnce();
  });

  it("falla con NotFoundError si el equipo no existe", async () => {
    db.equipo.findUnique.mockResolvedValue(null);

    await expect(crearPrestamo(entrada)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("falla con NotFoundError si la persona no existe, y NO crea nada", async () => {
    db.persona.findUnique.mockResolvedValue(null);

    await expect(crearPrestamo(entrada)).rejects.toThrow("Persona no encontrada");
    expect(db.prestamo.create).not.toHaveBeenCalled();
  });
});

describe("registrarDevolucion", () => {
  it("no permite devolver dos veces el mismo préstamo", async () => {
    db.prestamo.findUnique.mockResolvedValue({ id: "x", estado: "DEVUELTO" });

    await expect(registrarDevolucion("x")).rejects.toBeInstanceOf(ConflictError);
    expect(db.prestamo.update).not.toHaveBeenCalled();
  });
});
