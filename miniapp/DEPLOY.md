# Despliegue en Railway — API privada (proxy) + Postgres

Arquitectura: el **frontend** (público) sirve la Mini App y hace de **proxy** de `/api/*` hacia el
**backend privado** por la red interna de Railway. El backend **no tiene dominio público**, así que
solo es alcanzable a través del frontend. Todo queda mismo origen (sin CORS).

```
Navegador (Telegram) → https://<frontend>.up.railway.app   (público = URL de la Mini App)
        │  fetch('/api/...')  (mismo origen)
        ▼
   frontend (server.js: estático dist/ + proxy /api)
        │  red privada Railway (IPv6)
        ▼
   <backend>.railway.internal:$PORT   (FastAPI, SIN dominio público)
        │
        ▼
   Postgres (plugin Railway)
```

> **Config-as-code:** Railway **no** usa un YAML único multi-servicio (eso es docker-compose /
> `render.yaml`). La config es **por servicio** vía `railway.toml`, leído según el *Root Directory*:
> `railway.toml` (raíz) → backend; `miniapp/railway.toml` → frontend. La topología (servicios,
> Postgres, dominios, variables con `${{...}}`) se crea en el dashboard/CLI.

## Servicios (3, mismo repo)

### 1) Postgres
- Railway → **New → Database → PostgreSQL**. Expone `DATABASE_URL`.

### 2) backend (FastAPI) — PRIVADO
- **New service → GitHub repo** (este repo). **Root Directory:** raíz del repo (vacío).
- Build y arranque: en `railway.toml` de la raíz (config-as-code de ESTE servicio):
  `startCommand = "uvicorn backend.app.main:app --host :: --port $PORT"`
  (el `::` es obligatorio para la red privada IPv6 de Railway).
- **Settings → Networking:** NO generar dominio público (si Railway creó uno, elimínalo).
  Deja solo el **Private Networking** (queda `<backend>.railway.internal`).
- **Variables:**
  - `DATABASE_URL = ${{Postgres.DATABASE_URL}}`
  - `OPENAI_API_KEY = ...`
  - `DEEPSEEK_API_KEY = ...`
  - `DEEPSEEK_BASE_URL = https://api.deepseek.com` (opcional)
  - Si el arranque falla por el esquema `postgres://` (SQLAlchemy 2 exige `postgresql://`),
    define `DATABASE_URL` con `postgresql://...` (mismo valor cambiando el esquema).

### 3) frontend (Mini App) — PÚBLICO
- **New service → mismo repo**. **Root Directory:** `miniapp`.
- Config en `miniapp/railway.toml`. Nixpacks detecta Node: instala, `npm run build`, y `npm start` (server.js).
- **Settings → Networking:** genera **dominio público** (esta URL va a BotFather).
- **Variables:**
  - `BACKEND_INTERNAL_URL = http://${{backend.RAILWAY_PRIVATE_DOMAIN}}:${{backend.PORT}}`
    (ajusta `backend` al nombre real del servicio backend)
  - `VITE_API_BASE_URL` = *(vacío / no definir)* → la Mini App usa mismo origen.

## Telegram / BotFather
1. `@BotFather` → crea el bot → guarda `TELEGRAM_BOT_TOKEN`.
2. `/newapp` (o Menu Button) → registra la **URL pública del frontend** como Mini App.
3. Abre la Mini App desde el bot.

## Verificación
- `https://<frontend>...` carga la app y `Ajustes` muestra el backend "En línea".
- Inicio/Alertas traen datos reales desde Postgres; la captura funciona.
- El dominio interno del backend **no responde desde internet** (solo vía el proxy del frontend).

## Notas
- Multipart (audio/imagen): el proxy hace streaming del body (sin body-parser sobre `/api`).
- Secretos solo como variables de Railway; `.env` sigue en `.gitignore`.
- **Follow-up de seguridad:** la "red privada" evita hits directos al backend, pero el proxy es
  público. Para restringir a **usuarios reales del bot**, validar la firma `initData` de Telegram
  en el backend (requiere código en el backend).
