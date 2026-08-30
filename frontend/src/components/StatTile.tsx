type Acento = "brand" | "success" | "info" | "warning" | "danger";

interface Props {
  etiqueta: string;
  valor: number;
  acento?: Acento;
}

const COLOR_POR_ACENTO: Record<Acento, string> = {
  brand: "var(--brand)",
  success: "var(--success)",
  info: "var(--info)",
  warning: "var(--warning)",
  danger: "var(--danger)",
};

export function StatTile({ etiqueta, valor, acento = "brand" }: Props) {
  return (
    <div className="stat-tile" style={{ "--tile-accent": COLOR_POR_ACENTO[acento] } as React.CSSProperties}>
      <p className="stat-tile-valor">{valor}</p>
      <p className="stat-tile-etiqueta">{etiqueta}</p>
    </div>
  );
}
