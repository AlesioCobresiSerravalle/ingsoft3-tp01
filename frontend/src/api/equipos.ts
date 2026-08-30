import { apiFetch } from "./client";
import type { Equipo, EquipoInput } from "../types/equipo";

export function listarEquipos(busqueda?: string) {
  const query = busqueda ? `?q=${encodeURIComponent(busqueda)}` : "";
  return apiFetch<Equipo[]>(`/equipos${query}`);
}

export function crearEquipo(data: EquipoInput) {
  return apiFetch<Equipo>("/equipos", { method: "POST", body: JSON.stringify(data) });
}

export function actualizarEquipo(id: string, data: Partial<EquipoInput>) {
  return apiFetch<Equipo>(`/equipos/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function eliminarEquipo(id: string) {
  return apiFetch<void>(`/equipos/${id}`, { method: "DELETE" });
}
