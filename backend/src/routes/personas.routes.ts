import { Router } from "express";
import * as personasController from "../controllers/personas.controller";
import { validateBody } from "../middlewares/validate";
import { actualizarPersonaSchema, crearPersonaSchema } from "../schemas/persona.schema";

export const personasRouter = Router();

personasRouter.get("/", personasController.listar);
personasRouter.get("/:id", personasController.obtenerPorId);
personasRouter.post("/", validateBody(crearPersonaSchema), personasController.crear);
personasRouter.patch("/:id", validateBody(actualizarPersonaSchema), personasController.actualizar);
personasRouter.delete("/:id", personasController.eliminar);
