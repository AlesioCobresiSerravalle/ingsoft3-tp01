// Reglas puras del dominio de préstamos: sin Prisma, sin Express, sin leer el
// reloj por su cuenta (el "ahora" entra por parámetro), así se testean sin
// dobles. Es el único lugar donde se define "vencido" (decisiones.md).
export interface PrestamoParaCalculo {
  estado: "ACTIVO" | "DEVUELTO";
  fechaDevolucionPrevista: Date;
}

export const DIAS_PROXIMO_A_VENCER = 3;
const MS_POR_DIA = 24 * 60 * 60 * 1000;

export function estaVencido(prestamo: PrestamoParaCalculo, ahora: Date = new Date()): boolean {
  return prestamo.estado === "ACTIVO" && prestamo.fechaDevolucionPrevista < ahora;
}

export function esProximoAVencer(prestamo: PrestamoParaCalculo, ahora: Date = new Date()): boolean {
  const limite = new Date(ahora.getTime() + DIAS_PROXIMO_A_VENCER * MS_POR_DIA);
  return (
    prestamo.estado === "ACTIVO" &&
    !estaVencido(prestamo, ahora) &&
    prestamo.fechaDevolucionPrevista <= limite
  );
}

export function conVencidoCalculado<T extends PrestamoParaCalculo>(prestamo: T, ahora: Date = new Date()) {
  return { ...prestamo, vencido: estaVencido(prestamo, ahora) };
}
