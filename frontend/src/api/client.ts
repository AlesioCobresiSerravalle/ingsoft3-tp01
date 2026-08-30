// Wrapper de fetch con una única regla: toda llamada usa una ruta RELATIVA
// bajo /api. Quién traduce esa ruta cambia según el entorno (el proxy de
// Vite en desarrollo, nginx en Docker) pero este archivo nunca lo sabe ni
// le importa — así la misma imagen de frontend sirve en cualquier entorno.
const BASE_URL = "/api";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.error?.message ?? `Error ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
