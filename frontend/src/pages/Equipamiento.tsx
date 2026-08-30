import { useEffect, useState } from "react";
import { EquipoForm } from "../components/EquipoForm";
import { EquipoTable } from "../components/EquipoTable";
import * as equiposApi from "../api/equipos";
import type { Equipo, EquipoInput } from "../types/equipo";

export default function Equipamiento() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [equipoAEditar, setEquipoAEditar] = useState<Equipo | null>(null);
  const [errorLista, setErrorLista] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  async function cargar(busquedaActual: string) {
    try {
      setErrorLista(null);
      const data = await equiposApi.listarEquipos(busquedaActual || undefined);
      setEquipos(data);
    } catch (err) {
      setErrorLista(err instanceof Error ? err.message : "Error al cargar equipos");
    }
  }

  useEffect(() => {
    cargar(busqueda);
  }, [busqueda]);

  async function handleSubmit(data: EquipoInput) {
    if (equipoAEditar) {
      await equiposApi.actualizarEquipo(equipoAEditar.id, data);
      setEquipoAEditar(null);
    } else {
      await equiposApi.crearEquipo(data);
    }
    await cargar(busqueda);
  }

  async function handleEliminar(equipo: Equipo) {
    setErrorAccion(null);
    try {
      await equiposApi.eliminarEquipo(equipo.id);
      await cargar(busqueda);
    } catch (err) {
      setErrorAccion(err instanceof Error ? err.message : "No se pudo eliminar el equipo");
    }
  }

  return (
    <div>
      <h1>Equipamiento</h1>
      <input
        placeholder="Buscar por nombre o código..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      {errorLista && <p role="alert">{errorLista}</p>}
      {errorAccion && <p role="alert">{errorAccion}</p>}
      <EquipoTable equipos={equipos} onEditar={setEquipoAEditar} onEliminar={handleEliminar} />
      <EquipoForm
        equipoAEditar={equipoAEditar}
        onSubmit={handleSubmit}
        onCancelar={() => setEquipoAEditar(null)}
      />
    </div>
  );
}
