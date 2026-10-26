import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../lib/prisma";
import { ConflictError } from "../errors/AppError";
import { crearPrestamo, registrarDevolucion } from "./prestamos.service";

// PRUEBA CONTRA UNA BASE REAL. La garantía "un equipo no tiene dos préstamos
// activos" la da PostgreSQL (índice único parcial), no el código: un mock de
// Prisma no puede demostrarla. Por eso esta suite sólo corre cuando hay una
// base descartable (RUN_DB_TESTS=1 y DATABASE_URL, con las migraciones
// aplicadas). Sin eso se saltea, y el pipeline la ejecuta contra un Postgres
// efímero (job build-backend).
const conBase = process.env.RUN_DB_TESTS === "1";
const sufijo = `${Date.now()}`;
const PEDIDOS_SIMULTANEOS = 8;
const RONDAS = 5;

describe.skipIf(!conBase)("crearPrestamo con pedidos simultáneos (base real)", () => {
  let personaId = "";
  const equiposCreados: string[] = [];

  async function equipoNuevo(n: string) {
    const e = await prisma.equipo.create({
      data: { nombre: `concurrencia ${n}`, categoria: "prueba", codigo: `CONC-${sufijo}-${n}` },
    });
    equiposCreados.push(e.id);
    return e.id;
  }
  const entrada = (equipoId: string) => ({
    equipoId,
    personaId,
    fechaDevolucionPrevista: new Date(Date.now() + 86_400_000),
  });

  beforeAll(async () => {
    const p = await prisma.persona.create({
      data: { nombre: "concurrencia", email: `conc-${sufijo}@example.com` },
    });
    personaId = p.id;
  });

  afterAll(async () => {
    // Base descartable: se limpia directo (la API no borra préstamos a propósito).
    await prisma.prestamo.deleteMany({ where: { equipoId: { in: equiposCreados } } });
    await prisma.equipo.deleteMany({ where: { id: { in: equiposCreados } } });
    await prisma.persona.deleteMany({ where: { id: personaId } });
    await prisma.$disconnect();
  });

  it.each(Array.from({ length: RONDAS }, (_, i) => i + 1))(
    `ronda %i: ${PEDIDOS_SIMULTANEOS} pedidos a la vez por el mismo equipo, exactamente uno lo consigue`,
    async (ronda) => {
      const equipoId = await equipoNuevo(`ronda-${ronda}`);

      const resultados = await Promise.allSettled(
        Array.from({ length: PEDIDOS_SIMULTANEOS }, () => crearPrestamo(entrada(equipoId))),
      );

      const ganadores = resultados.filter((r) => r.status === "fulfilled");
      const perdedores = resultados.filter((r) => r.status === "rejected");
      expect(ganadores).toHaveLength(1);
      // los que pierden reciben el 409 de negocio, no un error crudo de la base
      for (const p of perdedores) {
        expect((p as PromiseRejectedResult).reason).toBeInstanceOf(ConflictError);
      }
      // y la base quedó con UN solo préstamo activo para ese equipo
      const activos = await prisma.prestamo.count({
        where: { equipoId, fechaDevolucionReal: null },
      });
      expect(activos).toBe(1);
    },
  );

  it("una vez devuelto, el mismo equipo se puede volver a prestar", async () => {
    const equipoId = await equipoNuevo("reuso");

    const primero = await crearPrestamo(entrada(equipoId));
    await registrarDevolucion(primero.id);
    const segundo = await crearPrestamo(entrada(equipoId));

    expect(segundo.id).not.toBe(primero.id);
    expect(segundo.estado).toBe("ACTIVO");
  });
});
