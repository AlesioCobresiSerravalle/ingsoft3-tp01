import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError";

// Errores generados por middlewares internos de Express (p. ej. el parseo de
// JSON del body-parser ante un body malformado) siguen la convención de la
// librería `http-errors`: traen su propio `statusCode` y `expose: true`
// cuando el mensaje es seguro de mostrarle al cliente.
function isExposableHttpError(
  err: unknown,
): err is { statusCode: number; expose: true; message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "statusCode" in err &&
    typeof (err as { statusCode: unknown }).statusCode === "number" &&
    "expose" in err &&
    (err as { expose: unknown }).expose === true
  );
}

// Middleware de errores de Express: se reconoce por tener 4 parámetros.
// Va al final de app.ts, después de todas las rutas.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: { message: err.message } });
    return;
  }

  if (isExposableHttpError(err)) {
    res.status(err.statusCode).json({ error: { message: err.message } });
    return;
  }

  // Error no anticipado: no se expone su detalle al cliente, solo se loguea.
  console.error(err);
  res.status(500).json({ error: { message: "Error interno del servidor" } });
};
