import { PrismaClient } from "@prisma/client";

// Única instancia de PrismaClient en todo el backend. Los services importan
// `prisma` desde acá — ningún controller ni route debe importar
// PrismaClient directamente (ver decisiones.md).
export const prisma = new PrismaClient();
