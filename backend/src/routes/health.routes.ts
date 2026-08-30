import { Router } from "express";

export const healthRouter = Router();

// Liveness: confirma que el proceso responde. No consulta la base de datos
// (esa verificación de "readiness" la hace el healthcheck del servicio `db`
// en docker-compose, más adelante).
healthRouter.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
