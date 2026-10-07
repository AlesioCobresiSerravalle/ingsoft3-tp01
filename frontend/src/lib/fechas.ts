// Se fuerza UTC al formatear: estas fechas representan un DÍA (elegido en un
// <input type="date">, que no lleva hora), no un instante. Sin forzar la zona,
// toLocaleDateString() muestra el día anterior en husos detrás de UTC.
export function formatearFecha(iso: string, locale: string = "es-AR"): string {
  return new Date(iso).toLocaleDateString(locale, { timeZone: "UTC" });
}

// Valor de <input type="date"> ("2026-09-06") -> ISO que espera el backend.
export function fechaInputAIso(valor: string): string {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) {
    throw new Error("La fecha ingresada no es válida");
  }
  return fecha.toISOString();
}
