import type { Equipo } from "../types/equipo";

interface Props {
  equipos: Equipo[];
  onEditar: (equipo: Equipo) => void;
  onEliminar: (equipo: Equipo) => void;
}

export function EquipoTable({ equipos, onEditar, onEliminar }: Props) {
  if (equipos.length === 0) {
    return <p>No hay equipos para mostrar.</p>;
  }

  return (
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
            <td>{equipo.estado}</td>
            <td>
              <button onClick={() => onEditar(equipo)}>Editar</button>
              <button onClick={() => onEliminar(equipo)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
