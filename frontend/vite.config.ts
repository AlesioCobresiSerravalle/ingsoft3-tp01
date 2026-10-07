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
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
