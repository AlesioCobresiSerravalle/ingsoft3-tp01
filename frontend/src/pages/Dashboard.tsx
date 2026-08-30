import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { StateMessage } from "../components/StateMessage";
import { StatTile } from "../components/StatTile";
import * as dashboardApi from "../api/dashboard";
import type { ResumenDashboard } from "../types/dashboard";

export default function Dashboard() {
  const [resumen, setResumen] = useState<ResumenDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardApi
      .obtenerResumen()
      .then(setResumen)
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar el resumen"));
  }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Estado general del inventario: cuántos equipos hay, cuántos están disponibles o prestados, y qué préstamos necesitan atención."
      />
      {error && <StateMessage tono="error">{error}</StateMessage>}
      {!resumen && !error && <StateMessage tono="loading">Cargando resumen…</StateMessage>}
      {resumen && (
        <div className="stat-grid">
          <StatTile etiqueta="Equipos totales" valor={resumen.totalEquipos} acento="brand" />
          <StatTile etiqueta="Disponibles" valor={resumen.disponibles} acento="success" />
          <StatTile etiqueta="Prestados" valor={resumen.prestados} acento="info" />
          <StatTile etiqueta="Vencidos" valor={resumen.vencidos} acento="danger" />
          <StatTile etiqueta="Próximos a vencer" valor={resumen.proximosAVencer} acento="warning" />
        </div>
      )}
    </div>
  );
}
