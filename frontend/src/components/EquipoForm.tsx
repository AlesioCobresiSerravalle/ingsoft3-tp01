import { useEffect, useState, type FormEvent } from "react";
import type { Equipo, EquipoInput } from "../types/equipo";
import { StateMessage } from "./StateMessage";

interface Props {
  equipoAEditar: Equipo | null;
  onSubmit: (data: EquipoInput) => Promise<void>;
  onCancelar: () => void;
}

const FORM_VACIO: EquipoInput = { nombre: "", categoria: "", codigo: "", descripcion: "" };

// El formulario no valida reglas de negocio (p. ej. si el código ya existe):
// eso lo decide el backend, y este componente solo muestra el error que
// devuelva.
export function EquipoForm({ equipoAEditar, onSubmit, onCancelar }: Props) {
  const [form, setForm] = useState<EquipoInput>(FORM_VACIO);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(
      equipoAEditar
        ? {
            nombre: equipoAEditar.nombre,
            categoria: equipoAEditar.categoria,
            codigo: equipoAEditar.codigo,
            descripcion: equipoAEditar.descripcion ?? "",
          }
        : FORM_VACIO,
    );
    setError(null);
  }, [equipoAEditar]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await onSubmit(form);
      if (!equipoAEditar) {
        setForm(FORM_VACIO);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{equipoAEditar ? "Editar equipo" : "Nuevo equipo"}</h2>
      <p className="card-description">
        {equipoAEditar
          ? "Modificá los datos del equipo seleccionado."
          : "Cargá un equipo nuevo al inventario (kits, instrumental, accesorios, etc.)."}
      </p>
      {error && <StateMessage tono="error">{error}</StateMessage>}
      <div className="field-row">
        <label className="field">
          Nombre
          <input
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
        </label>
        <label className="field">
          Categoría
          <input
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            required
          />
        </label>
        <label className="field">
          Código
          <input
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            required
          />
        </label>
        <label className="field">
          Descripción
          <input
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {equipoAEditar ? "Guardar cambios" : "Crear equipo"}
        </button>
        {equipoAEditar && (
          <button type="button" className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
