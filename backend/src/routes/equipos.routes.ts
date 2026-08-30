import { Router } from "express";
import * as equiposController from "../controllers/equipos.controller";
import { validateBody } from "../middlewares/validate";
import { actualizarEquipoSchema, crearEquipoSchema } from "../schemas/equipo.schema";

export const equiposRouter = Router();

equiposRouter.get("/", equiposController.listar);
equiposRouter.get("/:id", equiposController.obtenerPorId);
equiposRouter.post("/", validateBody(crearEquipoSchema), equiposController.crear);
equiposRouter.patch("/:id", validateBody(actualizarEquipoSchema), equiposController.actualizar);
equiposRouter.delete("/:id", equiposController.eliminar);
