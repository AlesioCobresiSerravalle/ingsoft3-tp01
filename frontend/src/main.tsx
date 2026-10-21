import * as Sentry from "@sentry/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// El DSN de un front NO es un secreto: solo sirve para ENVIAR datos a Sentry, no para
// leerlos, y cualquier aplicación web lo expone porque viaja en el JavaScript que baja
// el navegador. Es la diferencia con una clave de API, que sí permite leer o modificar.
// Por eso va escrito acá (el del backend, en cambio, llega por variable de entorno).
Sentry.init({
  dsn: "https://9b7779cc2864767b4a4d9d3a868d15d1@o4512295155400704.ingest.us.sentry.io/4512295199113216",
  environment: window.location.hostname, // de qué sitio vino: QA, producción o localhost
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
