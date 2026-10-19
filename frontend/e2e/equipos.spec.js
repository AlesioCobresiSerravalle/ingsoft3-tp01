import { expect, test } from "@playwright/test";

// Extremo a extremo: un navegador de verdad contra el front desplegado, que a
// su vez habla con su API y su base. Cada flujo limpia lo que crea.
//
// NINGÚN flujo crea préstamos (no hay forma de borrarlos; ver api.spec.js).

const API = process.env.API_BASE_URL || "http://localhost:3000";
const unico = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Códigos creados por el test en curso. Se limpian SIEMPRE al terminar, por la
// API y no por la pantalla: si el test falló porque la interfaz está rota, la
// limpieza por pantalla fallaría igual y dejaría datos de prueba en QA.
let creados = [];

async function crearEquipo(page, { nombre, categoria, codigo }) {
  creados.push(codigo);
  await page.getByLabel("Nombre", { exact: true }).fill(nombre);
  await page.getByLabel("Categoría", { exact: true }).fill(categoria);
  await page.getByLabel("Código", { exact: true }).fill(codigo);
  await page.getByRole("button", { name: "Crear equipo" }).click();
}

async function borrarEquipo(page, nombre) {
  await page.getByRole("button", { name: `Eliminar ${nombre}` }).click();
  await expect(page.getByText(nombre, { exact: true })).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
  creados = [];
  await page.goto("/equipamiento");
});

test.afterEach(async ({ request }) => {
  const lista = await (await request.get(`${API}/api/equipos`)).json();
  for (const e of lista.filter((x) => creados.includes(x.codigo))) {
    await request.delete(`${API}/api/equipos/${e.id}`); // si el flujo ya lo borró, no queda nada que borrar
  }
});

test("crear un equipo lo muestra en la tabla, y eliminarlo lo saca", async ({ page }) => {
  const s = unico();
  const nombre = `e2e equipo ${s}`;

  await crearEquipo(page, { nombre, categoria: "prueba-automatica", codigo: `E2E-${s}` });

  // el dato que ESTE test creó, sin sleeps
  await expect(page.getByText(nombre, { exact: true })).toBeVisible();

  await borrarEquipo(page, nombre); // y el borrado, comprobado
});

test("un código repetido muestra el error al usuario y no crea un segundo equipo", async ({ page }) => {
  const s = unico();
  const primero = `e2e primero ${s}`;
  const segundo = `e2e segundo ${s}`;
  const codigo = `E2E-${s}`;

  await crearEquipo(page, { nombre: primero, categoria: "prueba-automatica", codigo });
  await expect(page.getByText(primero, { exact: true })).toBeVisible();
  try {
    await crearEquipo(page, { nombre: segundo, categoria: "prueba-automatica", codigo });

    await expect(page.getByRole("alert")).toBeVisible(); // el usuario ve el error…
    await expect(page.getByText(segundo, { exact: true })).toHaveCount(0); // …y no apareció nada
  } finally {
    await borrarEquipo(page, primero);
  }
});

test("lo creado sigue ahí después de recargar la página (se guardó de verdad)", async ({ page }) => {
  const s = unico();
  const nombre = `e2e persistente ${s}`;

  await crearEquipo(page, { nombre, categoria: "prueba-automatica", codigo: `E2E-${s}` });
  await expect(page.getByText(nombre, { exact: true })).toBeVisible();

  await page.reload(); // la lista vuelve a pedirse a la API: si no se guardó, desaparece
  await expect(page.getByText(nombre, { exact: true })).toBeVisible();

  await borrarEquipo(page, nombre);
});
