import type { Request, Response } from "express";
import * as prestamosService from "../services/prestamos.service";

const ESTADOS_VALIDOS = ["activo", "devuelto", "vencido"] as const;
type FiltroEstado = (typeof ESTADOS_VALIDOS)[number];

function parseFiltroEstado(valor: unknown): FiltroEstado | undefined {
  if (typeof valor === "string" && (ESTADOS_VALIDOS as readonly string[]).includes(valor)) {
    return valor as FiltroEstado;
  }
  return undefined;
}

export async function listar(req: Request, res: Response) {
  const filtroEstado = parseFiltroEstado(req.query.estado);
  const prestamos = await prestamosService.listarPrestamos(filtroEstado);
  res.json(prestamos);
}

export async function obtenerPorId(req: Request<{ id: string }>, res: Response) {
  const prestamo = await prestamosService.obtenerPrestamoPorId(req.params.id);
  res.json(prestamo);
}

export async function crear(req: Request, res: Response) {
  const prestamo = await prestamosService.crearPrestamo(req.body);
  res.status(201).json(prestamo);
}

export async function devolucion(req: Request<{ id: string }>, res: Response) {
  const prestamo = await prestamosService.registrarDevolucion(req.params.id);
  res.json(prestamo);
}
