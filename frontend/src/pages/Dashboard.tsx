import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

// Placeholder de esta fase: solo prueba que el proxy de Vite llega al
// backend de verdad. El contenido real del dashboard es la Fase 12.
export default function Dashboard() {
  const [estadoConexion, setEstadoConexion] = useState("Conectando con el backend...");

  useEffect(() => {
    apiFetch("/dashboard/resumen")
      .then((data) => setEstadoConexion(`Backend conectado. Respuesta: ${JSON.stringify(data)}`))
      .catch((err) => setEstadoConexion(`No se pudo conectar con el backend: ${err.message}`));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{estadoConexion}</p>
    </div>
  );
}
