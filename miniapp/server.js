// Servidor de producción de la Mini App (Railway, servicio "frontend", con dominio público).
// 1) Proxea /api -> backend PRIVADO por la red interna de Railway (BACKEND_INTERNAL_URL).
// 2) Sirve el build estático de Vite (dist/).
// 3) Fallback SPA a index.html para cualquier otra ruta.
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");

const PORT = process.env.PORT || 4173;
const HOST = "::"; // dual-stack IPv6/IPv4 (compatible con Railway)
const BACKEND = process.env.BACKEND_INTERNAL_URL;

if (!BACKEND) {
  console.warn(
    "[server] BACKEND_INTERNAL_URL no definido — las llamadas a /api fallarán. " +
      "En Railway: http://${{backend.RAILWAY_PRIVATE_DOMAIN}}:${{backend.PORT}}"
  );
}

const app = express();

// Proxy PRIMERO y sin body-parser: reenvía el body tal cual (necesario para multipart audio/imagen).
// En http-proxy-middleware v3 se monta en la raíz con `pathFilter` para CONSERVAR el prefijo /api
// (montarlo con app.use("/api", ...) haría que Express lo quite y el backend daría 404).
app.use(
  createProxyMiddleware({
    pathFilter: "/api",
    target: BACKEND || "http://127.0.0.1:8080",
    changeOrigin: true,
    xfwd: true,
  })
);

// Estático del build.
app.use(express.static(DIST, { index: false }));

// Fallback SPA (cualquier ruta que no sea /api ni un asset existente).
app.get("*", (_req, res) => {
  res.sendFile(path.join(DIST, "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`[server] Mini App escuchando en http://${HOST}:${PORT} · proxy /api -> ${BACKEND || "(no definido)"}`);
});
