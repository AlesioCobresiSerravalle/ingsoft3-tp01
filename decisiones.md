# Decisiones — CampusGear

Este archivo reúne las decisiones de los nueve TP de CampusGear: qué se implementó, por qué se hizo
así, qué problemas aparecieron y con qué pruebas se verificó. Las secciones muestran cómo fue
evolucionando la aplicación y el pipeline a lo largo de los TP.

**Uso de IA y participación.** Usé Claude Code para generar el código, las pruebas, los pipelines,
la configuración de infraestructura y la primera redacción de este documento. Las cuentas de los
servicios las creé yo. Claude también ejecutó comandos y comprobaciones durante el desarrollo. Los
resultados se documentan con los registros disponibles: código, reportes, corridas de GitHub Actions
y datos de los servicios. Las aprobaciones y otras operaciones de las cuentas quedan registradas en
las plataformas. También usé Codex para contrastar resultados de las pruebas y revisar la redacción.
En cada TP se detalla el uso de IA y cómo se comprobó el resultado.

**Índice:** [TP1](#tp1--fundamentos-y-api) · [Aplicación base](#aplicación-base--modelo-api-y-frontend) ·
[TP2](#tp2--contenedores) · [TP3](#tp3--planificación-y-trazabilidad) · [TP4](#tp4--continuous-integration) ·
[TP5](#tp5--calidad-automatizada) · [TP6](#tp6--entrega-continua-entornos-y-rollback) ·
[TP7](#tp7--imagen-única-por-commit-integración-y-extremo-a-extremo) · [TP8](#tp8--infraestructura-como-código) ·
[TP9](#tp9--devsecops-y-observabilidad)

## Enlaces de este TP (TP9)

| Qué | Dónde |
|---|---|
| Alertas de Dependabot, CodeQL y protección de secretos | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/security |
| PR de Dependabot mergeado (`proxy-addr` 2.0.7 → 2.0.8) | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/59 |
| Configuración de Dependabot | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/blob/main/.github/dependabot.yml |
| Demo de CodeQL (3 hallazgos; cerrada, nunca mergeada) | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/73 |
| Sentry en backend y frontend (PR) | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/74 |
| Tarjeta del tablero nacida de un dato de Sentry | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/issues/75 |
| Postmortem sin culpables | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/blob/main/postmortem.md |
| Corrida que llevó el parche de `proxy-addr` a PROD | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/39470387567 |
| **Release de este TP (v9.0.0)** | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/releases/tag/v9.0.0 |
| Release del TP8 | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/releases/tag/v8.0.0 |

## Enlaces del TP7

| Qué | Dónde |
|---|---|
| Repositorio | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01 |
| Paquete backend (público) | https://github.com/users/AlesioCobresiSerravalle/packages/container/package/ingsoft3-tp01-backend |
| Paquete frontend (público) | https://github.com/users/AlesioCobresiSerravalle/packages/container/package/ingsoft3-tp01-frontend |
| **QA** (front / api) | https://campusgear-front-qa.onrender.com · https://campusgear-api-qa.onrender.com |
| **PROD** (front / api) | https://campusgear-front-prod.onrender.com · https://campusgear-api-prod.onrender.com |
| Workflow | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/blob/main/.github/workflows/ci.yml |
| Pruebas de integración (API) | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/blob/main/frontend/e2e/api.spec.js |
| Pruebas e2e (navegador) | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/blob/main/frontend/e2e/equipos.spec.js |
| **Corrida ROJA** (integración verde, e2e roja, PROD frenado; en la página de la corrida, sección *Artifacts*: `reporte-integracion` y `reporte-e2e`) | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/39313636832 |
| **Corrida VERDE** (toda la cadena, aprobada y promovida a PROD) | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/39314848236 |
| PR que rompió la app a propósito | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/53 |
| PR que la corrigió | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/54 |
| PR de los entornos con imagen (`imgURL`) | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/50 |
| PR de las suites de Playwright | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/51 |
| PR del gate de promoción | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/52 |
| **Release de este TP (v7.0.0)** | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/releases/tag/v7.0.0 |
| Release del TP6 | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/releases/tag/v6.0.0 |

## Enlaces del TP6

| Qué | Dónde |
|---|---|
| Repositorio | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01 |
| Paquete backend (público) | https://github.com/users/AlesioCobresiSerravalle/packages/container/package/ingsoft3-tp01-backend |
| Paquete frontend (público) | https://github.com/users/AlesioCobresiSerravalle/packages/container/package/ingsoft3-tp01-frontend |
| **QA** (front / api) | https://campusgear-front-qa.onrender.com · https://campusgear-api-qa.onrender.com |
| **PROD** (front / api) | https://campusgear-front-prod.onrender.com · https://campusgear-api-prod.onrender.com |
| Workflow | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/blob/main/.github/workflows/ci.yml |
| Corrida de un PR con los tests en verde (*«Entrar al registry»* **salteado**) | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/37839648132 |
| Corrida de `main` donde *«Construir y publicar»* es el **último** paso | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/37845033074 |
| Promoción a PROD **rechazada** (con comentario) | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/38189496720 |
| Promoción a PROD **aprobada** (QA → PROD) | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/38190083879 |
| PR que agregó el publicado de imágenes | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/45 |
| PR que sacó la configuración de la imagen | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/46 |
| PR que agregó el deploy a QA y PROD | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/47 |
| **Release de este TP (v6.0.0)** | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/releases/tag/v6.0.0 |
| Release del TP5 | https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/releases/tag/v5.0.0 |

Documento único y acumulativo: un bloque por TP (TP1 … TP9).

# TP1 — Fundamentos y API

## Por qué Git no pudo resolver el conflicto solo

Las ramas `feature/titulo-a` y `feature/titulo-b` partieron del mismo commit de `main` y cada una
modificó **la misma línea** del `README.md` (el título), con contenido distinto. Git puede integrar
automáticamente muchos cambios sobre partes distintas de un archivo. En este caso no podía elegir
entre dos títulos diferentes: hacía falta decidir qué contenido conservar.

Para que este conflicto nunca hubiera aparecido, una de las dos ramas debería haber partido
**después** de que la otra ya estuviera integrada a `main` (por ejemplo, crear `feature/titulo-b`
recién después de mergear `feature/titulo-a`), en vez de las dos en paralelo desde el mismo punto de
partida sin enterarse una de la otra. En un equipo, las ramas cortas y la integración frecuente
reducen ese riesgo: cuanto más tiempo conviven dos cambios sobre el mismo lugar sin integrarse, más
grande y más probable es el conflicto.

## Problemas encontrados y solución

- **El conflicto terminó con las dos versiones del título combinadas.** Al resolverlo desde el editor
  web de GitHub, el `README.md` quedó con las líneas «versión B» y «versión A». Se mantuvo esa combinación,
  que era una de las opciones permitidas por la consigna. Git puede señalar el conflicto, pero la
  decisión sobre el contenido queda fuera de la resolución automática.
- **El botón de merge tardó en habilitarse.** GitHub mostraba «Checking for the ability to merge
  automatically...». Después de unos segundos y de actualizar la página, terminó de recalcular el PR.
- **La protección de `main` también bloqueó el `.gitignore` inicial.** La protección se configuró
  antes de subirlo, así que ese archivo entró por un PR. El resultado es el mismo que pide la guía;
  cambió el orden de los pasos.

## Declaración de uso de IA

Claude preparó el plan de trabajo y la secuencia de Git: ramas, commits, push, reversión, conflicto
y release. También explicó los rechazos de push y los marcadores del conflicto. Las capturas de
`evidencias.md` y los registros de GitHub muestran los resultados de esa secuencia.

# Aplicación base — modelo, API y frontend

Esta parte describe la aplicación que después se usó en los TP de Docker, pruebas y despliegue. Se
mantiene separada del ejercicio de Git del TP1 para facilitar la lectura.

## Modelo de datos

Antes de escribir cualquier endpoint, se diseñó el modelo de datos en `backend/prisma/schema.prisma`
con tres entidades: `Equipo`, `Persona` y `Prestamo`.

**Por qué `Equipo` no tiene un campo `estado` (DISPONIBLE/PRESTADO) persistido.** Guardar ese campo
como columna obliga a mantenerlo sincronizado a mano en cada punto donde se crea o se devuelve un
préstamo — y un solo lugar donde se olvide esa actualización deja el sistema en un estado
inconsistente (equipo marcado "disponible" con un préstamo activo, o viceversa). En cambio, derivar
el estado a partir de si existe o no un `Prestamo` activo para ese equipo (uno con
`fechaDevolucionReal = null`) evita mantener dos versiones del mismo dato. El costo es consultar los
préstamos al listar equipos en vez de leer una columna. Para el tamaño de esta aplicación se
priorizó evitar esa duplicación.

**Por qué "vencido" tampoco se persiste.** Un préstamo vencido es, simplemente, un préstamo activo
(`estado = ACTIVO`) cuya `fechaDevolucionPrevista` ya pasó. Guardarlo como un tercer valor del enum
`EstadoPrestamo` exigiría un proceso que lo actualizara cada vez que cruza esa fecha (un cron, por
ejemplo), con el riesgo de quedar desactualizado entre corridas. Calcularlo al leer (`estado ===
'ACTIVO' && fechaDevolucionPrevista < ahora`) usa la fecha actual de la consulta y evita depender de
una actualización programada.

**Qué restricciones van en cada capa:** la integridad referencial (que un préstamo no pueda apuntar
a un equipo o persona inexistente) la resuelve Postgres con claves foráneas (`onDelete: Restrict`,
para no poder borrar un equipo o persona con historial de préstamos); el formato de los datos de
entrada (fechas válidas, `fechaDevolucionPrevista >= fechaPrestamo`, email con formato válido) se
valida con Zod antes de llegar a la base; y que un equipo no se pueda prestar dos veces al mismo
tiempo se controla en el service y con un índice único parcial en PostgreSQL. La transacción por sí
sola no alcanza para garantizarlo con pedidos simultáneos; el detalle está en «API de Préstamos».

**Resultado de `npm audit` al preparar la aplicación:** al instalar las dependencias del backend,
`npm audit` marca 3 vulnerabilidades "high" en `deepmerge-ts`, una dependencia interna del **CLI**
de Prisma (`@prisma/config`), no de `@prisma/client` (lo único que corre en producción). En ese
momento, la alternativa más nueva disponible era una release candidate (`8.0.0-rc.12`). Se mantuvo
la versión estable y se registró el riesgo para revisarlo después. Este es el resultado de aquella
instalación, no un informe actualizado de vulnerabilidades. La separación de dependencias en la
imagen de producción se explica en el TP2.

## Persistencia

Para desarrollo local (todavía sin Docker Compose, eso es el TP2) PostgreSQL corre como un
contenedor suelto (`docker run postgres:16-alpine ...`, publicado en el puerto 5432 del host), no
instalado en la máquina. `DATABASE_URL` en `backend/.env` apunta a `localhost:5432` porque el
backend en esta fase corre directo con Node, no dentro de otro contenedor — cuando el backend mismo
se contenerice (TP2), esa misma variable va a apuntar al nombre del servicio (`db`), no a
`localhost`.

`backend/src/lib/prisma.ts` es la única instancia de `PrismaClient` de todo el proyecto: ningún
controller ni route importa Prisma directo, solo los services importan `prisma` desde ese archivo.
Se verificó a mano (con un script descartable, no versionado) que: persistir y leer los tres modelos
funciona correctamente, y que la restricción `ON DELETE RESTRICT` de las claves foráneas
efectivamente impide borrar un `Equipo` con préstamos asociados (lanza
`PrismaClientKnownRequestError`) — la primera de las reglas de negocio del enunciado, resuelta a
nivel de base de datos en vez de en código.

## API de Equipos

El CRUD de `Equipo` sigue la separación de capas definida: `routes` (mapea verbos HTTP),
`controllers` (parsea/responde HTTP, sin lógica), `services` (reglas y acceso a Prisma), `schemas`
(Zod). El `estado` derivado (ver sección "Modelo de datos") se calcula en un único punto del
service (`conEstadoDerivado`), a partir de si el equipo tiene o no un préstamo con
`fechaDevolucionReal = null` — nunca se guarda ni se recalcula en otro lugar.

**Traducción de errores de Prisma a HTTP:** dos códigos de error de Prisma se traducen a respuestas
significativas en vez de dejar pasar un `500` genérico: `P2002` (violación de restricción única, acá
el `codigo` repetido) se traduce a `409 Conflict`, y `P2003` (violación de clave foránea, acá un
`Equipo` con préstamos asociados) también a `409`. Ambos se probaron de verdad por HTTP: el código
duplicado devuelve `409` en el alta, y el borrado de un equipo con un préstamo activo (insertado
directo con Prisma, antes de contar con el endpoint de Préstamos) también devuelve `409` — la regla
de negocio 1 del enunciado ("un equipo prestado no puede eliminarse sin más") ya queda validada de
punta a punta antes de tiempo.

**Un detalle de tipos de Express 5:** `@types/express` 5.x tipa `req.params` como
`{ [key: string]: string | string[] }` (para soportar rutas con parámetros repetidos, que esta app
no usa), así que ni siquiera una ruta simple como `/:id` tipa `req.params.id` como `string` a secas.
Se resolvió tipando cada handler explícitamente como `Request<{ id: string }>` en vez de `Request`
genérico — más preciso, y evita tener que castear el valor a mano en cada controller.

## API de Personas

Mismo patrón de capas y de traducción de errores de Prisma que Equipos (`P2002` → `409` para el
`email` duplicado, `P2003` → `409` para no poder borrar una persona con préstamos asociados), sin la
complejidad del estado derivado porque `Persona` no tiene ningún estado que calcular. No se repite
la prueba manual del `409` por FK: es la misma ruta de código ya validada en la fase anterior.

## API de Préstamos y las 6 reglas de negocio

Las 6 reglas del enunciado se probaron una por una por HTTP, contra el servidor real:

1. **Equipo disponible se puede prestar** → `POST /api/prestamos` responde `201`.
2. **Equipo prestado no se puede volver a prestar** → un segundo intento sobre el mismo equipo
   responde `409` ("El equipo ya tiene un préstamo activo").
3. **La fecha de devolución prevista no puede ser anterior a la del préstamo** → una fecha en el
   pasado responde `400` en el schema de Zod, antes de llegar al service.
4. **Al devolver, el equipo vuelve a estar disponible** → tras `POST .../devolucion`, `GET
   /api/equipos/:id` muestra `estado: "DISPONIBLE"` de nuevo (recordar: es derivado, no una
   actualización manual de ningún campo del equipo).
5. **Un préstamo vencido es el que no fue devuelto y ya pasó su fecha prevista** → se creó un
   préstamo con vencimiento a 2 segundos, se esperó, y apareció como `vencido: true` en
   `GET /api/prestamos?estado=vencido` **sin ninguna escritura a la base entre el alta y la
   lectura** — la prueba más directa de que "vencido" es puro cálculo sobre el reloj, no un estado
   guardado.
6. **No debe haber inconsistencias entre el equipo y sus préstamos activos** → devolver dos veces el
   mismo préstamo da `409` ("El préstamo ya fue devuelto"), y no existe ningún camino en el código
   que pueda dejar un equipo "disponible" con un préstamo activo sin devolver, porque el estado no
   se guarda por separado: se lee siempre de la misma fuente.

**Reglas 1 y 2: transacción e índice único parcial.** `crearPrestamo` usa una transacción para buscar
el equipo y la persona, comprobar la disponibilidad y crear el préstamo. La transacción por sí sola
no evita dos préstamos simultáneos: con Read Committed, dos pedidos pueden leer «equipo libre» antes
de que alguno confirme. Este problema apareció durante el desarrollo y se resolvió con un índice
único parcial: `UNIQUE ("equipoId") WHERE "fechaDevolucionReal" IS NULL`, definido en la migración
`20261026120000_prestamo_activo_unico`. Así, la base admite un solo préstamo activo por equipo y el
service traduce el error `P2002` de los demás intentos a `409`. Los préstamos devueltos quedan fuera
del índice, por lo que el equipo se puede volver a prestar. El índice está en la migración SQL,
con una referencia en `schema.prisma`.

La comprobación está en `prestamos.concurrencia.test.ts`, contra PostgreSQL real. Se conserva la
validación previa del service para responder con un mensaje claro cuando el equipo ya está prestado.
La restricción de base cubre el caso en que dos pedidos pasan esa validación al mismo tiempo.

**Un efecto secundario esperado, no un bug:** al querer limpiar los datos de prueba, `DELETE
/api/equipos/:id` y `DELETE /api/personas/:id` dieron `409` incluso con el préstamo ya **devuelto**
— `onDelete: Restrict` también protege el historial. La limpieza de la base de desarrollo se hizo
con un script directo de Prisma, porque la API conserva esos préstamos.

## API Dashboard

`dashboard.service.ts` **no reimplementa** el cálculo de "vencido": importa y reutiliza
`estaVencido` desde `prestamos.service.ts` (exportada para eso). Es el mismo principio que evitó
duplicar la lógica de estado de `Equipo`: un solo lugar decide qué es "vencido" en todo el backend,
y tanto el listado de préstamos como el resumen del dashboard lo consultan ahí.

Se armó un escenario de prueba con 5 equipos (uno disponible, tres prestados —uno al día, uno
vencido, uno próximo a vencer— y uno con un préstamo ya devuelto) y `GET /api/dashboard/resumen`
devolvió exactamente `{ totalEquipos: 5, disponibles: 2, prestados: 3, vencidos: 1,
proximosAVencer: 1 }`, coincidiendo con lo esperado en cada categoría.

La ventana de "próximo a vencer" (3 días) es una constante local, no un requisito del enunciado con
un valor fijo — se documenta acá para poder justificarla y ajustarla si hace falta.

## Frontend: scaffold

Se generó con `npm create vite@latest -- --template react-ts` y después se recortó lo que no
correspondía a esta fase: se sacaron los assets y estilos de la landing de demo (`App.css`,
`hero.png`, íconos), y se sacó **Oxlint** (el linter que trae el template por defecto) junto con su
script y configuración — el análisis estático se decidió después (CodeQL, TP9), no algo que
convenga heredar sin elegirlo a propósito. También se sacaron el `README.md` y el `.gitignore` que
trae el scaffold: el segundo duplicaba reglas que ya cubre el `.gitignore` de la raíz del proyecto
(una sola fuente de verdad para todo el repo, como se decidió en el TP1).

Se agregó `react-router-dom` para las tres rutas (`/`, `/equipamiento`, `/prestamos`) en vez de
armar la navegación a mano con estado — permite resolver el historial del navegador y el resaltado
del enlace activo sin mantener esa lógica a mano.

**Prueba de conectividad real:** el `vite.config.ts` proxea `/api` hacia `http://localhost:3000` (el
mismo prefijo relativo que en producción va a traducir nginx, TP2). El plan original de esta fase
mencionaba probar contra `/api/health` — pero el healthcheck vive en `/health` (sin el prefijo
`/api`), a propósito: no es una ruta que la SPA deba poder alcanzar a través del proxy, es un
chequeo de infraestructura que en el TP2 va a golpear el contenedor del backend directamente. Se
probó la conexión real contra `GET /api/dashboard/resumen` en su lugar, que sí es un endpoint
pensado para la SPA. Se verificó con el navegador (Dashboard muestra la respuesta real del backend,
`{"totalEquipos":0,...}`) y navegando entre las tres pantallas, confirmando con
`window.location.href` que el ruteo por cliente cambia la URL de verdad.

## Frontend: Equipamiento

La pantalla no valida ninguna regla de negocio por su cuenta (ni "el código no puede repetirse" ni
"no se puede borrar un equipo prestado"): el formulario solo muestra el mensaje de error que
devuelve el backend (`err.message` de la excepción que lanza `apiFetch`), tal como se decidió en la
arquitectura general. Se probó en un navegador real, de punta a punta:

- alta de un equipo → aparece en la tabla con `estado: DISPONIBLE`;
- búsqueda por texto → filtra correctamente (y "sin resultados" también se ve bien);
- edición → precarga el formulario y actualiza la fila sin recargar la página;
- alta con código duplicado → la UI muestra tal cual el mensaje del backend ("Ya existe un equipo
  con ese código"), sin inventar un mensaje propio;
- intento de borrar un equipo con un préstamo activo (insertado directo con Prisma, como en la prueba de la API de Equipos) → la UI muestra el `409` del backend ("No se puede eliminar un equipo con préstamos
  asociados...") y el equipo **no** desaparece de la tabla — el error no deja la interfaz en un
  estado inconsistente con la base.

La búsqueda dispara una petición por tecla. Se dejó así por simplicidad y por el volumen reducido de
datos; agregar debounce queda como mejora si las mediciones muestran que hace falta.

## Frontend: Préstamos

El diseño de la interfaz (sección 5) solo define tres pantallas — Dashboard, Equipamiento,
Préstamos — sin una pantalla propia de gestión de Personas. Como igual hace falta elegir una
persona al registrar un préstamo, el formulario resuelve esto con un selector de personas
existentes (`GET /api/personas`) más un alta rápida inline que llama al mismo endpoint de creación
del TP — sin construir un CRUD de Personas que el enunciado no pide.

**Problema con las fechas:** al registrar un préstamo con devolución prevista el `06/09/2026`, la
tabla mostraba `05/09/2026` — un día antes del elegido. Causa: `<input type="date">` no lleva hora,
así que el valor `"2026-09-06"` se interpreta como medianoche **UTC**; `toLocaleDateString()` sin
zona horaria explícita lo convierte a la hora **local** del navegador antes de mostrarlo, y en
cualquier huso horario detrás de UTC eso cae en el día anterior. No es cosmético: es un desfasaje
real de fecha. Se corrigió forzando `{ timeZone: "UTC" }` en el formateo — estas fechas representan
un día elegido, no un instante preciso, así que tiene que mostrarse igual sin importar dónde esté el
navegador.

Se probó el ciclo completo en un navegador real:

- registrar un préstamo → el equipo prestado desaparece del selector de "equipos disponibles" del
  propio formulario, y en `Equipamiento` pasa a `PRESTADO` sin haber tocado esa pantalla;
- registrar la devolución → el préstamo pasa a `DEVUELTO` (el botón de devolución desaparece), y en
  `Equipamiento` el equipo vuelve a `DISPONIBLE`;
- un préstamo vencido (insertado directo con Prisma, como en la prueba de la API de Préstamos, porque el `<input
  type="date">` no permite la precisión de segundos que usó esa prueba) se muestra en rojo con la
  etiqueta `VENCIDO`, y el filtro "Vencidos" lo aísla correctamente del resto.

Cada pantalla vuelve a pedir sus datos al navegar. Por el tamaño de la aplicación se mantuvo ese
esquema, sin agregar estado global ni caché entre pantallas.

## Frontend: Dashboard

El Dashboard reemplaza la prueba inicial de conectividad por cinco tarjetas (`StatTile`) con los
números de `GET /api/dashboard/resumen`. Se armó el mismo escenario de prueba de 5 equipos descrito
en «API Dashboard» (uno disponible, tres prestados —al día, vencido, próximo a vencer— y uno
devuelto) y el Dashboard del frontend mostró exactamente `5 / 2 / 3 / 1 / 1`, coincidiendo con lo
verificado por API en esa prueba — misma fuente de datos, dos maneras de comprobarlo.

Con esto queda completo el MVP de las tres pantallas (Dashboard, Equipamiento, Préstamos) definidas
en el diseño de la interfaz, funcionando de punta a punta contra el backend real. Lo que sigue (TP2
en adelante) ya no agrega pantallas nuevas: es integración, Docker y CI.

## Integración end-to-end y elección de CampusGear como app del semestre

Se hizo un recorrido manual completo del MVP corriendo local (sin Docker todavía), con datos
representativos del dominio real (kits Arduino, multímetro, calculadora, protoboard, cargador) en
vez de datos de prueba genéricos:

- se cargaron los 5 equipos desde la UI de Equipamiento;
- se registraron 4 préstamos desde la UI de Préstamos, cubriendo los 4 estados que se pueden lograr
  sin manipular el reloj (activo al día, activo próximo a vencer, devuelto, y uno vencido insertado
  directo con Prisma porque el `<input type="date">` no permite fechas pasadas, coherente con la
  regla de negocio 3);
- el Dashboard, Equipamiento y Préstamos coincidieron exactamente entre sí (`5 equipos, 2
  disponibles, 3 prestados, 1 vencido, 1 próximo a vencer`) sin ninguna corrección manual;
- se confirmó que los datos sobreviven tanto a un refresco completo del navegador como a **reiniciar
  el proceso del backend** — la prueba más directa de que el estado vive en PostgreSQL y no en
  memoria del servidor.

No se encontró ningún defecto nuevo en este repaso: los dos bugs reales de esta etapa (el `500`
incorrecto ante un body malformado, y el off-by-one de zona horaria en las fechas) ya se habían
encontrado y corregido en la API y en la pantalla de Préstamos, respectivamente.

**Elección de CampusGear según los criterios de la guía del TP2 (§3.3):**

- *Build y ejecución local:* se comprobó el recorrido completo sin Docker antes de contenerizar.
- *Posibilidad de escribir tests:* las reglas se separan de las rutas de Express. El acceso a Prisma
  se puede reemplazar con dobles, y los cálculos pueden probarse sin levantar el servidor. El TP5
  desarrolla esa separación con funciones de dominio. `app.ts` también permite probar las rutas
  sin abrir un puerto, aunque la suite elegida no cubre todas las rutas.
- *Comprensión y modificación:* la organización por módulos permite ubicar cada regla, cambiarla
  y relacionarla con sus pruebas. El código y las decisiones quedan disponibles en el mismo repositorio.
- *Tamaño:* tres entidades, tres pantallas, seis reglas de negocio — el CRUD + 2-3 pantallas que
  pide la guía, con un alcance que se puede mantener durante el curso.

# TP2 — Contenedores

## Dockerfile del backend

Multi-stage con `node:22-alpine` en **las dos** etapas (a diferencia del ejemplo de la guía, que usa
una imagen de SDK pesada para build y una de runtime liviana para producción): en el ecosistema
Node no existe una imagen "SDK" separada como `mcr.microsoft.com/dotnet/sdk`, así que la diferencia
entre etapas la marcan las dependencias instaladas (`npm ci` completo vs. `npm ci --omit=dev`), no
la imagen base.

**Problema con el tamaño de la imagen:** la primera versión de la etapa final hacía `npx prisma
generate` directamente ahí (para evitar copiar binarios entre etapas). Como el CLI `prisma` es una
devDependency correctamente excluida por `--omit=dev`, `npx` lo descargaba solo al no encontrarlo —
arrastrando el CLI completo (~200MB, incluyendo `typescript` y `effect`) a la imagen de producción.
La imagen resultante pesaba **610MB**.

Al corregirlo (generar el cliente **una sola vez** en la etapa de build y copiar el resultado, ya
que las dos etapas comparten la misma base y el motor generado es compatible) apareció un segundo
problema, más sutil: `@prisma/client` declara `prisma` como **peer dependency opcional**, y npm lo
auto-instala en la etapa final igual, así no se lo invoque directamente — ni `--omit=dev` ni
`--omit=peer` por separado lo excluyen; hace falta **`--omit=dev --omit=peer --omit=optional`**
juntos. Con eso, `node_modules/prisma`, `typescript`, `effect` y `fast-check` (~150MB en total)
desaparecen de la imagen final, y de paso se resuelve la vulnerabilidad de `npm audit` que se venía
arrastrando como riesgo aceptado desde la instalación inicial (era transitiva del propio CLI de
Prisma).

**Comparación de tamaños** (con `node_modules` como diferencia principal, ya que la base es
idéntica en ambas etapas):

| Imagen | Tamaño |
|---|---|
| Etapa de build (con `prisma`, `typescript` y el resto de las devDependencies) | 631MB |
| Etapa final (solo dependencias de producción) | 298MB |

Verificado en contenedor: `GET /health` responde `200`, y un `POST /api/equipos` real contra el
Postgres del host (vía `host.docker.internal`, no `localhost`) persiste y se puede leer después.

## Dockerfile del frontend + nginx

Multi-stage: `node:22-alpine` compila (`npm run build`, que corre `tsc -b && vite build`), y la
etapa final es `nginx:alpine` sirviendo solo `dist/` — sin Node adentro en producción, porque una
SPA ya compilada es HTML/CSS/JS estático, no necesita runtime de JavaScript del lado del servidor.

El `nginx.conf` sigue el patrón de la guía: el nombre del backend (`http://backend:3000`) va en una
variable (`set $backend_api ...`) resuelta en runtime con `resolver 127.0.0.11`, en vez de escrito
directo en `proxy_pass`. Se verificó el motivo concreto: en esta fase el contenedor del frontend se
corre **solo**, sin el backend — si el nombre estuviera escrito directo, nginx fallaría al arrancar
con `host not found in upstream`; con la variable, arranca igual y solo falla la request puntual
cuando llega (`502 Bad Gateway`, verificado con la pestaña de red del navegador).

**Se aprovechó para verificar un detalle adicional del frontend:** ante ese `502`, `apiFetch` no
rompe — nginx devuelve una página de error HTML, no JSON, así que el `.json().catch(() => null)` de
`apiFetch` cae al mensaje de respaldo `Error 502` en vez de tirar una excepción de parseo sin
manejar. El Dashboard mostró ese mensaje correctamente en vez de quedarse colgado o crashear — el
manejo de errores diseñado en la capa de acceso a la API resiste incluso una respuesta de error que
no es JSON, un caso que no se había probado explícitamente hasta ahora.

Checkpoint esperado de esta fase, tal como lo describe la guía: la interfaz se sirve correctamente
en `localhost` con nginx, aunque todavía no puede hablar con el backend — son dos contenedores
sueltos. Eso se resuelve recién en Compose, donde ambos comparten red.

## Docker Compose

Cuatro servicios: `db` (Postgres, sin publicar puerto — nadie fuera de la red interna necesita
pegarle directo), `migrate`, `backend` (publica `3000` para poder pegarle con `curl`/Postman
directo, además de a través del frontend) y `frontend` (publica `8080`, la puerta de entrada real).

**El servicio `migrate`, y por qué existe.** El Postgres del compose nace con la base `campusgear`
vacía, sin tablas — hace falta aplicar la migración de Prisma antes de que el backend pueda
responder una sola consulta real. Pero al preparar la imagen del backend se sacó deliberadamente el
CLI de Prisma de la imagen final del backend (pesa ~150MB de más). Meterlo de nuevo ahí solo para
poder correr `prisma migrate deploy` una vez por arranque hubiera deshecho esa optimización.

La solución: `migrate` es un servicio de un solo uso que reconstruye con
`build.target: build` — apuntando explícitamente a la etapa de build del **mismo** `Dockerfile`
del backend (la que sí instala el CLI completo), sobreescribe el `ENTRYPOINT` con
`["npx", "prisma", "migrate", "deploy"]`, corre, y termina. `backend` no arranca hasta que `migrate`
termine con éxito (`depends_on: migrate: condition: service_completed_successfully`), y a su vez
`migrate` espera a que `db` esté sana. La imagen que sirve tráfico de verdad nunca ve el CLI de
Prisma.

**`depends_on` con `service_healthy` vs. `service_completed_successfully`:** son dos condiciones
distintas y no intercambiables. Un servicio de larga vida (como `db`) se espera con
`service_healthy` (su `healthcheck` nunca dice "terminé", dice "estoy listo ahora mismo"); un
servicio de un solo uso que corre y sale (como `migrate`) se espera con
`service_completed_successfully` (que además falla el `up` entero si `migrate` termina con código
de error, en vez de dejar arrancar un backend contra una base sin tablas).

**Validaciones realizadas de punta a punta:**

- `docker compose up -d --build` levantó los cuatro servicios en el orden correcto (visible en el
  log: `db` sana → `migrate` corre y termina → `backend` y `frontend` arrancan).
- El sistema completo funciona a través del puerto publicado del frontend (`localhost:8080`),
  probado tanto por `curl` como navegando y creando un equipo real desde la UI.
- **Prueba de persistencia:** con un equipo cargado, `docker compose down` seguido de
  `docker compose up -d` conserva el dato (el volumen `db_data` sobrevive); `docker compose down -v`
  seguido de `up` lo borra y `migrate` vuelve a crear el schema desde cero sobre el volumen nuevo.

## Registry y cierre

**Imágenes base elegidas:** `postgres:16-alpine` (la que pide el enunciado), `node:22-alpine` para
build y runtime del backend (misma base en las dos etapas, ver «Dockerfile del backend»),
`nginx:alpine` para servir el frontend — las tres son variantes Alpine, elegidas por tamaño sobre
las variantes Debian default de cada imagen, sin ninguna necesidad de librerías de sistema que
Alpine no traiga.

**Qué persiste y qué no:** solo los datos de PostgreSQL, en el volumen nombrado `db_data`. Todo lo
demás (el código de las imágenes, los `node_modules`, los estáticos del build de React) es
descartable y se reconstruye desde el Dockerfile o se descarga del registry en cada `up` — nunca se
guarda estado de aplicación fuera de la base de datos.

**Problema encontrado al publicar:** el primer intento de `docker push` del backend se cortó a mitad
de camino con `proxyconnect tcp: dial tcp 192.168.65.1:3128: i/o timeout` (un timeout transitorio de
red, no un error de configuración) — todas las capas ya se habían subido, pero el `push` nunca llegó
a confirmar el manifiesto final. Se solucionó reintentando el mismo comando: Docker no vuelve a subir
las capas que el registry ya tiene, así que el reintento fue casi instantáneo.

**Arquitectura de la imagen:** construida en una Mac con procesador Intel (`x86_64`/`amd64`,
confirmado con `docker image inspect ... --format '{{.Architecture}}'`), que coincide con la
arquitectura típica de los runners de GitHub Actions — no se anticipa el problema de manifiesto
multi-arquitectura que menciona la guía para Macs con chip Apple Silicon, pero se deja anotado por si
el entorno de build cambia en el TP7.

**Por qué se publican las imágenes si compose ya sabe construirlas:** para desacoplar "tener el
código" de "poder correr el sistema" — cualquier persona (la cátedra, un compañero, un pipeline de
CI en el TP7) puede levantar CampusGear con solo `docker-compose.registry.yml` y el `.env`, sin
clonar ni compilar nada del backend ni del frontend (`migrate` es la única excepción deliberada, ver
`docker-compose.registry.yml`).

El TP2 dejó la aplicación en contenedores, con Dockerfiles multi-stage, Compose y persistencia en un
volumen. Las imágenes públicas se comprobaron con un `pull` sin credenciales.

## Declaración de uso de IA (TP2)

Claude generó los Dockerfiles, la configuración de nginx y los archivos Compose. También realizó las
comprobaciones de arranque, persistencia y publicación descritas arriba, y diagnosticó el tamaño de
la imagen del backend. Los archivos versionados, las capturas y las imágenes publicadas documentan
el resultado.

# Mejora visual del frontend (fuera de fase, previa al TP3)

Antes de arrancar el TP3, se rehizo la presentación visual de las tres pantallas sin tocar lógica de
negocio, endpoints ni tipos: cero cambios en `api/`, `types/` ni en el backend (verificado con
`git diff --stat`).

**Qué se agregó:**

- Un sistema de diseño en `index.css` (variables de color con paleta azul/celeste + verde-ámbar-rojo
  para estados semánticos, espaciado, radios y sombras consistentes, con soporte de modo oscuro vía
  `prefers-color-scheme`).
- Cuatro componentes compartidos nuevos, para no duplicar CSS ni markup entre pantallas:
  `PageHeader` (título + descripción), `Card` (contenedor con sombra/borde), `StatusBadge` (estado de
  Equipo/Préstamo con color consistente) y `StateMessage` (carga/vacío/error, mismo estilo en las
  tres pantallas).
- `StatTile` ahora acepta un color de acento por métrica (verde=disponibles, celeste=prestados,
  rojo=vencidos, ámbar=próximos a vencer), reforzando visualmente el significado de cada número.
- Encabezado con identidad de marca (isotipo "CG", nombre y tagline) en vez de una barra de nav
  desnuda.

**Qué NO se tocó:** ningún cálculo (el `vencido` sigue viniendo del backend, no se recalcula en el
front), ninguna regla de validación, ninguna dependencia nueva (todo con CSS plano, sin librería de
UI ni de íconos).

Verificado en un navegador real: las tres pantallas con datos reales, los badges de estado
(Disponible/Prestado/Activo/Vencido/Devuelto), y el layout responsive en viewport móvil (grilla de
métricas a dos columnas, formularios apilados, tabla con scroll horizontal propio sin romper el
layout de la página).

# TP3 — Planificación y trazabilidad

## Duración del sprint

El Sprint 1 se configuró con **2 semanas**. Da margen para completar la historia y sus dos tareas,
con una revisión relativamente frecuente. Es un punto de partida: la duración se puede ajustar según
lo que tarde el trabajo y el calendario de los TP.

## Límite de trabajo en progreso

Se configuró en **2** en la columna *In Progress* del tablero. Sigue la regla de arranque sugerida
por la guía: *cantidad de personas + 1*. Trabajando solo, eso da `1 + 1 = 2`. El "+1" es la válvula
para cuando algo queda esperando (una revisión, una respuesta) y hace falta poder avanzar en otra
cosa sin quedarse completamente trabado — pero sin que el límite deje de limitar nada. Señal para
bajarlo: si nunca se llega a 2, sobra margen. Señal para subirlo: si se llega a 2 todo el tiempo y
hay tareas independientes que requieren más margen.

## Diagnóstico de la historia mal escrita

`"Como desarrollador quiero crear la tabla usuarios"` está mal escrita por dos motivos, no uno:

1. **Es una tarea disfrazada de historia.** "Crear una tabla" es trabajo técnico interno, invisible
   para cualquier persona fuera del equipo de desarrollo — nadie fuera del equipo "quiere" una
   tabla, quiere la capacidad que esa tabla hace posible (por ejemplo, que el sistema no pierda el
   historial de préstamos si el servidor se reinicia).
2. **Le falta el beneficio** (la cláusula "para..."): sin él, no hay forma de juzgar si vale la pena
   ni de priorizarla frente a otra cosa.

Reescrita como historia de verdad: *"Como responsable del laboratorio quiero que los préstamos
queden guardados de forma persistente para no perder el historial si el servidor se reinicia."* La
tabla en sí pasa a ser una **tarea** dentro de esa historia (exactamente el nivel donde ya vive en
este proyecto: la migración de Prisma de la base de datos).

## Problemas encontrados y solución

- **`gh` no estaba instalado** (se había optado por hacer todo el TP1 por la web). Para este TP, con
  la cantidad de objetos a crear (labels, issues, sub-issues, proyecto), se instaló con Homebrew —
  reduce drásticamente el margen de error frente a hacerlo todo a mano por la web.
- **El primer `gh auth login` no dejó nada guardado**: `~/.config/gh/` ni siquiera existía después de
  que se reportó como completado. Se detectó verificando el archivo directamente (no asumiendo que
  "listo" significaba autenticado) y se resolvió reintentando el login hasta que `gh auth status`
  confirmó la sesión de verdad.
- **El token inicial no tenía el scope `project`**: los primeros `gh project` comandos hubieran
  fallado. Se resolvió con `gh auth refresh --hostname github.com -s project`, que abre un flujo de
  device code (un código de 8 caracteres que hay que confirmar en el navegador) — distinto del login
  inicial, y hay que saber pedirlo explícitamente.
- **`gh project field-create` no soporta el tipo `ITERATION`** (solo `TEXT`, `SINGLE_SELECT`, `DATE`,
  `NUMBER`): el campo Sprint se creó a mano desde la web. Es una limitación real de la CLI, no un
  error de uso — quedó confirmado con el mensaje de error del propio comando.
- **`gh project create` no deja configurado el *Auto-add to project***: los 5 issues, creados antes
  de que existiera el proyecto, no aparecieron solos — se agregaron a mano con
  `gh project item-add` para cada uno.
- **La historia y las tareas no aparecían en la vista de tabla**: al ser sub-issues de la épica,
  GitHub las anida colapsadas bajo la fila del padre. Hubo que expandir la fila de la épica (y
  después la de la historia) para encontrarlas y poder asignarles el Sprint.

## Declaración de uso de IA (TP3)

Claude generó y ejecutó los comandos de `gh` para labels, issues, sub-issues y proyecto, y ayudó con
la autenticación y los permisos. También indicó la configuración web del tablero. El estado final se
contrastó con la API de GitHub: jerarquía de issues, sprint de historia y tareas, y cierre
automático de la tarea `#24` mediante el PR.

# TP4 — Continuous Integration

## Estructura del pipeline

Dos jobs, `build-backend` y `build-frontend`, en paralelo (cada uno en su propio runner, sin
depender uno del otro): reflejan la separación real del proyecto (dos imágenes independientes, TP2),
y correr en paralelo reduce el tiempo total del pipeline a lo que tarda el más lento de los dos, no
a la suma de ambos. Dispara en `pull_request` (la corrida que realmente importa: verifica el cambio
propuesto antes de integrarlo) y en `push` a `main` (deja el estado del badge y, sobre todo, deja el
cache de capas disponible para que el primer PR que llegue después ya lo aproveche).

## Qué cachea el pipeline

Se cachean las **capas de las imágenes de Docker** (`type=gha`, un `scope` distinto por job para que
no se pisen entre sí). Verificado con dos corridas seguidas del mismo PR:

| | 1ª corrida (sin cache) | 2ª corrida (con cache) |
|---|---|---|
| `build-backend` | 1m18s | 25s |
| `build-frontend` | 55s | 20s |

El log de la segunda corrida muestra explícitamente `CACHED` en la mayoría de las capas de ambos
jobs. Qué pasa si el cache desaparece (la plataforma lo puede desalojar en cualquier momento, no es
una garantía): el pipeline construye todo de cero, más lento, pero **funciona igual** — no hay
ninguna dependencia oculta en el cache, es puramente una optimización de velocidad.

## Por qué el pipeline construye con el Dockerfile en vez de compilar por su cuenta

Si el workflow corriera `npm run build` directo (con Node instalado en el runner en vez de usar
`docker build`), habría **dos definiciones de build**: la que usa el pipeline para verificar, y la
que usan los Dockerfiles para lo que realmente se despliega — y tarde o temprano divergen (una
versión de Node distinta, una dependencia que falta en un lado y no en el otro). Usando
`docker/build-push-action` sobre `./backend` y `./frontend`, el pipeline verifica **exactamente** lo
mismo que corre en producción, con una sola fuente de verdad.

## Problemas encontrados y solución

- **La primera corrida sobre el PR de la demo (`feature/demo-gate`) tenía que partir de un `main` ya
  actualizado con el `ci.yml` real** (no el esqueleto del TP3) — se mergeó primero el PR del pipeline
  (`#29`) y recién después se abrió la rama de la demo, siguiendo exactamente la advertencia de la
  guía: si se hace al revés, la demo corre contra el workflow viejo (solo `checkout`) y da verde
  sobre código que no compila, sin que nada de esto tenga sentido.
- **El diff del PR de la demo (`#30`) quedó vacío.** Al agregar y después sacar exactamente las
  mismas dos líneas, el archivo final es idéntico al de `main` — el diff neto no muestra nada. No es
  un error: el valor de ese PR está en su **historial de commits** (la rotura y el fix, cada uno con
  su corrida de CI), no en el estado final del archivo.
- **Verificar el bloqueo del gate no alcanza con mirar el color del check.** Se confirmó con la
  propia API de GitHub (`gh pr view --json mergeable,mergeStateStatus`): `BLOCKED` mientras
  `build-backend` estaba en rojo, `CLEAN` después del fix, y `BEHIND` en el segundo PR una vez que
  `main` avanzó — los tres estados que demuestra la secuencia completa del TP4, verificados por
  comando y no solo por inspección visual.

## Declaración de uso de IA (TP4)

Claude escribió el `ci.yml`, preparó la demostración de fallo y corrección, y revisó la protección
de rama mediante la API. Las corridas de Actions muestran los tiempos y resultados. Los estados
`BLOCKED`, `CLEAN` y `BEHIND` se comprobaron consultando GitHub durante esa secuencia.

# Mejora de la interfaz — mostrar la fecha real de devolución

La tabla de Préstamos mostraba "Prestado el" y "Devolución prevista", pero no la fecha en que un
préstamo **efectivamente** se devolvió (`fechaDevolucionReal`) — un dato que el backend siempre
guardó y devolvió desde la implementación de préstamos, pero que la UI nunca llegó a mostrar. Se
agregó la columna "Devuelto el" a `PrestamoTable.tsx` (vacía, con un guion, mientras el préstamo
sigue activo). No cambia nada de tipos ni de API: el dato ya viaja en cada respuesta, solo faltaba
renderizarlo.

# TP5 — Calidad automatizada

## Qué lógica se prueba y por qué

Se priorizaron las reglas que cambian el comportamiento de los préstamos: *vencido*, *próximo a
vencer*, el estado derivado del equipo, el resumen del dashboard, la validación de fechas y la
traducción de errores de la base a HTTP. Todas estaban mezcladas con Prisma o con el reloj (`new
Date()` adentro), así que **antes de testear hubo que refactorizar** (lo que la guía llama «el
código testeable se diseña»):

- Se extrajo a `backend/src/domain/` (`prestamo.ts`, `equipo.ts`, `dashboard.ts`): funciones puras,
  sin Prisma ni Express, con el "ahora" como **parámetro** (default `new Date()`), así el test fija
  el reloj y no depende de la hora de la corrida.
- Los *services* delegan los cálculos en el dominio y conservan la coordinación de consultas y reglas que necesitan la base.
- `estaVencido` pasó de `prestamos.service.ts` a `domain/prestamo.ts`: sigue siendo **el único lugar**
  donde se define "vencido".

Durante el refactor, el compilador detectó un problema: `prestamos.map(conVencidoCalculado)` pasaba
el **índice** del `map` como segundo argumento, que ahora es el `ahora: Date` — un argumento
incompatible que `tsc` rechazó antes de ejecutar los tests. Se resolvió con `(p) =>
conVencidoCalculado(p)`.

## Suite de backend (Vitest): 32 tests en 7 archivos al implementar el TP5

| Regla | Dónde | Técnicas |
|---|---|---|
| 5 · vencido / próximo a vencer | `domain/prestamo.test.ts` | `it.each` con bordes (`<` vs `<=`, ventana de 3 días incluida) |
| 6 · estado derivado sin duplicar | `domain/equipo.test.ts` | AAA |
| Dashboard | `domain/dashboard.test.ts` | el escenario 5/2/3/1/1 de la API Dashboard, ahora automatizado |
| 3 · fecha de devolución no anterior | `schemas/prestamo.schema.test.ts` | reloj falso, `it.each`, **caso de error** que verifica el mensaje |
| 2 · no prestar dos veces | `services/prestamos.service.test.ts` | **mock** de `lib/prisma` con `vi.mock`; verifica la interacción (`toHaveBeenCalledWith`, `not.toHaveBeenCalled`) |
| Errores de Prisma → HTTP | `services/equipos.service.test.ts`, `middlewares/errorHandler.test.ts` | mock; el 500 **no filtra** el detalle interno |

**Dónde está el mock y por qué `vi.mock` y no inyección por constructor:** la dependencia externa de
los services es `lib/prisma` (la frontera con la base). En JavaScript el equivalente de «inyectar la
interfaz» es reemplazar ese módulo; el test le pasa un doble que registra qué se le preguntó. Se
descartó reescribir los services como clases con constructor: agregaba una capa que el proyecto no
necesita y obligaba a tocar todos los controllers.

**Comprobación con mutaciones manuales.** Se rompió a propósito cada una de 7 reglas y se corrió la
suite: `<`→`<=` en vencido, sacar el `ACTIVO` de `estaVencido`, `<=`→`<` en el límite de la ventana,
`>0`→`>1` en el estado del equipo, no restar los prestados en el dashboard, aflojar la validación de
fecha y apagar el chequeo de préstamo activo. **Los 7 mutantes pusieron algo en rojo** y después se
restauró el código. Fue una comprobación local de Claude, separada del pipeline, para revisar si los
tests detectaban cambios en las reglas.

**Prueba de concurrencia con base real.** Además de los unitarios, se agregó
`prestamos.concurrencia.test.ts`: cinco rondas de ocho pedidos simultáneos y un caso de devolución
y nuevo préstamo. Con el índice, cada ronda deja un solo préstamo activo; al quitarlo únicamente
en una base descartable, fallan los cinco casos de concurrencia. La suite completa con base pasó
40 de 40 tests. `build-backend` levanta un PostgreSQL efímero, aplica las migraciones y ejecuta estas
pruebas con la cobertura.

La [corrida 40408917673](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/40408917673)
del [PR #78](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/78), sobre `8746832`, dejó los
checks de backend y frontend en verde. En esa corrida se omitieron los despliegues por ser un PR.
La aplicación del índice en QA y PROD se debe comprobar en la cadena de `main` después del merge;
los tests de la base efímera no demuestran que esos entornos ya tengan la migración.

## Suite inicial de frontend (Vitest, sin DOM): 18 tests en 3 archivos

Igual que en el backend, primero hubo que **sacar la lógica de los componentes**. Estaba adentro de
`PrestamoTable`/`EquipoTable`/`PrestamoForm`, donde sólo se podía probar renderizando. Ahora vive en
`frontend/src/lib/` como funciones puras y los componentes sólo las llaman:

- `lib/fechas.ts`: `formatearFecha` (el arreglo del off-by-one de zona horaria de la pantalla de Préstamos, que hasta
  ahora no tenía ningún test que lo protegiera) y `fechaInputAIso`, que ahora rechaza una fecha
  inválida con un mensaje en vez de dejar que `toISOString()` tire un `RangeError` críptico.
- `lib/estados.ts`: traduce lo que **ya decidió el backend** (`estado`, `vencido`) a etiqueta + color.
  No calcula nada: el vencido sigue siendo del backend.

| Técnica | Dónde |
|---|---|
| Parametrizado (`it.each`) | fechas (3 días, incluido fin de año), etiquetas de estado, fechas inválidas |
| Caso de error | `fechaInputAIso("")` y `apiFetch` ante un 409 (propaga el mensaje del backend) y ante un 502 con HTML (cae a `Error 502`) |
| **Mock** | `vi.stubGlobal("fetch", …)`: el test no sale a la red, y después verifica **a qué URL** se llamó (`/api/equipos?q=kit%20uno%26x`). Comprueba el uso de rutas relativas y la codificación de la búsqueda |

Un cambio de comportamiento deliberado: `formatearFecha` ahora usa el locale `es-AR` fijo en vez del
del navegador, para que el test dé lo mismo en cualquier máquina o runner. En un navegador
configurado en otro idioma las fechas también se ven en formato argentino. Se eligió ese formato
para la institución; el costo es no respetar el idioma del navegador.

**Mutación manual (6 mutantes, 6 detectados):** forzar otra zona horaria en las fechas (2 tests en
rojo), apagar la prioridad del vencido, cambiar el color de Disponible, hardcodear
`http://localhost:3000` en `BASE_URL` (3 en rojo), tratar 200 como 204, y no codificar la búsqueda.

`vite.config.ts` ya excluye `e2e/**` de Vitest, para que los specs de Playwright del TP7 no los
levante el runner equivocado (la trampa que avisa la guía).

## Cobertura en el pipeline: qué mide, qué excluye y por qué ese umbral

**Dónde corren los tests.** En una etapa `test` de cada Dockerfile (`FROM build AS test`), que hereda
las devDependencies y el código de la etapa de build. Esa etapa **no entra a la imagen final**: la
imagen del backend sigue sin `vitest` y la del frontend sigue en ~63 MB. El job la construye con
`target: test` y la ejecuta con `docker run`; el reporte sale del contenedor por un volumen
(`/reports`). Los tests van como `CMD` y no como `RUN` a propósito: con `RUN`, un umbral roto
tumbaría el *build* de la imagen y no quedaría ningún reporte para mirar qué pasó.

**Herramientas por fila del stack** (la guía habla de .NET; se evalúa el logro, no la herramienta):

| Pide la guía | En CampusGear |
|---|---|
| xUnit | Vitest 5 |
| coverlet | `@vitest/coverage-v8` (cobertura nativa de V8) |
| `fail-under` / umbral | `coverage.thresholds` de Vitest: sale con código ≠ 0 |
| Resumen del job | `$GITHUB_STEP_SUMMARY` armado con `jq` desde `coverage-summary.json` |
| Reporte descargable | artefacto `coverage-backend` / `coverage-frontend` (lcov + HTML) |

**Medición real (sin umbral, con `include` explícito para que cuenten también los archivos que ningún
test importa):**

| | Líneas | Ramas | Funciones |
|---|---|---|---|
| Backend (con exclusiones) | 38,21 % | 48,71 % | 40,00 % |
| Frontend (con exclusiones) | 64,51 % | 80,95 % | 43,75 % |

Sin exclusiones, la cobertura de líneas daba 30,92 % en backend y 12,34 % en frontend. Por eso el
porcentaje se presenta junto con el alcance medido: las exclusiones cambian el denominador.

**Qué se excluye y por qué:**

- Backend: `server.ts` (`app.listen`), `app.ts` (cableado de middlewares), `config/env.ts` (lee
  `process.env`), `lib/prisma.ts` (instancia el cliente), `routes/**` (tabla ruta → controller).
- Frontend: `main.tsx` (arranque), `App.tsx` (rutas), `types/**` (sólo tipos: no hay código en
  runtime), `components/**` y `pages/**` (presentación: la suite de Vitest se definió sin DOM). El TP7 agrega
  tres flujos de navegador sobre equipos; esos flujos no cubren toda la interfaz.
- **No se excluye**: controllers, services, domain, schemas, middlewares, `api/` ni `lib/`. Los
  controllers y `validate.ts` hoy están en 0 % y siguen contando; excluirlos habría subido el número
  sin que el código estuviera más protegido.

**Umbral: líneas ≥ 38 % y ramas ≥ 48 % en el backend; líneas ≥ 64 % y ramas ≥ 80 % en el frontend.**
Se tomaron como punto de partida los valores medidos, con un piso apenas inferior. El objetivo es
detectar retrocesos sobre ese alcance. A medida que se agregan pruebas, también se puede subir el
umbral. Se miden y reportan **líneas y ramas**. Las líneas cubiertas por sí solas pueden ocultar
condiciones para las que sólo se probó uno de los resultados.

Comprobación: con el umbral forzado a 90 % el contenedor sale con `exit 1` y dice
`Coverage for lines (38.21%) does not meet global threshold (90%)`; con el umbral real sale con `0`.

**Problemas que aparecieron al armarlo:**

1. `EBUSY: resource busy or locked, rmdir '/app/coverage'`: Vitest limpia el directorio de reportes
   antes de correr, y un punto de montaje no se puede borrar. Solución: reportes a `/reports` con
   `--coverage.clean=false` (en el runner el directorio ya nace vacío).
2. El backend es CommonJS y un `vitest.config.ts` ESM disparaba una advertencia; se renombró a
   `vitest.config.mts`.
3. En las primeras corridas locales, la combinación de `docker build -q`, `&&` y salida redirigida
   ocultó el punto del fallo. Se detectó porque no aparecían tests. La corrección fue revisar el
   código de salida y conservar la salida necesaria para diagnosticarlo.

**Actualización tras el gate (sección siguiente):** los pisos subieron al valor nuevo medido. Backend:
líneas ≥ 38 %, ramas ≥ 50 %. Frontend: líneas ≥ 74 %, ramas ≥ 88 %. La suite total es de 32 tests de
backend y 28 de frontend.

## El gate de calidad: un PR frenado por cobertura, y su corrección

**Versión de la herramienta:** Vitest 5.0.3 con `@vitest/coverage-v8`.

**PR #1 — rojo → verde → merge** ([PR
#37](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/37)). Se agregó
`textoDeVencimiento` en `frontend/src/lib/vencimiento.ts`, una función de ~25 líneas con siete
salidas posibles y **ningún test**. Compila (`tsc` limpio) y los 18 tests existentes seguían en
verde, así que lo que frenó no fue la compilación del TP4 sino la calidad:

- Corrida roja: [actions/runs/37682311566](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/37682311566),
  job `build-frontend`. El estado del PR quedó `BLOCKED`. `build-backend` siguió verde: alcanza con
  que se ponga rojo uno de los dos.
- **Frenó en las dos métricas** (Vitest 5 cuenta las ramas de una función que nadie llama): el log dice
  `Coverage for lines (46.51%) does not meet global threshold (64%)` y
  `Coverage for branches (50%) does not meet global threshold (80%)`.
- Corrección: 7 tests, **uno por cada camino que el código declara** (hace 3 días, ayer, hoy, mañana,
  en 5 días, devuelto con fecha, devuelto sin fecha) más dos de borde (23:59 UTC sigue siendo el mismo
  día; cruce de fin de año). Corrida verde:
  [actions/runs/37682609008](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/37682609008).
  Frontend: 74,41 % de líneas y 88,23 % de ramas.

**PR #2 — queda abierto y en rojo a propósito** ([PR #38](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/38)).
Abierto desde `main` después del merge anterior, ahora del lado del **backend**:
`backend/src/domain/retraso.ts` (`diasDeRetraso` y `nivelDeRetraso`, cinco niveles, sin tests). Compila,
los 32 tests pasan, y el check `build-backend` quedó rojo con
`Coverage for lines (35.46%) does not meet global threshold (38%)` y
`Coverage for branches (42.39%) does not meet global threshold (50%)`
([corrida](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/37683113943)).
No se arregla ni se cierra hasta la defensa: es la prueba visible de que el freno funciona, más
convincente que la pantalla de configuración de la protección de rama, que sólo ve quien administra.

**Por qué se calculó el efecto antes de subir.** El porcentaje es sobre todo lo medido: con 61
líneas cubiertas de 157, agregar 5 líneas sin tests da 61/162 = 37,7 %, apenas bajo el piso. Por eso
el código nuevo es de ~15 líneas ejecutables.

### Ejercicio de la rama sin cubrir

1. **Qué línea:** `backend/src/services/prestamos.service.ts:54`, el `if (!persona)` de `crearPrestamo`.
   El reporte `lcov` la marca con la rama «verdadera» en 0: los tests recorrían el camino feliz y el del
   equipo inexistente, pero nunca el de la persona inexistente.
2. **Qué entrada la recorre:** un `personaId` que no existe (el doble de Prisma responde `null` en
   `persona.findUnique`) con un equipo que sí existe. Debe lanzar `NotFoundError("Persona no encontrada")`.
3. **Decisión:** agregar el test. Es la regla 1 del enunciado (no se presta a quien no existe) y el
   único camino de esa función sin protección; además verifica que **no se cree** el préstamo. El
   backend pasó de 49 % a 50 % de ramas.

### Conclusiones de las pruebas

- Un test verde no significa «probado»: las 18 pruebas del frontend pasaban con 46 % de líneas.
- La cobertura señala dónde mirar, no qué hacer. Medir sin exclusiones daba 12 % en el frontend: la
  lista de exclusiones es una decisión de diseño y tiene que poder defenderse línea por línea.
- La demostración hizo caer líneas y ramas a la vez con Vitest 5. Se mantuvieron umbrales para
  ambas métricas, porque miden aspectos diferentes de la cobertura.

## Declaración de uso de IA (TP5)

Claude Code extrajo las funciones de dominio, escribió las pruebas y configuró la cobertura y el
pipeline. También ejecutó las suites y las mutaciones manuales: 7 de 7 detectadas en backend y 6 de
6 en frontend. La comprobación del umbral se hizo forzando un valor imposible y contrastando las
corridas roja y verde. Los reportes de cobertura y los PR enlazados permiten revisar esos
resultados.

# TP6 — Entrega continua, entornos y rollback

## El artefacto: el pipeline publica las imágenes, y sólo las que pasaron

Hasta el TP5 el pipeline *verificaba*; ahora también *entrega*. Cada job (`build-backend`,
`build-frontend`) termina publicando su imagen en `ghcr.io`.

- **Dos paquetes**, porque CampusGear tiene dos Dockerfiles:
  `ghcr.io/alesiocobresiserravalle/ingsoft3-tp01-backend` y `…-frontend`. El nombre va escrito a mano
  en minúsculas: el registry no acepta mayúsculas y el nombre de la cuenta las tiene, así que
  `${{ github.repository }}` habría fallado con `repository name must be lowercase`.
- **Etiqueta = el commit** (`sha-<commit completo>`), no `latest` ni una versión a mano: dado el tag
  de una imagen, se sabe exactamente qué código la produjo. No existe `latest`, porque una etiqueta
  que se mueve no dice qué verificó el pipeline.
- **Paquetes nuevos y no los viejos.** Los anteriores (`campusgear-backend` / `-frontend`, `v0.1.0`)
  se publicaron manualmente con un token personal en el TP2. El `GITHUB_TOKEN` de una corrida podría no tener
  permiso de escritura sobre paquetes creados por otra credencial, y reutilizarlos era apostar a eso.
  Los nuevos nacen de este pipeline y quedan enlazados al repositorio con
  `LABEL org.opencontainers.image.source` en cada Dockerfile.
- **Sin secrets nuevos.** El login usa `GITHUB_TOKEN`, que GitHub entrega a cada corrida y que muere
  con el job. `permissions: { contents: read, packages: write }` está declarado **dentro de cada
  job** y no arriba del workflow: es mínimo privilegio, y si algún día se agrega un job de otra cosa
  no hereda escritura de paquetes.

**La cadena de confianza son tres eslabones, y ninguno es un `if` sobre "los tests pasaron":**

1. Nada llega a `main` sin pasar los checks requeridos (protección de rama del TP4).
2. Sólo `main` publica: el paso de publicar lleva `push: ${{ github.event_name == 'push' &&
   github.ref == 'refs/heads/main' }}`. Las dos condiciones a propósito: si algún día el disparador
   escucha otra rama, publicar sigue exigiendo `main`. «Entrar al registry» sólo corre en `push`.
3. **Construir y publicar es el último paso del job**, después de correr los tests y subir el
   reporte. Los pasos de un job se cortan al primer error, así que si los tests o el umbral fallan,
   el paso que publica nunca se alcanza. Lo publicado es lo mismo que se verificó, porque lo
   construye ese mismo paso y no un job aparte que reconstruiría.

Para llegar ahí hubo que **mover** el build de la imagen: en el TP4 estaba primero (con
`push: false`) y ahora está al final. Si hubiera quedado arriba, todo seguiría verde y el pipeline
publicaría imágenes antes de saber si los tests pasaban; la única señal sería el orden en el log.
Los pasos del reporte de cobertura sí llevan `!cancelled()` (queremos el reporte justo cuando el
umbral falla); los que publican **no** llevan ninguna función de estado.

Un solo detalle que queda para otra sección: los entornos de Render del TP6 reconstruyen la app
desde el repositorio, así que estas imágenes quedan guardadas y etiquetadas pero todavía no son lo
que corre en QA/PROD. Eso lo cambia el TP7.

## La configuración vive fuera de la imagen

**Principio:** una imagen se construye una vez y se despliega muchas; lo que cambia entre compose, QA
y PROD es la *configuración*, nunca el build. Había dos cosas cableadas dentro de la imagen.

**1. A dónde reenvía nginx `/api`.** `frontend/nginx.conf` tenía escrito `http://backend:3000` y el DNS
interno de Docker (`127.0.0.11`): válido sólo dentro de compose. Ahora es
`frontend/default.conf.template`, y la imagen oficial de nginx le aplica `envsubst` al arrancar:

| Variable | Qué configura | Default (en el Dockerfile) |
|---|---|---|
| `BACKEND_URL` | destino del proxy de `/api` | `http://backend:3000` |
| `DNS_RESOLVER` | quién resuelve ese nombre | `127.0.0.11` (DNS de Docker) |

Los defaults hacen que `docker compose up` siga andando sin configurar nada. Dos cuidados:
`envsubst` sólo reemplaza las variables de entorno que existen, así que `$uri` y `$backend_api` de
nginx sobreviven; y para un backend **HTTPS** (un servicio público de la nube) hicieron falta
`proxy_ssl_server_name on` y `proxy_set_header Host $proxy_host`, o el handshake TLS y el ruteo por
`Host` fallan.

**Comprobaciones realizadas:** (a) con los defaults, compose levanta y `/api/...` responde por el
8080; (b) la misma imagen con `BACKEND_URL=https://api.github.com` y `DNS_RESOLVER=1.1.1.1` genera
la configuración esperada y devuelve la respuesta de GitHub (su propio `404 Not Found` en JSON, no
un 502 de nginx: eso prueba que SNI y `Host` están bien); (c) el fallback de la SPA (`/prestamos` →
200 con el `index.html`) sigue funcionando.

**Límite conocido:** `DNS_RESOLVER` depende de la plataforma. En Render el resolver no es el de
Docker; se carga como variable del servicio (se verifica en el despliegue en Render, no se asume).

**2. Migraciones.** La imagen final del backend no trae el CLI de Prisma (decisión del TP2: pesaba
~150 MB), así que no puede migrar a una base remota. Las migraciones no se ejecutan al arrancar la
app: las corre **el pipeline**, antes de desplegar, con `npm run migrate:deploy`
(`prisma migrate deploy`) y la `DATABASE_URL` de cada environment como *secret* con alcance de
environment. Es el reemplazo del `EnsureCreated()` que usa el ejemplo de la guía: Prisma tiene
migraciones versionadas, y `migrate deploy` es idempotente (comprobado: contra una base ya migrada
responde `No pending migrations to apply`). Para Neon va la URL **directa** (no la *pooled*), porque
las migraciones usan bloqueos de sesión que el pooler no garantiza.

**3. `docker-compose.registry.yml`** apuntaba a `campusgear-*:v0.1.0`, los paquetes del TP2. Ahora
usa los del pipeline, `ingsoft3-tp01-{backend,frontend}:sha-${IMAGE_SHA}`, y `IMAGE_SHA` es
obligatoria (si falta, compose falla con un mensaje que dice qué definir). Se comprobó levantándolo
con las imágenes publicadas de un commit de `main`.

## Entornos: Neon (bases) y Render (ejecución)

**Dos bases en la misma rama de Neon.** El proyecto `campusgear` (AWS US East 2) usa `app_qa` y
`app_prod`, separadas a nivel de datos, aunque comparten infraestructura. Se eligió Neon porque, al
configurar el TP6, el PostgreSQL gratuito de Render tenía una duración de 30 días. Neon permitía
conservar la base sin ese vencimiento, sujeto a los límites del plan y a la suspensión por
inactividad.

**Cuatro Web Services de Render con Docker**, todos con *Auto-Deploy desactivado*, porque el deploy lo
dispara el pipeline, no el proveedor: si Render se desplegara solo en cada push, el deploy no esperaría
a la CI verde ni a la aprobación.

| Servicio | URL | Base |
|---|---|---|
| `campusgear-api-qa` | https://campusgear-api-qa.onrender.com | `app_qa` |
| `campusgear-front-qa` | https://campusgear-front-qa.onrender.com | — (proxy a la api de QA) |
| `campusgear-api-prod` | https://campusgear-api-prod.onrender.com | `app_prod` |
| `campusgear-front-prod` | https://campusgear-front-prod.onrender.com | — (proxy a la api de PROD) |

Configuración que distingue un entorno del otro (nunca está en la imagen): `DATABASE_URL` en cada api,
y `BACKEND_URL` (la api **de su entorno**, `https://…`, sin barra final), `DNS_RESOLVER=8.8.8.8` y
`PORT=80` en cada front. Las credenciales (las dos `DATABASE_URL` y los cuatro deploy hooks) viven como
*secrets con alcance de environment* en GitHub (`qa` y `production`), nunca en el repo ni en el chat.

**Lo que se pierde porque Render reconstruye.** En este TP los servicios de Render construyen la imagen
desde el repositorio, así que lo que corre en QA y en PROD **no es la imagen que los tests del pipeline
aprobaron**: es otra construcción del mismo commit. Puede salir distinta si una dependencia o la imagen
base cambió entre un build y el otro. Se rompe el principio «se promueve lo mismo que se verificó».
Las imágenes de `ghcr.io` quedan publicadas y etiquetadas pero no son las que corren; que sí lo sean es
el TP7.

**Letra chica del plan gratuito.** Los servicios se duermen a los 15 minutos sin tráfico y el primer
pedido tarda cerca de un minuto (arranque en frío); las 750 horas mensuales son del *workspace* y
cuatro servicios siempre despiertos las agotarían, por eso importa que se duerman. Neon también
suspende el cómputo por inactividad. El smoke test lo tiene en cuenta (30 reintentos cada 20 s).

### Problemas que aparecieron

1. **502 en los dos frontends con las variables "bien puestas".** El log de nginx decía
   `backend could not be resolved` con `resolver: 127.0.0.11:53`: esos son los **valores por defecto de
   compose**, aunque en Render ya se habían guardado otros valores. Las variables de entorno se cargaron *después* del
   primer deploy y Render no reinicia el contenedor al guardarlas. Un **Manual Deploy** las aplicó.
   Se descartó primero probando la misma imagen en la máquina de desarrollo con esos mismos valores (funcionaba), lo que
   mostraba que el problema era de configuración en Render y no del código.
2. **Un segundo 502, con otro formato**, justo después del redeploy: la cabecera
   `x-render-routing: no-deploy` mostraba que Render todavía no tenía instancia activa. Se resolvió
   sola en un minuto. Moraleja: mirar quién devuelve el error (nginx o la plataforma) antes de tocar nada.

## El deploy desde el pipeline y el gate humano

El workflow tiene ahora dos jobs de despliegue, ambos **sólo en `push` a `main`** (no en PRs):

- `deploy-qa` (`needs: build-backend, build-frontend`; environment `qa`): migra `app_qa`, dispara los
  hooks de Render con `ref=<commit>` y corre el smoke test.
- `deploy-prod` (`needs: deploy-qa`; environment `production`): lo mismo contra `app_prod`, **pero
  GitHub lo deja esperando hasta que el revisor requerido lo apruebe o lo rechace**. Sin pasar por QA no
  se llega a PROD, y sin una persona tampoco.

Decisiones de diseño:
- **Migrar antes de desplegar, desde el pipeline.** La imagen del backend no trae el CLI de Prisma, así
  que el job instala las dependencias y corre `prisma migrate deploy` con la `DATABASE_URL` del
  environment. Si la migración falla (tres intentos, por si Neon estaba dormida), el job se corta
  **antes** de tocar Render.
- **Los hooks llevan el commit** (`&ref=$GITHUB_SHA`): le dicen a Render *qué* construir. Los secrets
  no se imprimen.
- **`concurrency` por entorno** (`cancel-in-progress: false`): dos corridas no despliegan al mismo
  entorno a la vez, y una que ya está desplegando no se cancela a mitad.
- **La cuenta del repositorio es el revisor, con *prevent self-review* apagado.** Es un proyecto
  individual y esa configuración permite aprobar las propias corridas. La promoción queda como
  una decisión explícita y registrada. No equivale a una revisión independiente de otra persona.
- **Qué prueba y qué no el smoke test.** Comprueba que la api, la base, el front y el proxy
  **responden**. No prueba que estén ejecutando *este* commit: mientras Render construye el nuevo, el
  servicio anterior sigue respondiendo y el smoke puede dar verde de inmediato. Eso se verifica en
  *Events* de cada servicio de Render.

**Evidencia: una promoción rechazada** ([corrida
38189496720](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/38189496720)). El
merge de este workflow desplegó QA y el job de PROD quedó esperando. La promoción se **rechazó** con
este comentario, registrado en GitHub: *«QA está recién migrado y todavía no creé ni edité ningún
equipo en QA. No paso a PROD hasta verificar el flujo completo ahí.»* GitHub lo registra y la
corrida termina con `deploy-prod` fallido: así se ve un freno humano. PROD, mientras tanto, quedó
intacto (sin tablas, sin desplegar).

## Aislamiento: cómo se comprobó que cada entorno usa su propia base

El error más silencioso de este TP es que PROD apunte a la base de QA: las dos `DATABASE_URL`
difieren en una sola palabra (`app_qa` / `app_prod`), y si se cruzan **nada se pone rojo**: PROD levanta,
contesta y el smoke da verde. Por eso se comprobó con un dato que sólo existe en una base:

1. Se insertó desde el SQL Editor de Neon, **con `app_prod` seleccionada**, un equipo de prueba
   (`SOY PROD`, código `PROD-AISLAMIENTO`).
2. Se consultó la lista de equipos a las dos APIs y a los dos frontends: **PROD** devolvió el equipo y **QA**
   devolvió `[]`, tanto directo a la API como a través del proxy de nginx de cada frontend.
3. Se borró el dato de prueba.

Esto además es una prueba de que cada frontend apunta a **la API de su entorno** (`BACKEND_URL`).

## Rollback: intentos y tiempos registrados

Sobre `campusgear-api-prod` (que tiene dos deploys: el inicial `c4e31c6` y el del pipeline `2c71e16`):

- **Por el botón *Rollback* de Render: falló.** Respondió `Error: could not roll back to deploy
  dep-db61lvid0e5s7392lf0g`, dos veces, con el servicio despierto y sano. La documentación de Render dice
  que sólo se puede volver a deploys cuyo artefacto de build siga guardado, y que en el plan gratuito
  se retienen pocos. No se determinó la causa concreta del fallo, por lo que se probó otra forma
  de volver al commit anterior.
- **Alternativa que sí funcionó: redesplegar el commit anterior**
  (*Manual Deploy → Deploy a specific commit → `c4e31c6`*). Tiempo leído en Render, de confirmar a *Live*:
  **28,48 s**, según el registro del servicio. Se verificó desde afuera que PROD quedó **sano** (no que corriera ese commit: el backend no expone su versión) (`/health`, dashboard con la
  base de PROD y proxy del frontend respondiendo).
- **Volver al último commit** (`2c71e16`): **30,09 s**.
- Para comparar, la duración de los deploys que muestra Render: 57,9 s el primero y 24,5 s el del
  pipeline (con capas de Docker ya en caché).

**Qué significa:** como Render reconstruye desde el repositorio, **un rollback por commit es un
deploy más, no una vuelta atrás instantánea**: ~30 s en este proyecto chico porque las capas ya
estaban en caché, y bastante más con dependencias nuevas o caché frío. Con el botón de Render (si
anda) se reutiliza un build ya hecho y es más rápido. Ese tiempo no incluye la detección del
problema ni un posible arranque en frío posterior. **Lo que un rollback no deshace:** las
migraciones de la base. Si un deploy migró una tabla, volver al código anterior no la revierte; por
eso las migraciones se escriben compatibles hacia atrás (agregar antes que quitar).

## Cierre del TP6: tipo de CD, estrategia de despliegue y alcance

**Continuous Delivery vs. Continuous Deployment.** En *Delivery* cada cambio que pasa los checks
queda **listo para producción** y hay una decisión humana para salir; en *Deployment* sale solo.
Este proyecto es **Continuous Delivery**: las comprobaciones definidas en el pipeline son
automáticas (tests, cobertura, imágenes, deploy a QA con smoke) pero **producción espera una
aprobación** en el environment `production`. La primera promoción registrada fue un rechazo por
falta de comprobación del flujo en QA, y el pipeline respetó ese freno.

**Estrategia implementada.** Se usa el reemplazo de instancia gestionado por Render, descrito aquí
como **rolling sobre una instancia**: levanta el contenedor nuevo y recién después reemplaza al
anterior, y lo que el pipeline añade es la **promoción escalonada** (QA primero, PROD después de la
aprobación). El proyecto no configura blue/green ni canary, ni mantiene dos versiones para repartir
tráfico entre ellas. **Límite de esta configuración:** con una sola instancia no se asegura
disponibilidad continua durante un deploy, y los arranques en frío empeoran la percepción.

**Propuesta para una producción real con usuarios.** Se propone un despliegue *canary* sobre la
misma imagen que ya pasó por QA: la versión nueva recibe primero una fracción pequeña del tráfico
(p. ej. 5 a 10 %) durante unos minutos, y se promueve al 100 % sólo si las señales se mantienen; el
viejo queda corriendo hasta entonces. La comparación para esta app:

| Criterio | Rolling (hoy) | Blue/green | Canary (propuesto para producción real) |
|---|---|---|---|
| Costo | una instancia por servicio | duplica el entorno mientras dura el cambio | una o dos instancias extra, sólo durante la ventana |
| Riesgo al usuario | un fallo llega a todos tras el reemplazo | el cambio es todo o nada, aunque se prueba antes | un fallo llega sólo a la fracción canaria |
| Rollback | redeploy de la imagen anterior: decenas de segundos a minutos | casi instantáneo (se vuelve el tráfico) | casi instantáneo (se retira el canario) |
| Observabilidad necesaria | mínima (health) | media | **alta**: hace falta comparar errores y latencia entre versiones |

Canary permitiría limitar cuántos usuarios reciben inicialmente un cambio. Para aplicarlo harían
falta capacidad adicional, reparto de tráfico, identificación de versiones y señales comparables de
errores y latencia. La imagen común y la configuración externa de TP7 son una base, pero no alcanzan
por sí solas. Con poco tráfico, unos minutos al 5–10 % pueden dar una muestra insuficiente: la
duración y los criterios de promoción tendrían que definirse antes. Es una propuesta; el proyecto
mantiene la promoción QA → PROD y el reemplazo de una instancia.

**Qué entrega este pipeline y qué no.**

- Entrega: imágenes `sha-<commit>` publicadas sólo desde `main` y sólo tras los tests; migración de la
  base de cada entorno **antes** de desplegar; deploy a QA con smoke; promoción a PROD con aprobación y
  concurrencia por entorno.
- **No** entrega (todavía): que QA y PROD ejecuten *la imagen que se verificó*. Render reconstruye desde
  el repositorio, así que lo que corre es otra construcción del mismo commit. Y el smoke test no prueba
  qué commit corre, sólo que el entorno responde. Ambos huecos son el tema del TP7.
- **Plan C** (si Render dejara de servir el plan gratuito): un *runner* propio de GitHub Actions con
  `docker-compose.registry.yml`, que ya usa las imágenes publicadas por el pipeline
  (`IMAGE_SHA=<commit>`). **No está activado ni probado**; es sólo un punto de partida. Un fallback completo
  exigiría además dos entornos aislados desplegados por el pipeline, con aprobación y smoke: levantar Compose
  a mano no lo satisface.

## Declaración de uso de IA (TP6)

Claude Code escribió el workflow, la plantilla de nginx y la documentación. También ayudó a
configurar los servicios, interpretar logs y comprobar el aislamiento y la respuesta de los
entornos. Las operaciones de consola se documentan con los registros de Neon y Render; las
aprobaciones y rechazos, con GitHub. Los tiempos de rollback de esta sección se tomaron de Render.
La creación de las cuentas forma parte de mi participación indicada al comienzo.

# TP7 — Imagen única por commit, integración y extremo a extremo

## Los entornos ejecutan la imagen que el pipeline construyó

En el TP6 Render **reconstruía** la app desde el repositorio. Ahora los cuatro servicios (api y front,
QA y PROD) son *image-backed* (*Existing Image*): no se compila nada, se ejecuta la imagen que el
pipeline construyó, probó y publicó. Los servicios **no se recrearon**: se les cambió la fuente, lo que
conserva la URL, las variables y el deploy hook. Los hooks pasaron de `&ref=<commit>` a
`imgURL=ghcr.io/…:sha-<commit>`, y el `ref` se sacó del YAML: con una imagen no hay nada que construir.

- **Lo que dice la configuración de Render no es lo que corre.** En *Settings* queda la imagen cargada
  inicialmente (`sha-dee2063…`, el punto de partida); lo que corre lo nombra cada deploy de una corrida.
  Evidencia, en *Events* de `campusgear-front-qa` y `campusgear-api-qa`: «Triggered via Deploy Hook»
  con `sha-ad75d69b9b19012ff892c73e1a29871ca1ebc1d4`, el commit de la corrida
  [39301117867](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/39301117867).
- **Cuidado con *Manual Deploy*:** despliega la imagen de *Settings*, no la que está corriendo, así que
  puede llevar un entorno **para atrás** sin avisar. Todo deploy sale de una corrida.
- **Efecto medido:** sin compilar, el deploy de la api de QA tardó **10,3 s**, contra 23,8 s, 42,6 s y
  27,2 s de los deploys que reconstruían.

## Suites de Playwright: integración y extremo a extremo

Una sola herramienta, dos suites, en `frontend/e2e/`. Traducción al stack (la guía usa .NET y una app de
tareas; acá es Node y un inventario de equipos):

| Pide la guía | En CampusGear |
|---|---|
| pedidos a la api desplegada, sin navegador | `e2e/api.spec.js` con el fixture `request` de Playwright |
| flujos de navegador | `e2e/equipos.spec.js` |
| crear → ver → borrar la tarea | crear → ver → eliminar un **equipo** |
| `getByLabel('Título…')` | `getByLabel('Nombre')`, `'Categoría'`, `'Código'` (los `<label>` envuelven los inputs) |
| `aria-label` «Borrar X» por fila | `aria-label="Eliminar <nombre>"` y `"Editar <nombre>"` por fila |
| `role="alert"` en el error | ya existía en `StateMessage` |
| `vitest` no debe tocar los specs | `exclude: [..., 'e2e/**']` en `vite.config.ts` (ya estaba desde el TP5) |

**Tres pruebas de integración (API, sin navegador):** (1) crear un equipo lo muestra en la lista y
borrarlo lo saca; (2) un equipo sin nombre se rechaza con 400 y no se crea nada; (3) un código duplicado
se rechaza con 409 y el original no se pisa. **Tres flujos de navegador:** (1) crear → ver → eliminar;
(2) un código repetido muestra la alerta al usuario y no crea un segundo equipo; (3) lo creado sigue
ahí después de recargar (se guardó de verdad).

**Una trampa propia de esta app: ninguna prueba crea préstamos.** La API no tiene `DELETE` de préstamos
y la base los protege con `ON DELETE RESTRICT`: un préstamo creado no se puede limpiar, y bloquearía
para siempre el borrado de su equipo y su persona. Por eso la tercera prueba de integración es «código
duplicado» (crea un equipo y lo borra) y no un flujo de préstamo.

**Cada prueba usa datos únicos** (`Date.now()` + azar) y limpia lo que crea. La limpieza mostró
problemas al romper la app a propósito (mutación), y se corrigió dos veces:

1. Con el botón *Eliminar* roto, los tres flujos de navegador fallaban —correcto— pero **dejaban tres
   equipos huérfanos**, porque la limpieza pasaba por la misma pantalla rota. Ahora un `afterEach`
   limpia **por la API**, pase lo que pase en la interfaz.
2. En la prueba de integración 1, la aserción del `201` estaba antes del `try`: si fallaba, no se
   limpiaba. Ahora todas las aserciones van adentro del `try/finally`.

Además, un clic sobre un elemento que no existe tardaba 60 s en fallar; con `actionTimeout: 15 s` tarda
15 s, que es lo que importa cuando un fallo bloquea una promoción.

**Mutaciones locales realizadas por Claude para comprobar las suites:**

| Rotura | Integración (API) | E2E (navegador) |
|---|---|---|
| El botón *Eliminar* pierde su nombre accesible | 3/3 verde | **3/3 rojo** |
| `POST /api/equipos` responde 200 en vez de 201 | **1 rojo** (la de creación) | no se ejecutó |

La primera fila es exactamente el caso que justifica tener las dos suites: la API está sana, la
interfaz no, y sólo la e2e lo ve. En la estructura inicial2 se usa para demostrar que el gate frena
la promoción.

**Dónde se corre:** probado contra el `docker compose` local (los servicios de Render son
compartidos y gastan horas gratuitas: se prueba primero en casa). La integración se apunta a la API
de QA con `API_BASE_URL` y la e2e al front de QA con `E2E_BASE_URL`; el pipeline las ejecuta en la
estructura inicial2.

## El gate de promoción: la demostración

La cadena de `main` es `build-* → deploy-qa → integracion → e2e → deploy-prod`. El gate **está en
`needs`**, no en un `if`: si la integración o la e2e fallan, `deploy-prod` ni siquiera se alcanza ni pide
aprobación. No hay `continue-on-error`, `|| true` ni `always()` en nada que decida el gate; la única
excepción es la *subida del reporte* (`!cancelled()`), que existe justamente para tener el reporte
cuando algo falla.

**1. Rotura a propósito** ([PR
#53](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/53)): se cambió el texto del
botón «Crear equipo» por «Guardar equipo». Compila, los 28 tests unitarios pasan y la API no se
tocó, así que se mergeó sin que nada se pusiera rojo. **Corrida roja:**
[https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/39313636832](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/39313636832)

| Job | Resultado |
|---|---|
| build-backend / build-frontend | verde |
| deploy-qa | verde (QA recibió la imagen rota) |
| **integracion** | **verde**: la API estaba sana |
| **e2e** | **rojo**: el navegador no encuentra el botón |
| deploy-prod | **salteado**: no se pidió aprobación |

Cada suite subió su propio reporte: `reporte-integracion` (196 KB) y `reporte-e2e` (2,8 MB, con las
capturas del fallo). **Comprobación por fuera del pipeline:** el front de QA servía «Guardar equipo» y el
de PROD seguía sirviendo «Crear equipo». La versión rota llegó a QA y nunca a producción.

**2. Corrección** ([PR #54](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/54)): se
revirtió el cambio. **Corrida verde:**
[https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/39314848236](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/39314848236).
La integración y la e2e pasaron, el job de PROD quedó esperando hasta recibir la aprobación
registrada en GitHub. Después de eso, el front de QA y el de PROD sirven **el mismo archivo
JavaScript** (`index-BfBqAaE1.js`): lo que probó la e2e en QA es lo que corre en PROD, no una
segunda construcción.

**Por qué este tipo de rotura.** Es el caso que justifica tener las dos suites: la API está bien y la
interfaz no. La integración sola habría dejado pasar el cambio; sólo la e2e, que maneja un navegador, lo
ve. Y a la inversa, la e2e sola no distingue si el problema está en la API o en la pantalla: las dos
juntas acotan dónde mirar.

## Construir una vez, desplegar muchas

La unidad de entrega es **la imagen publicada**, que se genera en el job de build después de las
pruebas. Ese job también construye una etapa separada para ejecutar los tests. Una vez publicada la
imagen de ejecución, QA y PROD la descargan sin reconstruirla:

- `ghcr.io/alesiocobresiserravalle/ingsoft3-tp01-{backend,frontend}:sha-<commit>`: QA y PROD
  ejecutan **la misma imagen**; lo único que las distingue es la configuración por entorno
  (`DATABASE_URL`, `BACKEND_URL`, `DNS_RESOLVER`), que está **fuera** de la imagen (TP6).
- Los hooks de Render llevan `imgURL=<imagen>:sha-<commit>`. Render ya no compila: descarga y arranca.
  Efecto medido: la api de QA pasó de 24 a 43 s por deploy (reconstruyendo) a **10,3 s** (ejecutando).
- **Etiquetas, no digests.** `sha-<commit>` identifica el **origen** (qué commit produjo la imagen) por
  convención; no existe `latest`. Pero un tag del registry **puede moverse**: nada impide volver a publicar otro
  contenido bajo el mismo `sha-…`, y reconstruir el mismo commit tampoco garantiza bytes idénticos si cambió una
  imagen base o una dependencia sin fijar. Lo que identifica el **contenido** es el *digest*
  (`sha256:…`). Este pipeline promueve por tag, lo cual la guía permite; no se implementó la promoción por
  digest, y por eso «lo que probó la e2e en QA es lo que corre en PROD» vale como comportamiento de **una
  corrida** (la misma construcción, un tag, dos entornos), no como garantía criptográfica.
- **De la release a la imagen:** el tag `vN.0.0` del repositorio es un hito del curso y apunta a un
  commit; ese commit tiene su imagen `sha-<commit>` en los dos paquetes. Release → commit → imagen es una
  cadena de una sola dirección y sin ambigüedad. `v7.0.0` va sobre el commit que **está en PROD**.

## Límites conocidos de las pruebas de TP7

- **QA es un entorno compartido.** El `concurrency` de `deploy-qa` evita dos *despliegues* a la vez, pero no
  reserva QA mientras corren los jobs siguientes: otra corrida puede terminar su `deploy-qa` (cambiando la
  imagen de QA) mientras `integracion` o `e2e` de la anterior todavía prueban, y esas pruebas validarían una
  versión que no es la suya. Reglas de uso: **un merge por vez durante la cadena**, y **descartar (rechazar) una
  promoción a PROD cuya prueba coincidió con otro despliegue a QA**. El `concurrency` de PROD tampoco prueba
  que QA haya quedado aislado: sólo serializa el despliegue final.
- **Los préstamos no se prueban contra la base real en estas suites.** Las tres integraciones y los tres
  flujos e2e trabajan sobre **equipos**, porque la API no borra préstamos y un préstamo de prueba ensuciaría QA
  para siempre. La lógica de préstamos se prueba con dobles (unitarios) y la regla de unicidad se
  comprueba además contra un Postgres efímero en el pipeline, como se describe en el TP5. Estos
  casos no cubren toda la interfaz ni toda la aplicación.
- **Limpieza.** Cada prueba limpia lo que crea y la limpieza se **comprueba**: las integraciones comprueban
  el `204` del borrado y que el código ya no aparece en la lista; el `afterEach` de la e2e exige `204` por cada
  borrado y que ningún equipo del test siga en la base. `finally` no garantiza la limpieza por sí solo (la red o
  el borrado pueden fallar): por eso se verifica.

## Qué NO prueba el smoke test

El smoke test comprueba que el entorno **responde**: la API, la base, el front y el proxy. No prueba que
esté ejecutando **tu imagen**: si un deploy fallara, el servicio seguiría sirviendo la versión anterior y
el smoke daría verde igual. Por eso la evidencia de qué corre es *Events* de cada servicio en Render, que
para cada deploy dice «Triggered via Deploy Hook» y nombra el `sha-<commit>` de la corrida. Cerrar ese
hueco automáticamente (que `/health` devuelva el commit y el smoke lo compare) queda como mejora y no se
implementó.

Un riesgo relacionado, propio de Render: **no usar *Manual Deploy***. Despliega la imagen de
*Settings* (la imagen configurada como punto de partida), no la que está corriendo, y puede llevar
un entorno hacia atrás sin avisar.

## Declaración de uso de IA (TP7)

Claude Code escribió las suites de Playwright y el gate de promoción. Ejecutó las mutaciones locales
y corrigió los problemas de limpieza que aparecieron. Las corridas roja y verde muestran el
comportamiento del gate; los eventos de Render registran la imagen desplegada y GitHub conserva la
aprobación de producción.

# TP8 — Infraestructura como código

## Herramientas y versiones

Se usó **Terraform + Neon + Render**, siguiendo el riel de la guía y los proveedores del TP6. Se
declara un entorno **nuevo, `preprod`** (base de Neon + api y front en Render, corriendo la imagen
del pipeline) que **convive** con QA y producción sin tocarlos: no se importaron, no se migraron,
ningún plan los menciona.

| Pieza | Versión | Nota |
|---|---|---|
| Terraform | **1.16.6** (`darwin_amd64`) | binario oficial de HashiCorp con el SHA256 verificado: `brew` falló en la Mac Intel usada para el proyecto por una incompatibilidad de las Command Line Tools |
| `kislerdm/neon` | **0.18.0** | versión fijada para esta entrega; al configurar el TP, su repositorio estaba archivado y no se encontró `neondatabase/neon` en el registro |
| `render-oss/render` | **1.9.1** | fijada |
| `terraform_data` + `local-exec` | integrado | corre la migración del esquema (ver abajo) |

El `.terraform.lock.hcl` **se commitea** (fija versión y hashes de los providers). El estado
(`terraform.tfstate`), `.terraform/` y los `*.tfvars` están en el `.gitignore` **desde antes del
primer apply**. Ninguna credencial está escrita en el HCL: `NEON_API_KEY`, `RENDER_API_KEY` y
`RENDER_OWNER_ID` las leen los providers desde las variables de entorno de la terminal.

## Qué se declara y qué se deriva

- `neon_project` (propio de preprod, con `history_retention_seconds = 21600`, el tope del plan gratuito),
  `neon_role` y `neon_database`. Un proyecto aparte se puede destruir entero sin rozar QA ni producción.
- **La `DATABASE_URL` se deriva**, no se copia: se arma con el rol, la contraseña (con `urlencode`), el host
  y la base que devuelve Neon. Es una URI de Prisma (`postgresql://…?sslmode=require`), no la cadena de pares
  de la guía (.NET). Así se evita cruzar las credenciales de QA y PROD, un riesgo señalado en el TP6.
- **La `BACKEND_URL` del front se deriva** del atributo `url` de **su** api (con `trimsuffix` para evitar la
  barra final). El front además lleva `DNS_RESOLVER=8.8.8.8` y `PORT=80`: nginx escucha en el 80 y Render
  espera el 10000 por defecto.
- Los servicios usan `runtime_source.image` con `image_url` **sin** la etiqueta y `tag` aparte
  (`sha-a95fc1ee…`, un merge a `main` con imágenes publicadas). Sin `latest`.
- **El esquema:** una base nueva nace vacía y el backend no crea las tablas al arrancar (usa migraciones de
  Prisma y la imagen no trae el CLI). Terraform crea **la base, no el esquema**; para que un solo `apply` deje
  el entorno funcionando, un `terraform_data` con `local-exec` corre `prisma migrate deploy` apenas existe la
  base, y se **vuelve a correr si la base se recrea** (`triggers_replace`). Es un *provisioner*, que Terraform
  considera último recurso, y deja una dependencia: el CLI de Prisma tiene que estar en la máquina que aplica.

## Comprobaciones de la infraestructura

- **Idempotencia:** el segundo `plan` dijo `No changes`.
- **Drift:** se borró a mano la base en Neon y el `plan` lo detectó (`neon_database.preprod has been deleted`).
  El plan propuso `2 to add, 1 to destroy`, no uno solo: la migración depende del id de la base, y como la
  nueva tiene otro id, Terraform la marcó `# forces replacement` y la volvió a correr. Es lo correcto: una
  base recién creada está vacía. Después de `apply` la API volvió a responder con sus tablas. Se creó a mano una
  `base_intrusa` que el HCL no declara y el plan siguió diciendo `No changes`: Terraform compara los recursos que administra con su estado y configuración; no incorpora
  automáticamente todo lo que existe en la cuenta. QA y PROD también quedan fuera de este estado.
- **Ciclo de vida:** `destroy` baja preprod entero y `apply` lo trae de vuelta con la API, la base (con
  tablas) y el frontend respondiendo. QA y PROD siguieron respondiendo en todo momento. Los ids de Neon
  cambiaron al recrearlo (`still-bird-…` → `royal-wind-…`), señal de que se recreó de verdad.
- **`prevent_destroy`:** con el bloque en la base, `terraform destroy` se negó (`Instance cannot be
  destroyed`) y nombró el recurso. Después se retiró el bloque para poder destruir preprod al terminar. Protege contra un destroy
  accidental, pero no contra borrar el bloque del código; la protección real es el PR revisado más un backup.
  Iría en una base de producción, no en preprod, que nace vacía y se llena sola.

## Estado, cuota y tareas manuales

- **El estado es local** y contiene contraseñas en texto plano, por eso no se commitea. Si se pierde,
  los recursos siguen existiendo, pero Terraform pierde la relación entre esos recursos y su configuración.
  Habría que recuperar el estado o importar los recursos antes de volver a aplicar. Para que lo comparta un equipo (o una corrida del
  pipeline) tendría que mudarse a un *backend* remoto con bloqueo.
- **Las 750 horas gratuitas de Render son del workspace**, compartidas entre todos los servicios gratuitos: con
  preprod pasan de 4 a 6. Agotar esa cuota afecta también a producción. Por eso preprod se destruye al
  terminar cada sesión; es un entorno que existe cuando se lo necesita.
- **Configuración manual:** QA y PROD se crearon desde sus consolas y no están en este estado de
  Terraform. Los deploy hooks también se configuraron a mano porque el provider usado no los expone.
  Con esa versión apareció además una limitación al modificar servicios `free`; por eso preprod
  se usa mediante creación y destrucción, sin depender de cambios sobre el servicio existente.
- **El workflow `infra.yml`** (opcional) corre `fmt` y `validate` en cada PR que toca `infra/`, **sin
  credenciales**. No corre `plan`: necesitaría las claves como secrets (la de Render da acceso a todo el
  workspace, QA y PROD incluidos) y además un estado compartido. El `apply` se ejecutó desde la
  terminal local. Las credenciales no se incluyen en los archivos del repositorio.

## Problemas encontrados y solución

1. **`brew install` falló** (Mac Intel con Command Line Tools desactualizadas): se instaló el binario oficial en
   `~/bin`, verificando el hash antes.
2. **`org_id is required`:** las cuentas nuevas de Neon pertenecen a una organización y la API exige indicarla.
   Se agregó como variable sin default (`TF_VAR_neon_org_id`). No es una credencial pero es propia de la cuenta.
3. **`org_id` con un salto de línea**, por haber cerrado mal las comillas en el `export`: se veía como un bloque
   `<<-EOT` en el `plan` *antes* de tocar nada. Se corrigió en el código con `trimspace`.
4. **El esquema de una base nueva** (ver arriba) y el `PORT=80` del front, que la guía no necesitaba.
5. **Clave de Render expuesta al copiar una línea de `export` al chat.** Corresponde revocarla y
   reemplazarla desde *Account Settings → API Keys*. **La revocación queda pendiente de confirmar**.
   Se registra el incidente sin reproducir el valor. Para compartir resultados, se deben omitir las
   credenciales y revisar también la salida de `plan`, que puede contener datos sensibles.

## Declaración de uso de IA (TP8)

Claude Code escribió el HCL, el workflow de validación y la documentación. Ayudó a interpretar los
planes, los errores y los cambios de infraestructura. Las ejecuciones de `plan`, `apply` y `destroy`
se realizaron desde la terminal local con credenciales de las cuentas. Claude comprobó desde afuera
el `/health`, una consulta a la base y el proxy del frontend. El incidente con la clave está
registrado en «Problemas encontrados y solución».

# TP9 — DevSecOps y observabilidad

## Dependencias: el PR de Dependabot que se mergeó

Dependabot quedó activo en cinco lugares (`npm` del backend y del frontend, las GitHub Actions y las imágenes base de
los dos Dockerfiles), con las **alertas** y las **actualizaciones de seguridad** prendidas. A los pocos minutos del
merge abrió PRs; los dos primeros arreglaban vulnerabilidades publicadas, no eran versiones rutinarias.

**Se mergeó el [#59](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/59): `proxy-addr` de 2.0.7 a 2.0.8, en `/backend`.**
- **Qué es:** una actualización **patch** que toca únicamente `package-lock.json`. Es una dependencia
  transitiva de Express (`express@5.2.1 → proxy-addr`), por lo que también forma parte del software
  que ejecuta el backend aunque no se importe directamente en el código de la aplicación.
- **Por qué importaba:** arreglaba GHSA-jqcg-44mw-7w3h (CVE-2026-90711), suplantación de IP por una subred IPv4
  mapeada en IPv6, severidad **crítica** (CVSS 9.1) y de **runtime**.
- **Relevancia para CampusGear:** en la revisión del backend no se encontraron usos de `trust proxy`,
  `req.ip` ni cabeceras `x-forwarded`. No se identificó una vía de explotación en ese uso del código;
  esto no reemplaza un análisis completo del advisory. Se aplicó el parche por su severidad y
  porque un cambio futuro podría incorporar esas funciones.
- **Por qué había confianza para mergearlo** (dos momentos distintos, que no hay que mezclar):
  1. *Verificaciones del PR (antes del merge):* un patch que solo cambia el lockfile, con changelog que solo
     menciona el arreglo, y los checks requeridos en verde sobre el PR: `build-backend` y `build-frontend`
     (tests unitarios, umbral de cobertura, construcción de las imágenes). En el PR, `deploy-qa`,
     `integracion`, `e2e` y `deploy-prod` aparecen **omitidos** por diseño: sólo corren en `push` a `main`.
  2. *Pruebas posteriores al merge:* ya en `main`, la cadena completa —deploy a QA con smoke, integración, e2e,
     aprobación y deploy a PROD— terminó en verde
     ([corrida 39470387567](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/actions/runs/39470387567)).
     Esa corrida confirma el parche en los entornos; no es una verificación previa que respaldara el merge.
- **Resultado:** la alerta crítica pasó a `fixed` sola al aparecer `proxy-addr 2.0.8` en `main`.
- **Los mayores no se mergean a ciegas:** `prisma 7/8`, `zod 4` y `typescript 7` quedan para analizarse con
  calma, porque pueden traer cambios incompatibles.
- **Límite de la comprobación:** `npm audit` había informado 0 vulnerabilidades antes de publicarse
  estas alertas. El resultado depende de la información disponible en el momento de ejecutarlo.

## Análisis del código y protección de secretos

- **CodeQL activo** (configuración por defecto, JavaScript/TypeScript y workflows de Actions), con el primer análisis
  en verde y **0 alertas** en `main`. Corre en cada PR y push.
- Para comprobar la detección, **se agregaron fallas deliberadas** en una rama separada ([PR #73](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/73), cerrado):
  un XSS reflejado, una inyección de comandos y la falta de *rate limiting*. CodeQL los detectó en el PR
  (`3 new alerts including 1 critical`) y el umbral de cobertura frenó el mismo código por su lado: dos
  controles distintos. Los tests existentes no ejercitan esas entradas; CodeQL analiza el flujo
  desde `req.query` hasta `exec` sin ejecutar ese comando. Cero alertas no implica ausencia de fallas.
- **Secret scanning y push protection** ya estaban activos en el repositorio público (verificado). La demo del
  push bloqueado con un token sin permisos es una práctica recomendada que **no se realizó**. Lo que esa protección **no**
  detecta: un secreto inventado o en un formato que no conoce; por eso las medidas anteriores (`.env`
  ignorado, secrets cifrados y por entorno) siguen siendo necesarias.

## Monitoreo externo y la caída provocada

Monitor de UptimeRobot sobre el `/health` de PROD (el plan gratuito pregunta con `HEAD`; se comprobó
que el endpoint responde 200 a `HEAD`, Express lo hace solo). Se provocó una caída suspendiendo el
servicio de la api de PROD en Render (20/10/2026; las horas de la tabla son las registradas durante
el ejercicio):

| Evento | Hora local |
|---|---|
| Se suspendió el servicio | 23:00 |
| Se observa el primer 503 | 23:00:37 |
| **Aviso DOWN del monitor** | **23:02** |
| `/health` vuelve a dar 200 | 23:03:01 |
| Aviso UP del monitor | 23:03 |

**Tiempo de detección medido: ~2 minutos** (del primer 503 observado, 23:00:37, al aviso DOWN,
23:02), en **una sola** observación; la caída duró ~2 minutos y medio. Con un intervalo de chequeo
de 5 minutos un fallo se detectaría, en general, dentro de ese intervalo más el tiempo de
notificación, pero **no es un máximo garantizado** y esta medición no lo prueba. Abrir `/health` a
mano después de reanudar lo despertó; sin eso el UP puede tardar más de 20 minutos. **Es externo**
porque si la infraestructura de la aplicación se cae, un monitoreo interno se cae con ella; permite
avisar de una caída sin depender de que un usuario la reporte. **La regla:** el monitor se pausa al
terminar el ejercicio, porque un servicio gratuito despierto todo el mes consume las 750 horas del
workspace y, si se pasan, Render suspende todos los servicios, producción incluida.

## Qué falla, qué tarda y qué se usa (Sentry)

Sentry en el backend (`@sentry/node`, inicializado antes de Express; el DSN llega por `SENTRY_DSN`, apagado si falta)
y en el frontend (`@sentry/react`; el DSN va escrito en el código porque en un front **no es un secreto**: solo
permite enviar datos, no leerlos, y viaja en el JavaScript que baja cualquier navegador). Subido por [PR #74](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/pull/74)
y desplegado por la cadena completa. Coste visible: el bundle del frontend pasó de ~243 kB a ~401 kB.

- **Un error:** `Error: Falla de prueba del TP9` (`CAMPUSGEAR-BACKEND-1`, `GET /api/falla`, `environment: production`),
  de un endpoint temporal que después se retiró mediante otro PR.
- **Muestra de uso** (tabla *Traces → Aggregates*, ventana «últimas 24 h» de una captura tomada entre
  el 20 y el 24/10/2026). No se registró la fecha exacta; estos valores describen esa ventana y no
  una medición continua actualizada:

| Operación | Pedidos | p95 |
|---|---|---|
| `GET /api/equipos` — **la más usada** | 12 | 17,82 ms |
| `GET /api/dashboard/resumen` — **la más lenta** | 9 | **905,05 ms** |
| `GET /api/prestamos` | 6 | 44,60 ms |
| `GET /api/personas` | 5 | 196,90 ms |
| `PATCH /api/equipos/:id` | 2 | 253,03 ms |

- **Hipótesis, no causa demostrada, sobre por qué el dashboard es lo más lento:** es la página de inicio, así que suele ser el primer pedido tras un rato
  sin uso y paga el arranque en frío de la base gratuita (Neon la suspende a los 5 minutos); con solo 9 pedidos el p95 es
  casi el máximo. Además `obtenerResumen` hace dos consultas en serie que no dependen entre sí (eso sí se ve en el código). Con 9 pedidos no se puede separar el efecto del arranque en frío del de las consultas: **próximo experimento** —medir el mismo endpoint en frío y en caliente, y con las consultas en paralelo— antes de afirmar la causa.
- **Diferencia con el monitor:** UptimeRobot comprueba disponibilidad desde afuera. Sentry permite
  observar errores, latencia y uso de operaciones dentro de la aplicación.
- **La tarjeta:** [#75](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/issues/75) en el tablero, creada a partir de esa medición. Incluye el p95 observado y propone investigar
  el endpoint: es el paso de una señal de producción a una tarea de mejora.

## Métricas DORA (práctica recomendada)

Con el historial real de `main`, desde que el pipeline tiene `deploy-prod` (12/10), aproximadas:

| Métrica | Resultado | Cómo |
|---|---|---|
| Frecuencia de despliegue | **9 despliegues a PROD en 10,8 días** (0,83/día) | corridas de `main` con `deploy-prod: success` |
| Lead time (merge → PROD) | mediana **6 min**; mínimo 3 min; máximo 26 h 42 min | commit de merge contra el fin de `deploy-prod`; el máximo es **espera de aprobación**, no lentitud del pipeline. No incluye el tiempo de escribir el código |
| Tasa de fallo | **1 de 9 ≈ 11 %** | el despliegue de Sentry (ver `postmortem.md`) |
| Tiempo de recuperación | **28,5 s**: sólo el redeploy técnico del rollback por commit del TP6 (leído en Render); **~10 min**: duración del incidente de Sentry hasta tener la configuración correcta | dos mediciones distintas, no comparables entre sí |
| *(no es recuperación)* Tiempo de detección | ~2 min en la caída provocada del monitor | ver «Monitoreo externo»; es detección, no recuperación |

El gate además evitó un fallo en producción (la rotura del botón se frenó en QA) y cinco corridas no llegaron a PROD
(dos rechazadas, dos canceladas, una salteada por la e2e roja). La métrica que movería primero es la **tasa de fallo**,
y la pieza que la mueve es un smoke que compruebe la **versión** que corre, no solo que responde (acción 1 del postmortem).

## Postmortem sin culpables

[`postmortem.md`](https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01/blob/main/postmortem.md): un despliegue «exitoso» dejó ~10 minutos a producción con Sentry
apagado y el frontend sirviendo el bundle anterior. Causa de **sistema**: una configuración manual que nada exigía
y un pipeline que no verifica qué versión corre. Una hipótesis inicial (un despliegue manual de la imagen vieja) se
descartó con los eventos de Render; la causa del frontend desfasado queda **sin determinar** y está dicho.

## Problemas encontrados

1. **`SENTRY_DSN` sin cargar en PROD:** el backend desplegó con Sentry apagado y no mostraba datos (ver postmortem).
2. **El frontend de PROD no sirvió el bundle nuevo a los ~4 minutos del despliegue «exitoso»**, causa no determinada.
3. **Una aprobación de PROD olvidada** de un PR anterior retuvo el grupo de `concurrency` y dejó en cola la corrida
   siguiente; se resolvió rechazando la vieja y aprobando la nueva.
4. **La interfaz de Sentry no coincidía con la guía:** las tablas se encontraron en *Explore → Traces*,
   en lugar de *Insights → Backend*.

El incidente con la clave de Render y su seguimiento quedan registrados en el TP8.

## Declaración de uso de IA (TP9)

Claude Code escribió la configuración de Dependabot, la integración de Sentry, el endpoint temporal,
el postmortem y esta sección. Consultó GitHub y contrastó las respuestas de la aplicación con los
eventos de Render. Las corridas enlazadas muestran los resultados del pipeline; la muestra de Sentry
y la tarjeta `#75` documentan el dato de observabilidad y la mejora propuesta. Mi aporte a la
creación de las cuentas se indica en la declaración inicial.
