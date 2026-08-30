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
