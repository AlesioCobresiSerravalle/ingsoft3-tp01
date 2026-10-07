import type { PrestamoParaCalculo } from "./prestamo";

export type NivelDeRetraso = "AL_DIA" | "LEVE" | "MODERADO" | "GRAVE" | "CRITICO";

const MS_POR_DIA = 24 * 60 * 60 * 1000;

/** Días enteros de atraso de un préstamo activo (0 si no está vencido). */
export function diasDeRetraso(p: PrestamoParaCalculo, ahora: Date = new Date()): number {
  if (p.estado !== "ACTIVO") {
    return 0;
  }
  const atraso = ahora.getTime() - p.fechaDevolucionPrevista.getTime();
  return atraso > 0 ? Math.floor(atraso / MS_POR_DIA) : 0;
}

/** Clasifica la gravedad del atraso para priorizar a quién reclamarle primero. */
export function nivelDeRetraso(p: PrestamoParaCalculo, ahora: Date = new Date()): NivelDeRetraso {
  const dias = diasDeRetraso(p, ahora);
  if (dias === 0) {
    return "AL_DIA";
  }
  if (dias <= 3) {
    return "LEVE";
  }
  if (dias <= 7) {
    return "MODERADO";
  }
  if (dias <= 30) {
    return "GRAVE";
  }
  return "CRITICO";
}
