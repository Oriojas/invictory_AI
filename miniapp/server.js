// Servidor de producción de la Mini App (Railway, servicio "frontend", con dominio público).
// 1) Proxea /api -> backend PRIVADO por la red interna de Railway (BACKEND_INTERNAL_URL).
// 2) Sirve el build estático de Vite (dist/).
// 3) Fallback SPA a index.html para cualquier otra ruta.
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createProxyMiddleware } from "http-proxy-middleware";
import { validateInitData } from "./telegramAuth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");

const PORT = process.env.PORT || 4173;
const HOST = "::"; // dual-stack IPv6/IPv4 (compatible con Railway)
const BACKEND = process.env.BACKEND_INTERNAL_URL;

// Auth: solo peticiones con initData válido de Telegram pueden pasar a /api.
// Se fuerza cuando hay TELEGRAM_BOT_TOKEN (prod); sin token (dev local) NO se fuerza.
// Limpia espacios/comillas/saltos de línea pegados al copiar el token (causa común de "firma inválida").
function cleanToken(raw) {
  let t = (raw || "").trim();
  if (t.length >= 2 && ((t[0] === '"' && t.endsWith('"')) || (t[0] === "'" && t.endsWith("'")))) {
    t = t.slice(1, -1); // quita comillas envolventes
  }
  return t.trim(); // vuelve a limpiar por si había espacios dentro de las comillas
}
const BOT_TOKEN = cleanToken(process.env.TELEGRAM_BOT_TOKEN);
const INITDATA_MAX_AGE = Number(process.env.INITDATA_MAX_AGE_SECONDS || 86400);
const AUTH_ENFORCED = !!BOT_TOKEN;

if (!BACKEND) {
  console.warn(
    "[server] BACKEND_INTERNAL_URL no definido — las llamadas a /api fallarán. " +
      "En Railway: http://${{backend.RAILWAY_PRIVATE_DOMAIN}}:${{backend.PORT}}"
  );
}
if (!AUTH_ENFORCED) {
  console.warn(
    "[server] TELEGRAM_BOT_TOKEN no definido — auth de Telegram DESACTIVADA (ok en dev, NO en prod)."
  );
}

const app = express();

// Gate de autenticación: exige un initData de Telegram válido para tocar /api.
// Va ANTES del proxy. Sin bot token (dev) se omite; con token se fuerza (401 si falta/es inválido).
app.use((req, res, next) => {
  if (!req.path.startsWith("/api") || !AUTH_ENFORCED) return next();
  const initData = req.get("X-Telegram-Init-Data");
  const result = validateInitData(initData, BOT_TOKEN, INITDATA_MAX_AGE);
  if (!result.ok) {
    // Diagnóstico en logs de Railway (no expone nada sensible al cliente).
    console.warn(`[auth] 401 en ${req.path}: ${result.reason} · initData ${initData ? "presente" : "AUSENTE"}`);
    return res.status(401).json({ detail: `No autorizado: ${result.reason}` });
  }
  next();
});

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
