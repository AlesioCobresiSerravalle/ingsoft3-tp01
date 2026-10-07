import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    exclude: [...configDefaults.exclude],
    coverage: {
      provider: "v8",
      // `include` explícito: cuenta también los archivos que ningún test
      // importa (si no, un archivo nuevo sin tests "no existe" para el reporte).
      include: ["src/**/*.ts"],
      // Exclusiones: SOLO código de arranque/cableado sin decisiones propias.
      // Controllers, services, domain, schemas y middlewares SÍ cuentan.
      exclude: [
        "src/**/*.test.ts",
        "src/server.ts", // arranque: app.listen
        "src/app.ts", // cableado de middlewares y rutas
        "src/config/env.ts", // lectura de process.env
        "src/lib/prisma.ts", // instancia del cliente
        "src/routes/**", // tabla ruta -> controller, sin lógica
      ],
      reporter: ["text", "text-summary", "json-summary", "lcov"],
      reportsDirectory: "coverage",
      reportOnFailure: true, // el reporte se genera aunque falle un test o el umbral
      // Umbral anclado en la medición real (líneas 38+, ramas 50+ de piso):
      // si baja, el proceso sale con código != 0 y rompe el build.
      thresholds: { lines: 38, branches: 50 },
    },
  },
});
