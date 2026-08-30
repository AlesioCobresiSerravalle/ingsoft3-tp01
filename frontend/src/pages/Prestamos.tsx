import { useEffect, useState } from "react";
import { PrestamoForm } from "../components/PrestamoForm";
import { PrestamoTable } from "../components/PrestamoTable";
import * as prestamosApi from "../api/prestamos";
import type { Prestamo, PrestamoInput } from "../types/prestamo";

type Filtro = "todos" | "activo" | "devuelto" | "vencido";

export default function Prestamos() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [error, setError] = useState<string | null>(null);

  async function cargar(filtroActual: Filtro) {
    try {
      setError(null);
      const data = await prestamosApi.listarPrestamos(
        filtroActual === "todos" ? undefined : filtroActual,
      );
      setPrestamos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar préstamos");
    }
  }

  useEffect(() => {
    cargar(filtro);
  }, [filtro]);

  async function handleCrear(data: PrestamoInput) {
    await prestamosApi.crearPrestamo(data);
    await cargar(filtro);
  }

  async function handleDevolucion(prestamo: Prestamo) {
    setError(null);
    try {
      await prestamosApi.registrarDevolucion(prestamo.id);
      await cargar(filtro);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la devolución");
    }
  }

  return (
    <div>
      <h1>Préstamos</h1>

      <label>
        Filtrar por estado{" "}
        <select value={filtro} onChange={(e) => setFiltro(e.target.value as Filtro)}>
          <option value="todos">Todos</option>
          <option value="activo">Activos</option>
          <option value="vencido">Vencidos</option>
          <option value="devuelto">Devueltos</option>
        </select>
      </label>

      {error && <p role="alert">{error}</p>}

      <PrestamoTable prestamos={prestamos} onDevolucion={handleDevolucion} />
      <PrestamoForm onSubmit={handleCrear} />
    </div>
  );
}
