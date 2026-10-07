import type { Prestamo } from "../types/prestamo";
import { etiquetaDePrestamo } from "../lib/estados";
import { formatearFecha } from "../lib/fechas";
import { StateMessage } from "./StateMessage";
import { StatusBadge } from "./StatusBadge";

interface Props {
  prestamos: Prestamo[];
  onDevolucion: (prestamo: Prestamo) => void;
}

export function PrestamoTable({ prestamos, onDevolucion }: Props) {
  if (prestamos.length === 0) {
    return <StateMessage tono="empty">No hay préstamos para mostrar todavía.</StateMessage>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Equipo</th>
            <th>Persona</th>
            <th>Prestado el</th>
            <th>Devolución prevista</th>
            <th>Devuelto el</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map((prestamo) => (
            <tr key={prestamo.id}>
              <td>{prestamo.equipo.nombre}</td>
              <td>{prestamo.persona.nombre}</td>
              <td>{formatearFecha(prestamo.fechaPrestamo)}</td>
              <td>{formatearFecha(prestamo.fechaDevolucionPrevista)}</td>
              <td>{prestamo.fechaDevolucionReal ? formatearFecha(prestamo.fechaDevolucionReal) : "—"}</td>
              <td>
                <StatusBadge {...etiquetaDePrestamo(prestamo)} />
              </td>
              <td>
                {prestamo.estado === "ACTIVO" && (
                  <button className="btn btn-primary btn-sm" onClick={() => onDevolucion(prestamo)}>
                    Registrar devolución
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
