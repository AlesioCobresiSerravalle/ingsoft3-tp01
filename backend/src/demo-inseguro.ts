// DEMO DIDÁCTICA DEL TP9: este archivo contiene vulnerabilidades A PROPÓSITO para ver
// a CodeQL detectarlas en un pull request. NUNCA se mergea: la rama y el PR se cierran.
import { exec } from "node:child_process";
import { Router } from "express";

export const demoInseguro = Router();

// 1) XSS reflejado: el parámetro `nombre` del usuario se devuelve como HTML sin escapar.
demoInseguro.get("/saludo", (req, res) => {
  res.send("<h1>Hola " + req.query.nombre + "</h1>");
});

// 2) Inyección de comandos: el parámetro `host` del usuario se concatena en un comando del sistema.
demoInseguro.get("/ping", (req, res) => {
  exec("ping -c 1 " + req.query.host, (_error, salida) => {
    res.type("text/plain").send(salida);
  });
});
