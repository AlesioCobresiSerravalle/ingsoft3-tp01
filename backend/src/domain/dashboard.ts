import { esProximoAVencer, estaVencido, type PrestamoParaCalculo } from "./prestamo";

export interface PrestamoActivoParaResumen extends PrestamoParaCalculo {
  equipoId: string;
}

export function calcularResumen(
  totalEquipos: number,
  prestamosActivos: PrestamoActivoParaResumen[],
  ahora: Date = new Date(),
) {
  const prestados = new Set(prestamosActivos.map((p) => p.equipoId)).size;
  return {
    totalEquipos,
    disponibles: totalEquipos - prestados,
    prestados,
    vencidos: prestamosActivos.filter((p) => estaVencido(p, ahora)).length,
    proximosAVencer: prestamosActivos.filter((p) => esProximoAVencer(p, ahora)).length,
  };
}
