import { apiFetch } from "./client";
import type { Persona, PersonaInput } from "../types/persona";

export function listarPersonas(busqueda?: string) {
  const query = busqueda ? `?q=${encodeURIComponent(busqueda)}` : "";
  return apiFetch<Persona[]>(`/personas${query}`);
}

export function crearPersona(data: PersonaInput) {
  return apiFetch<Persona>("/personas", { method: "POST", body: JSON.stringify(data) });
}
