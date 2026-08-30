import { z } from "zod";

export const crearEquipoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  categoria: z.string().min(1, "La categoría es requerida"),
  codigo: z.string().min(1, "El código es requerido"),
  descripcion: z.string().optional(),
});

export const actualizarEquipoSchema = crearEquipoSchema.partial();

export type CrearEquipoInput = z.infer<typeof crearEquipoSchema>;
export type ActualizarEquipoInput = z.infer<typeof actualizarEquipoSchema>;
