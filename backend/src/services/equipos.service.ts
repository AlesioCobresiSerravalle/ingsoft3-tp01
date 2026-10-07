import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { conEstadoDerivado } from "../domain/equipo";
import { ConflictError, NotFoundError } from "../errors/AppError";
import type { ActualizarEquipoInput, CrearEquipoInput } from "../schemas/equipo.schema";

const includePrestamosActivos = {
  prestamos: { where: { fechaDevolucionReal: null } },
} satisfies Prisma.EquipoInclude;

export async function listarEquipos(busqueda?: string) {
  const equipos = await prisma.equipo.findMany({
    where: busqueda
      ? {
          OR: [
            { nombre: { contains: busqueda, mode: "insensitive" } },
            { codigo: { contains: busqueda, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: includePrestamosActivos,
    orderBy: { nombre: "asc" },
  });

  return equipos.map(conEstadoDerivado);
}

export async function obtenerEquipoPorId(id: string) {
  const equipo = await prisma.equipo.findUnique({
    where: { id },
    include: includePrestamosActivos,
  });

  if (!equipo) {
    throw new NotFoundError("Equipo no encontrado");
  }

  return conEstadoDerivado(equipo);
}

export async function crearEquipo(data: CrearEquipoInput) {
  try {
    const equipo = await prisma.equipo.create({ data });
    return conEstadoDerivado({ ...equipo, prestamos: [] });
  } catch (err) {
    throw traducirErrorDeCodigoDuplicado(err);
  }
}

export async function actualizarEquipo(id: string, data: ActualizarEquipoInput) {
  await obtenerEquipoPorId(id); // 404 si no existe

  try {
    await prisma.equipo.update({ where: { id }, data });
  } catch (err) {
    throw traducirErrorDeCodigoDuplicado(err);
  }

  return obtenerEquipoPorId(id);
}

export async function eliminarEquipo(id: string) {
  await obtenerEquipoPorId(id); // 404 si no existe

  try {
    await prisma.equipo.delete({ where: { id } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      throw new ConflictError(
        "No se puede eliminar un equipo con préstamos asociados (activos o históricos)",
      );
    }
    throw err;
  }
}

function traducirErrorDeCodigoDuplicado(err: unknown) {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    return new ConflictError("Ya existe un equipo con ese código");
  }
  return err;
}
