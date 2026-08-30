import { prisma } from "../lib/prisma";
import { estaVencido } from "./prestamos.service";

// Ventana para considerar un préstamo "próximo a vencer". No es un requisito
// del enunciado con un número fijo, así que se deja como constante local,
// fácil de ajustar y de justificar (3 días es un margen razonable para
// avisar antes de que algo se venza).
const DIAS_PROXIMO_A_VENCER = 3;

export async function obtenerResumen() {
  const totalEquipos = await prisma.equipo.count();

  const prestamosActivos = await prisma.prestamo.findMany({
    where: { estado: "ACTIVO" },
    select: { equipoId: true, estado: true, fechaDevolucionPrevista: true },
  });

  const equiposPrestados = new Set(prestamosActivos.map((p) => p.equipoId));
  const prestados = equiposPrestados.size;
  const disponibles = totalEquipos - prestados;

  const vencidos = prestamosActivos.filter(estaVencido).length;

  const limiteProximoAVencer = new Date(Date.now() + DIAS_PROXIMO_A_VENCER * 24 * 60 * 60 * 1000);
  const proximosAVencer = prestamosActivos.filter(
    (p) => !estaVencido(p) && p.fechaDevolucionPrevista <= limiteProximoAVencer,
  ).length;

  return { totalEquipos, disponibles, prestados, vencidos, proximosAVencer };
}
