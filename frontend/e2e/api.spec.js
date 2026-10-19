import { expect, test } from "@playwright/test";

// Integración: le hablamos a la API DESPLEGADA (con su base de verdad detrás),
// sin navegador y sin dobles. La API tiene su propia dirección, distinta de la
// del front. Sin barra al final.
const API = process.env.API_BASE_URL || "http://localhost:3000";

// Datos únicos por corrida: no chocan con otra corrida ni con datos reales.
const unico = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const nuevoEquipo = (sufijo = unico()) => ({
  nombre: `e2e api ${sufijo}`,
  categoria: "prueba-automatica",
  codigo: `E2E-${sufijo}`,
});

async function listar(request) {
  const r = await request.get(`${API}/api/equipos`);
  expect(r.status()).toBe(200);
  return r.json();
}

// OJO: esta suite NUNCA crea préstamos. La API no tiene DELETE de préstamos y
// la base los protege con ON DELETE RESTRICT: un préstamo creado no se puede
// limpiar, y bloquearía borrar su equipo y su persona para siempre.

test("crear un equipo lo muestra en la lista, y borrarlo lo saca", async ({ request }) => {
  const datos = nuevoEquipo();

  const creado = await request.post(`${API}/api/equipos`, { data: datos });
  const equipo = await creado.json();
  try {
    expect(creado.status()).toBe(201);
    // el dato que ESTE test creó, no «la lista no está vacía»
    const lista = await listar(request);
    expect(lista.map((e) => e.codigo)).toContain(datos.codigo);
    expect(equipo.estado).toBe("DISPONIBLE");
  } finally {
    // limpieza: todas las aserciones están ADENTRO del try, así que lo creado
    // se borra aunque alguna falle (si no, un fallo dejaría datos en QA)
    const borrado = await request.delete(`${API}/api/equipos/${equipo.id}`);
    expect(borrado.status()).toBe(204);
  }

  // y el borrado, comprobado
  const despues = await listar(request);
  expect(despues.map((e) => e.codigo)).not.toContain(datos.codigo);
});

test("un equipo sin nombre se rechaza con 400 y no se crea nada", async ({ request }) => {
  const sufijo = unico();
  const r = await request.post(`${API}/api/equipos`, {
    data: { nombre: "", categoria: "prueba-automatica", codigo: `E2E-${sufijo}` },
  });

  expect(r.status()).toBe(400);
  expect(JSON.stringify(await r.json())).toContain("nombre");

  const lista = await listar(request);
  expect(lista.map((e) => e.codigo)).not.toContain(`E2E-${sufijo}`);
});

test("un código duplicado se rechaza con 409 y el equipo original no se toca", async ({ request }) => {
  const datos = nuevoEquipo();
  const original = await (await request.post(`${API}/api/equipos`, { data: datos })).json();
  try {
    const repetido = await request.post(`${API}/api/equipos`, {
      data: { ...datos, nombre: "otro nombre" },
    });
    expect(repetido.status()).toBe(409);

    const lista = await listar(request);
    const conEseCodigo = lista.filter((e) => e.codigo === datos.codigo);
    expect(conEseCodigo).toHaveLength(1);
    expect(conEseCodigo[0].nombre).toBe(datos.nombre); // el segundo no pisó al primero
  } finally {
    await request.delete(`${API}/api/equipos/${original.id}`);
  }
});
