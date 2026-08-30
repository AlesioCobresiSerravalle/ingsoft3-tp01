interface Props {
  etiqueta: string;
  valor: number;
}

export function StatTile({ etiqueta, valor }: Props) {
  return (
    <div className="stat-tile">
      <p className="stat-tile-valor">{valor}</p>
      <p className="stat-tile-etiqueta">{etiqueta}</p>
    </div>
  );
}
