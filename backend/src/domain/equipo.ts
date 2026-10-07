// El estado de un Equipo no se guarda: se deriva de si tiene préstamos activos.
export type EstadoEquipo = "DISPONIBLE" | "PRESTADO";

export function estadoDeEquipo(cantidadPrestamosActivos: number): EstadoEquipo {
  return cantidadPrestamosActivos > 0 ? "PRESTADO" : "DISPONIBLE";
}

export function conEstadoDerivado<T extends { prestamos: unknown[] }>(equipo: T) {
  const { prestamos, ...resto } = equipo;
  return { ...resto, estado: estadoDeEquipo(prestamos.length) };
}
