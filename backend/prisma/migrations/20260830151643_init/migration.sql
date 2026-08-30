-- CreateEnum
CREATE TYPE "EstadoPrestamo" AS ENUM ('ACTIVO', 'DEVUELTO');

-- CreateTable
CREATE TABLE "Equipo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prestamo" (
    "id" TEXT NOT NULL,
    "equipoId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "fechaPrestamo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaDevolucionPrevista" TIMESTAMP(3) NOT NULL,
    "fechaDevolucionReal" TIMESTAMP(3),
    "estado" "EstadoPrestamo" NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prestamo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipo_codigo_key" ON "Equipo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_email_key" ON "Persona"("email");

-- CreateIndex
CREATE INDEX "Prestamo_equipoId_idx" ON "Prestamo"("equipoId");

-- CreateIndex
CREATE INDEX "Prestamo_personaId_idx" ON "Prestamo"("personaId");

-- CreateIndex
CREATE INDEX "Prestamo_estado_idx" ON "Prestamo"("estado");

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
