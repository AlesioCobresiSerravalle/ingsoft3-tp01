import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
});

// Falla rápido: si el entorno está mal configurado, el proceso ni siquiera
// llega a levantar el servidor.
export const env = envSchema.parse(process.env);
