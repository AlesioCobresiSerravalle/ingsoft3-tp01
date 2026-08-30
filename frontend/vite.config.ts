import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// El proxy hace que, en desarrollo, "/api/..." se resuelva contra el backend
// que corre en :3000 — el mismo prefijo relativo que en producción traduce
// nginx (TP2). El código de React nunca conoce esta URL.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
