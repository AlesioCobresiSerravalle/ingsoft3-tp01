import type { Equipo } from "../types/equipo";
import { StateMessage } from "./StateMessage";
import { StatusBadge } from "./StatusBadge";

interface Props {
  equipos: Equipo[];
  onEditar: (equipo: Equipo) => void;
  onEliminar: (equipo: Equipo) => void;
}

export function EquipoTable({ equipos, onEditar, onEliminar }: Props) {
  if (equipos.length === 0) {
    return <StateMessage tono="empty">No hay equipos para mostrar todavía.</StateMessage>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Código</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {equipos.map((equipo) => (
            <tr key={equipo.id}>
              <td>{equipo.nombre}</td>
              <td>{equipo.categoria}</td>
              <td>{equipo.codigo}</td>
              <td>
                {equipo.estado === "DISPONIBLE" ? (
                  <StatusBadge label="Disponible" tono="success" />
                ) : (
                  <StatusBadge label="Prestado" tono="info" />
                )}
              </td>
              <td className="actions-cell">
                <button className="btn btn-secondary btn-sm" onClick={() => onEditar(equipo)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => onEliminar(equipo)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
