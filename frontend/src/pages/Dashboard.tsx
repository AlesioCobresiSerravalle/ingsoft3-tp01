import { useEffect, useState } from "react";
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
      <h1>Dashboard</h1>
      {error && <p role="alert">{error}</p>}
      {resumen && (
        <div className="stat-grid">
          <StatTile etiqueta="Equipos totales" valor={resumen.totalEquipos} />
          <StatTile etiqueta="Disponibles" valor={resumen.disponibles} />
          <StatTile etiqueta="Prestados" valor={resumen.prestados} />
          <StatTile etiqueta="Vencidos" valor={resumen.vencidos} />
          <StatTile etiqueta="Próximos a vencer" valor={resumen.proximosAVencer} />
        </div>
      )}
    </div>
  );
}
