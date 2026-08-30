import { z } from "zod";

export const crearPrestamoSchema = z
  .object({
    equipoId: z.string().uuid("equipoId debe ser un UUID válido"),
    personaId: z.string().uuid("personaId debe ser un UUID válido"),
    fechaDevolucionPrevista: z.coerce.date(),
  })
  // Regla de negocio 3: la fecha de devolución prevista no puede ser
  // anterior a la fecha del préstamo. fechaPrestamo siempre es "ahora" (la
  // asigna el servidor al crear), así que acá se compara contra el reloj.
  .refine((data) => data.fechaDevolucionPrevista >= new Date(), {
    message: "La fecha de devolución prevista no puede ser anterior a la fecha del préstamo",
    path: ["fechaDevolucionPrevista"],
  });

export type CrearPrestamoInput = z.infer<typeof crearPrestamoSchema>;
