import type { Prestamo } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ConflictError, NotFoundError } from "../errors/AppError";
import type { CrearPrestamoInput } from "../schemas/prestamo.schema";

type FiltroEstado = "activo" | "devuelto" | "vencido";

// Único lugar de todo el backend donde se calcula "vencido" (ver
// decisiones.md, sección "Modelo de datos"): nunca se persiste, siempre se
// deriva comparando contra el reloj en el momento de leer.
function estaVencido(prestamo: Pick<Prestamo, "estado" | "fechaDevolucionPrevista">) {
  return prestamo.estado === "ACTIVO" && prestamo.fechaDevolucionPrevista < new Date();
}

function conVencidoCalculado<T extends Pick<Prestamo, "estado" | "fechaDevolucionPrevista">>(
  prestamo: T,
) {
  return { ...prestamo, vencido: estaVencido(prestamo) };
}

export async function listarPrestamos(filtroEstado?: FiltroEstado) {
  const where =
    filtroEstado === "devuelto"
      ? { estado: "DEVUELTO" as const }
      : filtroEstado === "activo" || filtroEstado === "vencido"
        ? { estado: "ACTIVO" as const }
        : undefined;

  const prestamos = await prisma.prestamo.findMany({
    where,
    include: { equipo: true, persona: true },
    orderBy: { fechaPrestamo: "desc" },
  });

  const conVencido = prestamos.map(conVencidoCalculado);

  // "vencido" no es un valor de `estado` en la base: se filtra en memoria
  // sobre los activos, después de calcularlo.
  return filtroEstado === "vencido" ? conVencido.filter((p) => p.vencido) : conVencido;
}

export async function obtenerPrestamoPorId(id: string) {
  const prestamo = await prisma.prestamo.findUnique({
    where: { id },
    include: { equipo: true, persona: true },
  });

  if (!prestamo) {
    throw new NotFoundError("Préstamo no encontrado");
  }

  return conVencidoCalculado(prestamo);
}

export async function crearPrestamo(data: CrearPrestamoInput) {
  // Reglas 1 y 2 del enunciado, resueltas dentro de una transacción: si dos
  // requests casi simultáneos intentan prestar el mismo equipo, la segunda
  // ve el préstamo que acaba de crear la primera y falla — no una condición
  // de carrera silenciosa.
  return prisma.$transaction(async (tx) => {
    const equipo = await tx.equipo.findUnique({ where: { id: data.equipoId } });
    if (!equipo) {
      throw new NotFoundError("Equipo no encontrado");
    }

    const persona = await tx.persona.findUnique({ where: { id: data.personaId } });
    if (!persona) {
      throw new NotFoundError("Persona no encontrada");
    }

    const prestamoActivo = await tx.prestamo.findFirst({
      where: { equipoId: data.equipoId, fechaDevolucionReal: null },
    });
    if (prestamoActivo) {
      throw new ConflictError("El equipo ya tiene un préstamo activo");
    }

    const prestamo = await tx.prestamo.create({
      data: {
        equipoId: data.equipoId,
        personaId: data.personaId,
        fechaDevolucionPrevista: data.fechaDevolucionPrevista,
      },
      include: { equipo: true, persona: true },
    });

    return conVencidoCalculado(prestamo);
  });
}

export async function registrarDevolucion(id: string) {
  const prestamo = await prisma.prestamo.findUnique({ where: { id } });

  if (!prestamo) {
    throw new NotFoundError("Préstamo no encontrado");
  }
  if (prestamo.estado === "DEVUELTO") {
    throw new ConflictError("El préstamo ya fue devuelto");
  }

  const actualizado = await prisma.prestamo.update({
    where: { id },
    data: { estado: "DEVUELTO", fechaDevolucionReal: new Date() },
    include: { equipo: true, persona: true },
  });

  return conVencidoCalculado(actualizado);
}
