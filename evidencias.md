# Evidencias — TP1

## 1. Push directo a `main` rechazado

![push rechazado](img/01-push-rechazado.png)

Intento de `git push` con un commit hecho directo sobre `main`. GitHub lo rechaza con
`GH006: Protected branch update failed` porque la rama está protegida y la regla exige que todo
cambio entre por Pull Request — la protección alcanza también al dueño del repositorio.

## 2. El PR de la rama B no se puede mergear: conflicto

![aviso de conflicto](img/02-conflicto-aviso.png)

Las ramas `feature/titulo-a` y `feature/titulo-b` nacieron del mismo commit de `main` y modificaron
la misma línea del `README.md`. Tras mergear el PR de la rama A, GitHub avisa en el PR de la rama B
que "This branch has conflicts that must be resolved": no puede combinar automáticamente los dos
cambios porque tocan exactamente el mismo lugar del archivo.

## 3. Los marcadores del conflicto

![marcadores del conflicto](img/03-conflicto-marcadores.png)

Vista del editor de resolución de conflictos de GitHub sobre `README.md`. Se ven los tres
marcadores: `<<<<<<< feature/titulo-b` (mi rama, "current change"), `=======` (separador) y
`>>>>>>> main` (lo que ya está en `main`, "incoming change" — la versión A, mergeada primero).

## 4. La release publicada

![release publicada](img/04-release-publicada.png)

Release `v1.0.0`, marcada como *Latest*, publicada sobre el commit `2bb2bc5` con notas de qué
incluye esta versión.
