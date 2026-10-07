import { prisma } from "../lib/prisma";
import { calcularResumen } from "../domain/dashboard";

export async function obtenerResumen() {
  const totalEquipos = await prisma.equipo.count();
  const prestamosActivos = await prisma.prestamo.findMany({
    where: { estado: "ACTIVO" },
    select: { equipoId: true, estado: true, fechaDevolucionPrevista: true },
  });
  return calcularResumen(totalEquipos, prestamosActivos);
}
