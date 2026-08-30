import type { EquipoBase } from "./equipo";
import type { Persona } from "./persona";

export interface Prestamo {
  id: string;
  equipoId: string;
  personaId: string;
  fechaPrestamo: string;
  fechaDevolucionPrevista: string;
  fechaDevolucionReal: string | null;
  estado: "ACTIVO" | "DEVUELTO";
  // Calculado por el backend en cada respuesta, nunca persistido (ver
  // decisiones.md, sección "Modelo de datos").
  vencido: boolean;
  equipo: EquipoBase;
  persona: Persona;
}

export interface PrestamoInput {
  equipoId: string;
  personaId: string;
  fechaDevolucionPrevista: string;
}
