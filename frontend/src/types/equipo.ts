// Forma "base" del equipo, tal como viaja anidado dentro de un Prestamo (el
// include de Prisma en prestamos.service.ts no agrega el estado derivado,
// eso solo lo hace equipos.service.ts).
export interface EquipoBase {
  id: string;
  nombre: string;
  categoria: string;
  codigo: string;
  descripcion: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Equipo extends EquipoBase {
  estado: "DISPONIBLE" | "PRESTADO";
}

export interface EquipoInput {
  nombre: string;
  categoria: string;
  codigo: string;
  descripcion?: string;
}
