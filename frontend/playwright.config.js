import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e", // recoge los DOS archivos; cada job del pipeline corre el suyo por nombre
  timeout: 60_000, // tope de CADA test: generoso para QA con arranque en frío
  expect: { timeout: 15_000 }, // tope de CADA aserción (el default es 5 s)
  use: {
    // El FRONT. La api tiene su propia dirección (API_BASE_URL, la lee api.spec.js).
    baseURL: process.env.E2E_BASE_URL || "http://localhost:8080",
    actionTimeout: 15_000, // un clic o un fill que no encuentra su elemento falla en 15 s, no en 60
    trace: "on-first-retry", // la traza se graba en el reintento de un fallo
    screenshot: "only-on-failure",
  },
  retries: 1, // absorbe una demora suelta; si un test pasa recién ahí, sale «flaky»
  reporter: [["html", { open: "never" }], ["list"]],
});
