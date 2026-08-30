# ---- Etapa 1: build (con el SDK completo de Node) ----
FROM node:22-alpine AS build
WORKDIR /app

# Capa cacheable: solo se rehace si cambian las dependencias, no el código.
COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Etapa 2: runtime (imagen mínima, sin herramientas de compilación) ----
FROM node:22-alpine AS final
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
# Los tres --omit son necesarios: @prisma/client declara `prisma` (el CLI
# completo, con sus propias dependencias pesadas: ~150MB entre prisma,
# typescript, effect y fast-check) como peer dependency OPCIONAL, y npm lo
# auto-instala salvo que se excluyan explícitamente tanto "peer" como
# "optional" (uno solo de los dos no alcanza).
RUN npm ci --omit=dev --omit=peer --omit=optional

# El cliente de Prisma se genera UNA sola vez, en la etapa de build, y se
# copia acá — nunca se corre `prisma generate` en esta etapa: como el CLI de
# Prisma es una devDependency (correctamente excluida por --omit=dev), volver
# a invocarlo aquí obligaría a `npx` a descargar el CLI completo (~200MB) a
# la imagen final, arruinando el propósito del build multi-etapa. Copiar el
# resultado es seguro porque las dos etapas parten de la misma base
# (node:22-alpine), así que el motor generado es compatible.
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist

EXPOSE 3000
ENTRYPOINT ["node", "dist/server.js"]
