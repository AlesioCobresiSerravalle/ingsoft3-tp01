import { z } from "zod";

export const crearPersonaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("El email no es válido"),
});

export const actualizarPersonaSchema = crearPersonaSchema.partial();

export type CrearPersonaInput = z.infer<typeof crearPersonaSchema>;
export type ActualizarPersonaInput = z.infer<typeof actualizarPersonaSchema>;
