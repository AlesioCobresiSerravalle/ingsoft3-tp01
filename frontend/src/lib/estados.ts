import type { Equipo } from "../types/equipo";
import type { Prestamo } from "../types/prestamo";

export type Tono = "success" | "info" | "warning" | "danger" | "neutral";
export interface Etiqueta {
  label: string;
  tono: Tono;
}

// Traduce lo que YA decidió el backend a una etiqueta visual. No calcula nada.
export function etiquetaDeEquipo(estado: Equipo["estado"]): Etiqueta {
  return estado === "DISPONIBLE"
    ? { label: "Disponible", tono: "success" }
    : { label: "Prestado", tono: "info" };
}

export function etiquetaDePrestamo(p: Pick<Prestamo, "estado" | "vencido">): Etiqueta {
  if (p.vencido) return { label: "Vencido", tono: "danger" };
  if (p.estado === "ACTIVO") return { label: "Activo", tono: "info" };
  return { label: "Devuelto", tono: "success" };
}
