import type { Prestamo } from "../types/prestamo";

const MS_POR_DIA = 24 * 60 * 60 * 1000;

/**
 * Texto corto sobre el vencimiento de un préstamo, para mostrar en la tabla.
 * Cuenta días de calendario (UTC), igual que `formatearFecha`.
 */
export function textoDeVencimiento(
  prestamo: Pick<Prestamo, "estado" | "fechaDevolucionPrevista" | "fechaDevolucionReal">,
  ahora: Date = new Date(),
): string {
  if (prestamo.estado === "DEVUELTO") {
    return prestamo.fechaDevolucionReal ? "Devuelto" : "Devuelto (sin fecha)";
  }

  const hoy = Date.UTC(ahora.getUTCFullYear(), ahora.getUTCMonth(), ahora.getUTCDate());
  const prevista = new Date(prestamo.fechaDevolucionPrevista);
  const dia = Date.UTC(prevista.getUTCFullYear(), prevista.getUTCMonth(), prevista.getUTCDate());
  const dias = Math.round((dia - hoy) / MS_POR_DIA);

  if (dias < 0) {
    return dias === -1 ? "Vencido ayer" : `Vencido hace ${-dias} días`;
  }
  if (dias === 0) {
    return "Vence hoy";
  }
  return dias === 1 ? "Vence mañana" : `Vence en ${dias} días`;
}
