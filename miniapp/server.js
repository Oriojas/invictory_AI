// Servidor de producción de la Mini App (Railway, servicio "frontend", con dominio público).
// 1) Proxea /api -> backend PRIVADO por la red interna de Railway (BACKEND_INTERNAL_URL).
// 2) Sirve el build estático de Vite (dist/).
// 3) Fallback SPA a index.html para cualquier otra ruta.
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createProxyMiddleware } from "http-proxy-middleware";
import { validate } from "@telegram-apps/init-data-node";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");

const PORT = process.env.PORT || 4173;
const HOST = "::"; // dual-stack IPv6/IPv4 (compatible con Railway)

// Normaliza el target del proxy. Railway suele dar el dominio privado SIN esquema
// (ej. "backend.railway.internal:8080"); sin "http://" http-proxy revienta en requires-port.
function normalizeBackend(raw) {
  const u = (raw || "").trim();
  if (!u) return "http://127.0.0.1:8080"; // dev local
  return /^https?:\/\//i.test(u) ? u : `http://${u}`;
}
const BACKEND = normalizeBackend(process.env.BACKEND_INTERNAL_URL);

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

if (!process.env.BACKEND_INTERNAL_URL) {
  console.warn(
    "[server] BACKEND_INTERNAL_URL no definido — usando fallback local. " +
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
  try {
    // Librería oficial de Telegram: maneja el formato actual (incl. campo `signature`).
    validate(initData || "", BOT_TOKEN, { expiresIn: INITDATA_MAX_AGE });
    return next();
  } catch (e) {
    // Diagnóstico en logs de Railway (no expone nada sensible al cliente).
    console.warn(`[auth] 401 en ${req.path}: ${e.message} · initData ${initData ? "presente" : "AUSENTE"}`);
    return res.status(401).json({ detail: `No autorizado: ${e.message}` });
  }
});

// Proxy PRIMERO y sin body-parser: reenvía el body tal cual (necesario para multipart audio/imagen).
// En http-proxy-middleware v3 se monta en la raíz con `pathFilter` para CONSERVAR el prefijo /api
// (montarlo con app.use("/api", ...) haría que Express lo quite y el backend daría 404).
app.use(
  createProxyMiddleware({
    pathFilter: "/api",
    target: BACKEND,
    changeOrigin: true,
    xfwd: true,
    on: {
      error: (err, _req, res) => {
        console.error(`[proxy] error hacia ${BACKEND}: ${err.message}`);
        if (res && !res.headersSent && typeof res.writeHead === "function") {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ detail: "Backend no disponible" }));
        }
      },
    },
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
