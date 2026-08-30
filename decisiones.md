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
