# CampusGear

Aplicación web para administrar el préstamo de equipamiento de un laboratorio o institución
educativa: qué equipos existen, cuáles están disponibles o prestados, quién tiene cada uno, cuándo
vence la devolución y cuáles están vencidos.

Stack: React + Vite + TypeScript (frontend), Node + Express + TypeScript (backend), Prisma +
PostgreSQL 16 (persistencia), Docker Compose (orquestación).

## Requisitos

- [Docker](https://docs.docker.com/get-docker/) con Docker Compose (`docker compose version`)

No hace falta instalar Node, PostgreSQL ni nada más en la máquina para levantar el sistema completo.

## Arranque desde cero

**1. Copiar la plantilla de variables de entorno** (el `.env` real no se versiona):

```bash
cp .env.example .env
```

Editalo si querés otra contraseña para la base — el valor por defecto sirve para desarrollo local.

**2. Levantar el sistema completo, construyendo las imágenes localmente:**

```bash
docker compose up -d --build
```

Esto levanta, en orden: `db` (PostgreSQL, espera a estar sana) → `migrate` (aplica las migraciones
de Prisma y termina) → `backend` y `frontend`.

**3. Verificar que todo esté arriba:**

```bash
docker compose ps
```

Los cuatro servicios deberían figurar `Up` (o `Exited (0)` para `migrate`, que corre una sola vez).

**4. Abrir la aplicación:**

- Frontend (la app): [http://localhost:8080](http://localhost:8080)
- Backend directo (para `curl`/Postman): [http://localhost:3000/health](http://localhost:3000/health)

## Arranque usando las imágenes publicadas (sin construir back/front)

Igual que arriba, pero con `docker-compose.registry.yml`, que descarga `backend` y `frontend` desde
`ghcr.io` en vez de construirlos (el servicio `migrate` sigue construyendo desde el código, ver
`decisiones.md`):

```bash
cp .env.example .env
docker compose -f docker-compose.registry.yml up -d --build
```

## Comandos útiles

```bash
docker compose down        # apaga los contenedores, conserva los datos (el volumen sigue)
docker compose down -v     # apaga y BORRA los datos (elimina también el volumen)
docker compose logs -f     # sigue los logs de todos los servicios
```

## Más contexto

- [`decisiones.md`](decisiones.md): decisiones de diseño y arquitectura, TP por TP.
- [`evidencias.md`](evidencias.md): capturas y evidencias pedidas por cada TP.
