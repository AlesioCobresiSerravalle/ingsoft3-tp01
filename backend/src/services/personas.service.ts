import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ConflictError, NotFoundError } from "../errors/AppError";
import type { ActualizarPersonaInput, CrearPersonaInput } from "../schemas/persona.schema";

export async function listarPersonas(busqueda?: string) {
  return prisma.persona.findMany({
    where: busqueda
      ? {
          OR: [
            { nombre: { contains: busqueda, mode: "insensitive" } },
            { email: { contains: busqueda, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { nombre: "asc" },
  });
}

export async function obtenerPersonaPorId(id: string) {
  const persona = await prisma.persona.findUnique({ where: { id } });

  if (!persona) {
    throw new NotFoundError("Persona no encontrada");
  }

  return persona;
}

export async function crearPersona(data: CrearPersonaInput) {
  try {
    return await prisma.persona.create({ data });
  } catch (err) {
    throw traducirErrorDeEmailDuplicado(err);
  }
}

export async function actualizarPersona(id: string, data: ActualizarPersonaInput) {
  await obtenerPersonaPorId(id); // 404 si no existe

  try {
    await prisma.persona.update({ where: { id }, data });
  } catch (err) {
    throw traducirErrorDeEmailDuplicado(err);
  }

  return obtenerPersonaPorId(id);
}

export async function eliminarPersona(id: string) {
  await obtenerPersonaPorId(id); // 404 si no existe

  try {
    await prisma.persona.delete({ where: { id } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      throw new ConflictError(
        "No se puede eliminar una persona con préstamos asociados (activos o históricos)",
      );
    }
    throw err;
  }
}

function traducirErrorDeEmailDuplicado(err: unknown) {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    return new ConflictError("Ya existe una persona con ese email");
  }
  return err;
}
