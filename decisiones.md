# Decisiones — TP1

## Por qué Git no pudo resolver el conflicto solo

Las ramas `feature/titulo-a` y `feature/titulo-b` partieron del mismo commit de `main` y cada una
modificó **la misma línea** del `README.md` (el título), con contenido distinto. Git resuelve solo
los cambios que tocan partes distintas de un archivo; cuando dos ramas editan la misma línea no
tiene manera de decidir cuál de las dos versiones es "la correcta" — las dos son ediciones legítimas
del mismo lugar, y esa decisión de contenido solo la puede tomar una persona.

Para que este conflicto nunca hubiera aparecido, una de las dos ramas debería haber partido
**después** de que la otra ya estuviera integrada a `main` (por ejemplo, crear `feature/titulo-b`
recién después de mergear `feature/titulo-a`), en vez de las dos en paralelo desde el mismo punto de
partida sin enterarse una de la otra. En un equipo real, esto es exactamente lo que ramas cortas e
integración frecuente evitan: cuanto más tiempo conviven dos cambios sobre el mismo lugar sin
integrarse, más grande y más probable es el conflicto.

## Problemas encontrados y cómo los solucioné

- **El conflicto quedó resuelto con las dos versiones combinadas, no con una sola.** Al resolver
  desde el editor web de GitHub, el `README.md` terminó con las líneas "versión B" y "versión A"
  seguidas, en vez de haberme quedado solo con una. No es un error — la consigna permite elegir una
  versión, la otra, o una combinación de las dos — y decidí dejarlo así en vez de "corregirlo"
  después, porque es evidencia honesta de cómo resolví el conflicto en el momento, y de que entendí
  que resolver un conflicto es tomar una decisión de contenido y no ejecutar un procedimiento con un
  único resultado válido.
- **Después de resolver el conflicto, GitHub tardó unos segundos en habilitar el botón de merge**
  (mostraba "Checking for the ability to merge automatically..."). No fue un error de mi resolución:
  la plataforma recalcula el estado del PR después de cada cambio, y hubo que esperar unos segundos
  y refrescar la página para que el botón de merge quedara habilitado.
- **La protección de `main` bloqueó también el `.gitignore` inicial.** Como configuré la protección
  de rama antes de subir el primer archivo, no pude hacer el `push` directo que sugiere el orden
  original de la guía — el `.gitignore` tuvo que entrar por su propio PR desde el principio, en vez
  de ser el commit que "descubre" la protección más adelante. No cambia el resultado, solo el orden.

## Declaración de uso de IA

Usé Claude (Anthropic) como asistente durante todo el TP. Concretamente:

- Para diseñar, antes de empezar el TP1, un plan de trabajo del semestre completo (arquitectura de
  la futura aplicación, roadmap de fases) que sirve de contexto para los TPs siguientes.
- Para este TP puntual, como guía paso a paso: qué comandos correr (clonar, crear y cambiar de
  rama, commitear, pushear, revertir el commit de prueba, crear y publicar el tag), en qué orden, y
  qué esperar en cada paso (por qué se rechaza el push, por qué aparece el conflicto, qué significa
  cada marcador).

Cómo lo verifiqué: no di por buena ninguna afirmación sin comprobarla yo mismo. Cada comando de Git
se ejecutó de verdad en mi máquina y la salida de la terminal (incluido el rechazo del push) es la
real, no una simulación. Cada paso hecho en la web de GitHub —crear los Pull Requests, resolver el
conflicto, publicar la release— lo hice yo mismo, viendo el resultado en la propia interfaz de
GitHub y comparándolo contra lo que la guía de la cátedra describe. Las cuatro capturas de
`evidencias.md` son la prueba de que lo que se describe en este documento efectivamente ocurrió.

## Modelo de datos (previo al TP2)

Antes de escribir cualquier endpoint, se diseñó el modelo de datos en `backend/prisma/schema.prisma`
con tres entidades: `Equipo`, `Persona` y `Prestamo`.

**Por qué `Equipo` no tiene un campo `estado` (DISPONIBLE/PRESTADO) persistido.** Guardar ese campo
como columna obliga a mantenerlo sincronizado a mano en cada punto donde se crea o se devuelve un
préstamo — y un solo lugar donde se olvide esa actualización deja el sistema en un estado
inconsistente (equipo marcado "disponible" con un préstamo activo, o viceversa). En cambio, derivar
el estado a partir de si existe o no un `Prestamo` activo para ese equipo (uno con
`fechaDevolucionReal = null`) hace que la inconsistencia sea **imposible por construcción**: no hay
dos lugares donde el mismo dato pueda decir cosas distintas. El costo es una consulta extra al
listar equipos (buscar si tiene un préstamo activo) en vez de leer una columna — irrelevante para el
volumen de datos de esta aplicación, y minúsculo comparado con el riesgo de inconsistencia.

**Por qué "vencido" tampoco se persiste.** Un préstamo vencido es, simplemente, un préstamo activo
(`estado = ACTIVO`) cuya `fechaDevolucionPrevista` ya pasó. Guardarlo como un tercer valor del enum
`EstadoPrestamo` exigiría un proceso que lo actualizara cada vez que cruza esa fecha (un cron, por
ejemplo), con el riesgo de quedar desactualizado entre corridas. Calcularlo al leer
(`estado === 'ACTIVO' && fechaDevolucionPrevista < ahora`) es siempre exacto y no depende de que
ningún proceso se haya ejecutado a tiempo.

**Qué restricciones van en cada capa:** la integridad referencial (que un préstamo no pueda apuntar
a un equipo o persona inexistente) la resuelve Postgres con claves foráneas
(`onDelete: Restrict`, para no poder borrar un equipo o persona con historial de préstamos); el
formato de los datos de entrada (fechas válidas, `fechaDevolucionPrevista >= fechaPrestamo`, email
con formato válido) se valida con Zod antes de llegar a la base; y que un equipo no se pueda prestar
dos veces al mismo tiempo es una regla de negocio que se resuelve en el service, dentro de una
transacción, en el momento de crear el préstamo.

**Nota sobre una vulnerabilidad reportada por `npm audit`:** al instalar las dependencias del
backend, `npm audit` marca 3 vulnerabilidades "high" en `deepmerge-ts`, una dependencia interna del
**CLI** de Prisma (`@prisma/config`), no de `@prisma/client` (lo único que corre en producción). No
hay todavía una versión estable de Prisma que la corrija — la única más nueva disponible es una
release candidate (`8.0.0-rc.12`), y no se adopta un release candidate en un proyecto que hay que
mantener y defender todo el semestre. Queda como riesgo conocido, aceptado y no bloqueante, a
revisar cuando Prisma publique una versión estable que la resuelva.

## Persistencia

Para desarrollo local (todavía sin Docker Compose, eso es el TP2) PostgreSQL corre como un
contenedor suelto (`docker run postgres:16-alpine ...`, publicado en el puerto 5432 del host), no
instalado en la máquina. `DATABASE_URL` en `backend/.env` apunta a `localhost:5432` porque el
backend en esta fase corre directo con Node, no dentro de otro contenedor — cuando el backend mismo
se contenerice (TP2), esa misma variable va a apuntar al nombre del servicio (`db`), no a
`localhost`.

`backend/src/lib/prisma.ts` es la única instancia de `PrismaClient` de todo el proyecto: ningún
controller ni route importa Prisma directo, solo los services (a partir de la Fase 5) importan
`prisma` desde ese archivo. Se verificó a mano (con un script descartable, no versionado) que:
persistir y leer los tres modelos funciona correctamente, y que la restricción `ON DELETE RESTRICT`
de las claves foráneas efectivamente impide borrar un `Equipo` con préstamos asociados (lanza
`PrismaClientKnownRequestError`) — la primera de las reglas de negocio del enunciado, resuelta a
nivel de base de datos en vez de en código.

## API de Equipos

El CRUD de `Equipo` sigue la separación de capas definida: `routes` (mapea verbos HTTP),
`controllers` (parsea/responde HTTP, sin lógica), `services` (reglas y acceso a Prisma), `schemas`
(Zod). El `estado` derivado (ver sección "Modelo de datos") se calcula en un único punto del
service (`conEstadoDerivado`), a partir de si el equipo tiene o no un préstamo con
`fechaDevolucionReal = null` — nunca se guarda ni se recalcula en otro lugar.

**Traducción de errores de Prisma a HTTP:** dos códigos de error de Prisma se traducen a respuestas
significativas en vez de dejar pasar un `500` genérico: `P2002` (violación de restricción única,
acá el `codigo` repetido) se traduce a `409 Conflict`, y `P2003` (violación de clave foránea, acá un
`Equipo` con préstamos asociados) también a `409`. Ambos se probaron de verdad por HTTP: el código
duplicado devuelve `409` en el alta, y el borrado de un equipo con un préstamo activo (insertado
directo con Prisma, ya que el endpoint de Préstamos es de la Fase 7) también devuelve `409` — la
regla de negocio 1 del enunciado ("un equipo prestado no puede eliminarse sin más") ya queda
validada de punta a punta antes de tiempo.

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

**Regla 1 y 2 dentro de una transacción:** `crearPrestamo` corre en un `prisma.$transaction`: busca
el equipo, la persona, chequea que no haya un préstamo activo, y recién ahí crea el nuevo préstamo.
Esto cierra la condición de carrera de dos requests casi simultáneos prestando el mismo equipo (ver
sección 5 del plan maestro): la segunda transacción ve el préstamo que acaba de confirmar la
primera.

**Un efecto secundario esperado, no un bug:** al querer limpiar los datos de prueba, `DELETE
/api/equipos/:id` y `DELETE /api/personas/:id` dieron `409` incluso con el préstamo ya **devuelto**
— es exactamente lo diseñado (`onDelete: Restrict` no distingue préstamos activos de históricos,
adrede: son historial). La limpieza de la base de desarrollo se hizo con un script directo de
Prisma, no por la API — que es, otra vez, el comportamiento correcto.

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
script y configuración — el análisis estático es una decisión deliberada del TP5, no algo que
convenga heredar sin elegirlo a propósito. También se sacaron el `README.md` y el `.gitignore` que
trae el scaffold: el segundo duplicaba reglas que ya cubre el `.gitignore` de la raíz del proyecto
(una sola fuente de verdad para todo el repo, como se decidió en el TP1).

Se agregó `react-router-dom` para las tres rutas (`/`, `/equipamiento`, `/prestamos`) en vez de
armar la navegación a mano con estado — es la forma estándar de la industria para esto, y evita
reinventar algo que la librería ya resuelve bien (back/forward del navegador, resaltado del link
activo).

**Prueba de conectividad real:** el `vite.config.ts` proxea `/api` hacia `http://localhost:3000`
(el mismo prefijo relativo que en producción va a traducir nginx, TP2). El plan original de esta
fase mencionaba probar contra `/api/health` — pero el healthcheck vive en `/health` (sin el prefijo
`/api`, ver la sección "API inicial" del diseño), a propósito: no es una ruta que la SPA deba poder
alcanzar a través del proxy, es un chequeo de infraestructura que en el TP2 va a golpear el
contenedor del backend directamente. Se probó la conexión real contra `GET /api/dashboard/resumen`
en su lugar, que sí es un endpoint pensado para la SPA. Se verificó con el navegador (Dashboard
muestra la respuesta real del backend, `{"totalEquipos":0,...}`) y navegando entre las tres
pantallas, confirmando con `window.location.href` que el ruteo por cliente cambia la URL de verdad.

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
- intento de borrar un equipo con un préstamo activo (insertado directo con Prisma, igual que en la
  Fase 5) → la UI muestra el `409` del backend ("No se puede eliminar un equipo con préstamos
  asociados...") y el equipo **no** desaparece de la tabla — el error no deja la interfaz en un
  estado inconsistente con la base.

No se agregó debounce a la búsqueda (dispara una request por cada tecla): para el volumen de datos
de esta app la simplicidad vale más que la optimización, y agregarlo ahora sería resolver un
problema de performance que todavía no existe.

## Frontend: Préstamos

El diseño de la interfaz (sección 5) solo define tres pantallas — Dashboard, Equipamiento,
Préstamos — sin una pantalla propia de gestión de Personas. Como igual hace falta elegir una
persona al registrar un préstamo, el formulario resuelve esto con un selector de personas
existentes (`GET /api/personas`) más un alta rápida inline que llama al mismo endpoint de creación
del TP — sin construir un CRUD de Personas que el enunciado no pide.

**Un bug real encontrado y corregido:** al registrar un préstamo con devolución prevista el
`06/09/2026`, la tabla mostraba `05/09/2026` — un día antes del elegido. Causa: `<input
type="date">` no lleva hora, así que el valor
`"2026-09-06"` se interpreta como medianoche **UTC**; `toLocaleDateString()` sin zona horaria
explícita lo convierte a la hora **local** del navegador antes de mostrarlo, y en cualquier huso
horario detrás de UTC eso cae en el día anterior. No es cosmético: es un desfasaje real de fecha. Se
corrigió forzando `{ timeZone: "UTC" }` en el formateo — estas fechas representan un día elegido, no
un instante preciso, así que tiene que mostrarse igual sin importar dónde esté el navegador.

Se probó el ciclo completo en un navegador real:

- registrar un préstamo → el equipo prestado desaparece del selector de "equipos disponibles" del
  propio formulario, y en `Equipamiento` pasa a `PRESTADO` sin haber tocado esa pantalla;
- registrar la devolución → el préstamo pasa a `DEVUELTO` (el botón de devolución desaparece), y en
  `Equipamiento` el equipo vuelve a `DISPONIBLE`;
- un préstamo vencido (insertado directo con Prisma, igual que en la Fase 7, porque el `<input
  type="date">` no permite la precisión de segundos que usó esa prueba) se muestra en rojo con la
  etiqueta `VENCIDO`, y el filtro "Vencidos" lo aísla correctamente del resto.

No se implementó ningún manejo de estado global ni cache entre pantallas (cada pantalla vuelve a
pedir sus datos al navegar): para el tamaño de esta app alcanza, y agregarlo ahora sería
sobre-ingeniería.

## Frontend: Dashboard

Reemplaza el placeholder de conectividad de la Fase 9 por el contenido real: cinco tarjetas
(`StatTile`) con los números de `GET /api/dashboard/resumen`. Se armó el mismo escenario de prueba
de 5 equipos de la Fase 8 (uno disponible, tres prestados —al día, vencido, próximo a vencer— y uno
devuelto) y el Dashboard del frontend mostró exactamente `5 / 2 / 3 / 1 / 1`, coincidiendo con lo
verificado por API en esa fase — misma fuente de datos, dos maneras de comprobarlo.

Con esto queda completo el MVP de las tres pantallas (Dashboard, Equipamiento, Préstamos) definidas
en el diseño de la interfaz, funcionando de punta a punta contra el backend real. Lo que sigue
(Fases 13 en adelante) ya no agrega pantallas nuevas: es integración, Docker y CI.

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
encontrado y corregido en las Fases 3 y 11 respectivamente.

**Por qué CampusGear como app del semestre, contra los criterios de la guía del TP2 (§3.3):**

- *¿Buildea y corre localmente hoy, sin magia?* Sí — se demostró en esta misma fase, de punta a
  punta, sin Docker.
- *¿Tiene o se le puede escribir tests?* Sí, y con ventaja: la lógica de negocio vive aislada en
  `services/` (sin Express ni Prisma acoplados en el mismo lugar), pensada desde la Fase 3 para
  poder testearse con Vitest sin levantar un servidor, y las rutas se pueden testear con Supertest
  importando `app.ts` sin abrir un puerto — ambas cosas listas para el TP5.
- *¿Se entiende el código lo suficiente como para modificarlo?* Sí: se construyó módulo por módulo
  a lo largo de 12 fases, no se adoptó un proyecto ajeno.
- *Tamaño:* tres entidades, tres pantallas, seis reglas de negocio — el CRUD + 2-3 pantallas que
  pide la guía, sin agregar alcance que no sume nota.

## TP2 — Dockerfile del backend

Multi-stage con `node:22-alpine` en **las dos** etapas (a diferencia del ejemplo de la guía, que usa
una imagen de SDK pesada para build y una de runtime liviana para producción): en el ecosistema
Node no existe una imagen "SDK" separada como `mcr.microsoft.com/dotnet/sdk`, así que la diferencia
entre etapas la marcan las dependencias instaladas (`npm ci` completo vs. `npm ci --omit=dev`), no
la imagen base.

**Un hallazgo real que costó tiempo diagnosticar:** la primera versión de la etapa final hacía
`npx prisma generate` directamente ahí (para evitar copiar binarios entre etapas). Como el CLI
`prisma` es una devDependency correctamente excluida por `--omit=dev`, `npx` lo descargaba solo al
no encontrarlo — arrastrando el CLI completo (~200MB, incluyendo `typescript` y `effect`) a la
imagen de producción. La imagen resultante pesaba **610MB**.

Al corregirlo (generar el cliente **una sola vez** en la etapa de build y copiar el resultado, ya
que las dos etapas comparten la misma base y el motor generado es compatible) apareció un segundo
problema, más sutil: `@prisma/client` declara `prisma` como **peer dependency opcional**, y npm lo
auto-instala en la etapa final igual, así no se lo invoque directamente — ni `--omit=dev` ni
`--omit=peer` por separado lo excluyen; hace falta **`--omit=dev --omit=peer --omit=optional`**
juntos. Con eso, `node_modules/prisma`, `typescript`, `effect` y `fast-check` (~150MB en total)
desaparecen de la imagen final, y de paso se resuelve la vulnerabilidad de `npm audit` que se venía
arrastrando como riesgo aceptado desde la Fase 2 (era transitiva del propio CLI de Prisma).

**Comparación de tamaños** (con `node_modules` como diferencia principal, ya que la base es
idéntica en ambas etapas):

| Imagen | Tamaño |
|---|---|
| Etapa de build (con `prisma`, `typescript` y el resto de las devDependencies) | 631MB |
| Etapa final (solo dependencias de producción) | 298MB |

Verificado en contenedor: `GET /health` responde `200`, y un `POST /api/equipos` real contra el
Postgres del host (vía `host.docker.internal`, no `localhost`) persiste y se puede leer después.

## TP2 — Dockerfile del frontend + nginx

Multi-stage: `node:22-alpine` compila (`npm run build`, que corre `tsc -b && vite build`), y la
etapa final es `nginx:alpine` sirviendo solo `dist/` — sin Node adentro en producción, porque una
SPA ya compilada es HTML/CSS/JS estático, no necesita runtime de JavaScript del lado del servidor.

El `nginx.conf` sigue el patrón de la guía: el nombre del backend (`http://backend:3000`) va en una
variable (`set $backend_api ...`) resuelta en runtime con `resolver 127.0.0.11`, en vez de escrito
directo en `proxy_pass`. Se verificó el motivo concreto: en esta fase el contenedor del frontend se
corre **solo**, sin el backend — si el nombre estuviera escrito directo, nginx fallaría al arrancar
con `host not found in upstream`; con la variable, arranca igual y solo falla la request puntual
cuando llega (`502 Bad Gateway`, verificado con la pestaña de red del navegador).

**Se aprovechó para verificar un detalle adicional del frontend:** ante ese `502`, `apiFetch`
(Fase 9) no rompe — nginx devuelve una página de error HTML, no JSON, así que el `.json().catch(()
=> null)` de `apiFetch` cae al mensaje de respaldo `Error 502` en vez de tirar una excepción de
parseo sin manejar. El Dashboard mostró ese mensaje correctamente en vez de quedarse colgado o
crashear — el manejo de errores diseñado desde la Fase 9 resiste incluso una respuesta de error que
no es JSON, un caso que no se había probado explícitamente hasta ahora.

Checkpoint esperado de esta fase, tal como lo describe la guía: la interfaz se sirve
correctamente en `localhost` con nginx, aunque todavía no puede hablar con el backend — son dos
contenedores sueltos. Eso se resuelve recién en la Fase 16 (Compose), donde ambos comparten red.

## TP2 — Docker Compose

Cuatro servicios: `db` (Postgres, sin publicar puerto — nadie fuera de la red interna necesita
pegarle directo), `migrate`, `backend` (publica `3000` para poder pegarle con `curl`/Postman
directo, además de a través del frontend) y `frontend` (publica `8080`, la puerta de entrada real).

**El servicio `migrate`, y por qué existe.** El Postgres del compose nace con la base `campusgear`
vacía, sin tablas — hace falta aplicar la migración de Prisma antes de que el backend pueda
responder una sola consulta real. Pero en la Fase 14 se sacó deliberadamente el CLI de Prisma de la
imagen final del backend (pesa ~150MB de más). Meterlo de nuevo ahí solo para poder correr
`prisma migrate deploy` una vez por arranque hubiera deshecho esa optimización.

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

## TP2 — Registry y cierre

**Imágenes base elegidas:** `postgres:16-alpine` (la que pide el enunciado), `node:22-alpine` para
build y runtime del backend (misma base en las dos etapas, ver Fase 14), `nginx:alpine` para servir
el frontend — las tres son variantes Alpine, elegidas por tamaño sobre las variantes Debian
default de cada imagen, sin ninguna necesidad de librerías de sistema que Alpine no traiga.

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

Con esto se cierra el **TP2** completo: app elegida y contenerizada, Dockerfiles multi-stage para
back y front, Compose con persistencia demostrada, e imágenes públicas verificadas con un `pull` sin
credenciales.
