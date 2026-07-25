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
  `startCommand = "python -m uvicorn backend.app.main:app --host :: --port $PORT"`
  (`python -m` evita el clásico `uvicorn: command not found`; `::` es obligatorio para
  la red privada IPv6 de Railway).
- Deps: se instalan desde `requirements.txt` (raíz) y Python se fija en `.python-version` (3.11).
  Si cambiaste el Start Command a mano en el dashboard de Railway, ponlo también con `python -m`.
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
  - `TELEGRAM_BOT_TOKEN = ...` → **activa la validación de initData** en el proxy: solo peticiones
    de una Mini App real de tu bot pasan a `/api` (resto → 401). Sin esta variable, el proxy
    **no** fuerza auth (útil en dev, inseguro en prod).
  - `INITDATA_MAX_AGE_SECONDS` (opcional, def. 86400) → antigüedad máxima del initData (anti-replay).

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
- **Auth (implementada en el proxy):** `server.js` valida la firma `initData` de Telegram con
  `TELEGRAM_BOT_TOKEN` antes de reenviar a `/api` (ver `miniapp/telegramAuth.js`). El frontend manda
  el header `X-Telegram-Init-Data` en cada petición. Así solo una Mini App real de tu bot puede usar
  la API; peticiones anónimas → 401. El backend sigue intacto y privado.
- **Límite honesto:** esto restringe a usuarios reales del bot; un operario podría reusar *su* initData
  dentro de su ventana de validez (mitigado por `auth_date`). Defense-in-depth = validar también en el
  backend, pero al ser privado, con el proxy basta.
