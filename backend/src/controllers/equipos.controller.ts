import type { Request, Response } from "express";
import * as equiposService from "../services/equipos.service";

// Los métodos son async y no llevan try/catch: Express 5 reenvía
// automáticamente cualquier rechazo de la promesa al errorHandler.

export async function listar(req: Request, res: Response) {
  const busqueda = typeof req.query.q === "string" ? req.query.q : undefined;
  const equipos = await equiposService.listarEquipos(busqueda);
  res.json(equipos);
}

export async function obtenerPorId(req: Request<{ id: string }>, res: Response) {
  const equipo = await equiposService.obtenerEquipoPorId(req.params.id);
  res.json(equipo);
}

export async function crear(req: Request, res: Response) {
  const equipo = await equiposService.crearEquipo(req.body);
  res.status(201).json(equipo);
}

export async function actualizar(req: Request<{ id: string }>, res: Response) {
  const equipo = await equiposService.actualizarEquipo(req.params.id, req.body);
  res.json(equipo);
}

export async function eliminar(req: Request<{ id: string }>, res: Response) {
  await equiposService.eliminarEquipo(req.params.id);
  res.status(204).send();
}
