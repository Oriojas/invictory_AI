# Imagen determinista para el servicio miniapp en Railway.
# Evita los "npm/node: command not found" de Nixpacks garantizando Node en runtime.
# Build context = carpeta miniapp/ (Root Directory del servicio).

# --- Etapa build: instala TODO (incl. devDeps) y compila con Vite ---
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Etapa runtime: solo deps de producción + el build ---
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY server.js ./
# Railway inyecta PORT; server.js escucha en process.env.PORT.
CMD ["node", "server.js"]
