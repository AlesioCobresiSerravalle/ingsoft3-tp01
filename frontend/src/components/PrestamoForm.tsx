import { useEffect, useState, type FormEvent } from "react";
import * as equiposApi from "../api/equipos";
import * as personasApi from "../api/personas";
import type { Equipo } from "../types/equipo";
import type { Persona } from "../types/persona";
import type { PrestamoInput } from "../types/prestamo";

interface Props {
  onSubmit: (data: PrestamoInput) => Promise<void>;
}

// No hay pantalla propia de Personas en el diseño de la interfaz (solo
// Dashboard, Equipamiento y Préstamos): acá se resuelve con un selector de
// personas existentes más un alta rápida, sin construir un CRUD completo
// que el enunciado no pide.
export function PrestamoForm({ onSubmit }: Props) {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [equipoId, setEquipoId] = useState("");
  const [personaId, setPersonaId] = useState("");
  const [fechaDevolucionPrevista, setFechaDevolucionPrevista] = useState("");
  const [nuevaPersonaNombre, setNuevaPersonaNombre] = useState("");
  const [nuevaPersonaEmail, setNuevaPersonaEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function cargarListas() {
    const [equiposData, personasData] = await Promise.all([
      equiposApi.listarEquipos(),
      personasApi.listarPersonas(),
    ]);
    setEquipos(equiposData.filter((equipo) => equipo.estado === "DISPONIBLE"));
    setPersonas(personasData);
  }

  useEffect(() => {
    cargarListas();
  }, []);

  async function handleAgregarPersona() {
    setError(null);
    try {
      const persona = await personasApi.crearPersona({
        nombre: nuevaPersonaNombre,
        email: nuevaPersonaEmail,
      });
      setPersonas((prev) => [...prev, persona]);
      setPersonaId(persona.id);
      setNuevaPersonaNombre("");
      setNuevaPersonaEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la persona");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await onSubmit({
        equipoId,
        personaId,
        fechaDevolucionPrevista: new Date(fechaDevolucionPrevista).toISOString(),
      });
      setEquipoId("");
      setPersonaId("");
      setFechaDevolucionPrevista("");
      await cargarListas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar préstamo</h2>
      {error && <p role="alert">{error}</p>}

      <label>
        Equipo (solo disponibles)
        <select value={equipoId} onChange={(e) => setEquipoId(e.target.value)} required>
          <option value="" disabled>
            Elegí un equipo
          </option>
          {equipos.map((equipo) => (
            <option key={equipo.id} value={equipo.id}>
              {equipo.nombre} ({equipo.codigo})
            </option>
          ))}
        </select>
      </label>

      <label>
        Persona
        <select value={personaId} onChange={(e) => setPersonaId(e.target.value)} required>
          <option value="" disabled>
            Elegí una persona
          </option>
          {personas.map((persona) => (
            <option key={persona.id} value={persona.id}>
              {persona.nombre} ({persona.email})
            </option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend>¿La persona no está en la lista?</legend>
        <input
          placeholder="Nombre"
          value={nuevaPersonaNombre}
          onChange={(e) => setNuevaPersonaNombre(e.target.value)}
        />
        <input
          placeholder="Email"
          value={nuevaPersonaEmail}
          onChange={(e) => setNuevaPersonaEmail(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAgregarPersona}
          disabled={!nuevaPersonaNombre || !nuevaPersonaEmail}
        >
          Agregar persona
        </button>
      </fieldset>

      <label>
        Fecha de devolución prevista
        <input
          type="date"
          value={fechaDevolucionPrevista}
          onChange={(e) => setFechaDevolucionPrevista(e.target.value)}
          required
        />
      </label>

      <button type="submit" disabled={enviando || !equipoId || !personaId}>
        Registrar préstamo
      </button>
    </form>
  );
}
