import * as Sentry from "@sentry/node";
import express from "express";
import { healthRouter } from "./routes/health.routes";
import { equiposRouter } from "./routes/equipos.routes";
import { personasRouter } from "./routes/personas.routes";
import { prestamosRouter } from "./routes/prestamos.routes";
import { dashboardRouter } from "./routes/dashboard.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { NotFoundError } from "./errors/AppError";

// Solo arma la app (middlewares + rutas). No hace listen(): eso es cosa de
// server.ts, precisamente para poder importar `app` en tests (TP5) sin
// levantar un puerto real.
export const app = express();

app.use(express.json());

app.use("/health", healthRouter);
app.use("/api/equipos", equiposRouter);
app.use("/api/personas", personasRouter);
app.use("/api/prestamos", prestamosRouter);
app.use("/api/dashboard", dashboardRouter);

// TEMPORAL (TP9 §3.5): endpoint que falla a propósito para ver un error llegar a
// Sentry. Se saca por otro pull request cuando termina el práctico.
app.get("/api/falla", () => {
  throw new Error("Falla de prueba del TP9");
});

// Cualquier ruta no reconocida cae acá.
app.use((_req, _res, next) => {
  next(new NotFoundError("Ruta no encontrada"));
});

// El manejador de Sentry va DESPUÉS de las rutas y ANTES del errorHandler propio:
// registra el error (los 5xx) y lo deja pasar para que el nuestro arme la respuesta.
Sentry.setupExpressErrorHandler(app);

// Siempre al final: es lo que Express usa para identificar un
// error-handling middleware (por su firma de 4 parámetros).
app.use(errorHandler);
