// Sentry se inicializa ANTES de cargar Express (por eso server.ts importa este
// archivo primero): la librería necesita enganchar el framework al arrancar.
//
// El DSN llega por variable de entorno y NO está escrito acá. Si no está definido
// (en tu máquina, en los tests, en QA) la librería queda apagada y la app anda igual.
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT ?? "local",
  tracesSampleRate: 1.0, // medir todos los pedidos: alcanza para una app de cursada
});
