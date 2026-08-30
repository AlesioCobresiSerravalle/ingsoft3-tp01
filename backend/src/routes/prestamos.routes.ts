import { Router } from "express";
import * as prestamosController from "../controllers/prestamos.controller";
import { validateBody } from "../middlewares/validate";
import { crearPrestamoSchema } from "../schemas/prestamo.schema";

export const prestamosRouter = Router();

prestamosRouter.get("/", prestamosController.listar);
prestamosRouter.get("/:id", prestamosController.obtenerPorId);
prestamosRouter.post("/", validateBody(crearPrestamoSchema), prestamosController.crear);
prestamosRouter.post("/:id/devolucion", prestamosController.devolucion);
