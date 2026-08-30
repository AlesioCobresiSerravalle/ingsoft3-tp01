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
