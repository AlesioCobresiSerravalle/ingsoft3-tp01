import { apiFetch } from "./client";
import type { Prestamo, PrestamoInput } from "../types/prestamo";

type FiltroEstado = "activo" | "devuelto" | "vencido";

export function listarPrestamos(filtroEstado?: FiltroEstado) {
  const query = filtroEstado ? `?estado=${filtroEstado}` : "";
  return apiFetch<Prestamo[]>(`/prestamos${query}`);
}

export function crearPrestamo(data: PrestamoInput) {
  return apiFetch<Prestamo>("/prestamos", { method: "POST", body: JSON.stringify(data) });
}

export function registrarDevolucion(id: string) {
  return apiFetch<Prestamo>(`/prestamos/${id}/devolucion`, { method: "POST" });
}
