import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { BadRequestError } from "../errors/AppError";

// Valida req.body contra un schema de Zod antes de que llegue al controller.
// Si es válido, reemplaza req.body por los datos ya parseados (con los
// valores por defecto que el schema haya aplicado).
export function validateBody(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const mensaje = result.error.issues.map((issue) => issue.message).join(", ");
      next(new BadRequestError(mensaje));
      return;
    }
    req.body = result.data;
    next();
  };
}
