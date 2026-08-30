type Tono = "success" | "info" | "warning" | "danger" | "neutral";

interface Props {
  label: string;
  tono: Tono;
}

// Componente puramente visual: no decide reglas de negocio, solo traduce un
// valor que ya viene del backend (estado de Equipo, o estado+vencido de
// Prestamo) a un color consistente en toda la app.
export function StatusBadge({ label, tono }: Props) {
  return <span className={`badge badge-${tono}`}>{label}</span>;
}
