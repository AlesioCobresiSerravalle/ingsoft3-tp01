import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

// El proxy hace que, en desarrollo, "/api/..." se resuelva contra el backend
// que corre en :3000 — el mismo prefijo relativo que en producción traduce
// nginx (TP2). El código de React nunca conoce esta URL.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node", // sin DOM: la lógica probada es pura
    exclude: [...configDefaults.exclude, "e2e/**"], // los specs de Playwright (TP7) no son de vitest
    coverage: {
      provider: "v8",
      // `include` explícito: cuenta también los archivos que ningún test importa.
      include: ["src/**/*.{ts,tsx}"],
      // Exclusiones: arranque, tipos y UI de React. La UI no se prueba acá
      // porque estos tests corren sin DOM; la cubren los e2e de Playwright
      // (TP7). `api/` y `lib/` (donde vive la lógica) SÍ cuentan.
      exclude: [
        "src/**/*.test.ts",
        "src/main.tsx", // arranque: createRoot
        "src/App.tsx", // tabla de rutas
        "src/types/**", // solo tipos, sin código en runtime
        "src/components/**", // presentación (e2e TP7)
        "src/pages/**", // composición de componentes (e2e TP7)
      ],
      reporter: ["text", "text-summary", "json-summary", "lcov"],
      reportsDirectory: "coverage",
      reportOnFailure: true, // el reporte se genera aunque falle un test o el umbral
      // Umbral anclado en la medición real (líneas 74+, ramas 88+ de piso):
      // si baja, el proceso sale con código != 0 y rompe el build.
      thresholds: { lines: 74, branches: 88 },
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
