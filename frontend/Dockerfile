# ---- Etapa 1: build ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Etapa de tests (no forma parte de la imagen que se publica) ----
# Mismo criterio que en el backend: CMD y no RUN, para poder sacar el
# reporte de cobertura con un volumen aunque el umbral falle.
FROM build AS test
# Los reportes van a /reports (volumen) y sin `clean`: vitest no puede
# borrar un directorio que es punto de montaje (EBUSY).
CMD ["npx", "vitest", "run", "--coverage", "--coverage.reportsDirectory=/reports", "--coverage.clean=false"]

# ---- Etapa 2: nginx sirve los estáticos ----
FROM nginx:alpine
LABEL org.opencontainers.image.source="https://github.com/AlesioCobresiSerravalle/ingsoft3-tp01"
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
