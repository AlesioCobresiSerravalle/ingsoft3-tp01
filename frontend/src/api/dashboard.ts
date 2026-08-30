import { apiFetch } from "./client";
import type { ResumenDashboard } from "../types/dashboard";

export function obtenerResumen() {
  return apiFetch<ResumenDashboard>("/dashboard/resumen");
}
