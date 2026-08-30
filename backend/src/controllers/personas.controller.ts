import type { Request, Response } from "express";
import * as personasService from "../services/personas.service";

export async function listar(req: Request, res: Response) {
  const busqueda = typeof req.query.q === "string" ? req.query.q : undefined;
  const personas = await personasService.listarPersonas(busqueda);
  res.json(personas);
}

export async function obtenerPorId(req: Request<{ id: string }>, res: Response) {
  const persona = await personasService.obtenerPersonaPorId(req.params.id);
  res.json(persona);
}

export async function crear(req: Request, res: Response) {
  const persona = await personasService.crearPersona(req.body);
  res.status(201).json(persona);
}

export async function actualizar(req: Request<{ id: string }>, res: Response) {
  const persona = await personasService.actualizarPersona(req.params.id, req.body);
  res.json(persona);
}

export async function eliminar(req: Request<{ id: string }>, res: Response) {
  await personasService.eliminarPersona(req.params.id);
  res.status(204).send();
}
