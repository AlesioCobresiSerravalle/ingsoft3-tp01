import type { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";

export async function resumen(_req: Request, res: Response) {
  const data = await dashboardService.obtenerResumen();
  res.json(data);
}
