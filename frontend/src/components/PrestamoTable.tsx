import type { Prestamo } from "../types/prestamo";
import { StateMessage } from "./StateMessage";
import { StatusBadge } from "./StatusBadge";

interface Props {
  prestamos: Prestamo[];
  onDevolucion: (prestamo: Prestamo) => void;
}

// Se fuerza UTC al formatear: estas fechas representan un DÍA (elegido en un
// <input type="date">, que no lleva hora), no un instante preciso. Sin
// forzar la zona horaria, `toLocaleDateString()` convierte a la hora local
// del navegador y en cualquier huso horario detrás de UTC se ve el día
// anterior al elegido — un off-by-one real, no cosmético.
function formatearFecha(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { timeZone: "UTC" });
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
              <td>
                {prestamo.vencido ? (
                  <StatusBadge label="Vencido" tono="danger" />
                ) : prestamo.estado === "ACTIVO" ? (
                  <StatusBadge label="Activo" tono="info" />
                ) : (
                  <StatusBadge label="Devuelto" tono="success" />
                )}
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
