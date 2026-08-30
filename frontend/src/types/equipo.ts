export interface Equipo {
  id: string;
  nombre: string;
  categoria: string;
  codigo: string;
  descripcion: string | null;
  estado: "DISPONIBLE" | "PRESTADO";
  createdAt: string;
  updatedAt: string;
}

export interface EquipoInput {
  nombre: string;
  categoria: string;
  codigo: string;
  descripcion?: string;
}
