-- Regla 2 (un equipo prestado no se vuelve a prestar), garantizada por la BASE.
-- El service comprueba "¿ya hay un préstamo activo?" antes de insertar, pero dos
-- pedidos simultáneos pueden leer "libre" antes de que alguno confirme (Read
-- Committed). Este índice único PARCIAL lo impide: como mucho una fila por equipo
-- con fechaDevolucionReal NULL (la misma definición de "activo" que usa el código).
-- Los préstamos devueltos no entran en el índice, así que el equipo se puede
-- volver a prestar. Prisma no puede expresar índices parciales en schema.prisma:
-- vive sólo acá (`migrate deploy` lo aplica; ver el comentario del schema).
CREATE UNIQUE INDEX "Prestamo_equipoId_activo_key"
  ON "Prestamo" ("equipoId")
  WHERE "fechaDevolucionReal" IS NULL;
