# Contexto de trabajo — Telegram Mini App (Invictory_AI)

> Documento de arranque para la tarea de la **Mini App de Telegram**.
> Hackathon Colsubsidio x 30X — Reto Hotelería. Owner: Felipe.

## 1. Qué es y a quién sirve

La Mini App es la interfaz del **operario de bodega**. Corre **dentro de Telegram**.
Flujo: el operario **dicta por voz** o **toma una foto** de un insumo → el backend
transcribe/extrae con IA, concilia contra el catálogo ERP y detecta anomalías →
la Mini App muestra el conteo capturado y, si aplica, una alerta de anomalía.

El **dashboard de administración** es otra pieza (`frontend/`, React) y no es parte de esta tarea.

## 2. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Punto de partida | **Desde cero** (la versión vanilla quedó en `reference-vanilla/` como referencia). |
| Stack | **React + Vite (JS/JSX)** para igualar a `frontend/`. SDK de Telegram vía script oficial `telegram-web-app.js` (`window.Telegram.WebApp`), envuelto en `useTelegram.js`. |
| Node | **v22.17.0 (LTS "Jod")**, fijado en `.nvmrc`. `nvm use` al entrar. |
| Gestor de paquetes | **npm** (consistencia con `frontend/`, que ya usa `package-lock.json`). |
| Compartir recursos | **Opción A: miniapp autónoma**, tokens duplicados en `src/tokens.css`. Si aparece drift, migramos a `shared/` (sin workspaces por ahora). |
| Fuente de datos | El **backend es la fuente**; se consumen los endpoints tal como están, sin modificarlos. |
| Demo | **Dentro de Telegram real** (bot + Mini App vía BotFather, servida por HTTPS). |
| Rama de trabajo | `feat/miniapp-telegram`. |

## 2.1. Cómo correr

```bash
cd miniapp
nvm use            # toma v22 del .nvmrc
npm install        # solo la primera vez
npm run dev        # http://localhost:5180
```

Requiere el backend en `http://localhost:8080` (ver `.env.example` → `VITE_API_BASE_URL`).

Estructura creada:

```
miniapp/
├── index.html            # carga telegram-web-app.js + fuentes
├── vite.config.js        # host:true + allowedHosts:true (para túnel)
├── .nvmrc                # 22
├── .env.example          # VITE_API_BASE_URL
├── src/
│   ├── main.jsx
│   ├── App.jsx           # tabs voz/foto, estado, resultado
│   ├── api.js            # captureAudio() / captureImage()
│   ├── useTelegram.js    # wrapper de window.Telegram.WebApp
│   ├── tokens.css        # tokens de marca (opción A)
│   ├── index.css         # estilos del shell
│   └── components/       # VoiceCapture, PhotoCapture, ResultView
└── reference-vanilla/    # versión HTML/JS previa (referencia)
```

## 3. Contrato con el backend (NO se modifica)

Base URL en dev: `http://localhost:8080` (FastAPI). Ver [../backend/app/routers/capture.py](../backend/app/routers/capture.py).

- `POST /api/v1/capture/audio` — `multipart/form-data`, campo `file` (audio mp3/webm/wav/ogg/m4a).
- `POST /api/v1/capture/image` — `multipart/form-data`, campo `file` (jpeg/png/webp).
- Límite de subida: **10 MB**.

Respuesta (`CaptureResponse`, ver [../backend/app/schemas.py](../backend/app/schemas.py)):

```jsonc
{
  "conteo": {
    "id": 123,
    "producto_nombre": "Cazuela 16oz",
    "cantidad_contada": 15.0,
    "bodega": "Almacén de suministros",
    "fuente": "audio",            // "audio" | "imagen"
    "confianza": 0.96,
    "observaciones": "…",
    "fecha_conteo": "2026-07-23T…"
  },
  "anomaly": {
    "is_anomaly": true,
    "severity": "CRITICA",        // CRITICA | ALTA | MEDIA | NINGUNA
    "message": "…",
    "expected_quantity": 40.0,
    "deviation_percent": 62.5,
    "requires_confirmation": true
  }
}
```

## 4. Integración con Telegram — checklist

- [ ] **BotFather**: crear bot → obtener `TELEGRAM_BOT_TOKEN`.
- [ ] **Registrar Mini App**: `/newapp` en BotFather (o Menu Button) apuntando a la URL HTTPS.
- [ ] **HTTPS en dev**: túnel con `cloudflared` o `ngrok` hacia el Vite dev server.
- [ ] **SDK oficial**: usar `initData`, `themeParams`, `expand`/viewport, `MainButton`,
      `BackButton`, `HapticFeedback`.
- [ ] Probar dentro del cliente de Telegram (móvil y/o Telegram Web).

## 5. Puntos de coordinación con el equipo (backend)

Estos NO los resuelve la Mini App sola — hay que hablarlos:

1. **CORS**: al servir por túnel, el origen será el dominio del túnel (ej. `https://xxxx.trycloudflare.com`).
   Hay que añadirlo a `BACKEND_CORS_ORIGINS` en [../backend/app/config.py](../backend/app/config.py) / `.env`.
2. **Auth `initData`**: hoy el backend **no valida** el `initData` de Telegram (el `TELEGRAM_BOT_TOKEN`
   está en `.env.example` pero no se usa). Definir con backend si:
   - se agrega validación del hash (identidad verificada del operario), o
   - para la demo se acepta identidad no verificada.
3. **Base URL de la API en producción/demo**: si el backend no está en `localhost` durante la demo,
   la Mini App necesita apuntar a su URL pública (variable de entorno de Vite).

## 6. Referencias en el repo

- Diseño / tokens: [../docs/DESIGN .md](../docs/DESIGN%20.md) y [../docs/colores.md](../docs/colores.md).
  Paleta: Action Blue `#00427b`/`#0059A3`, Accent Yellow `#FDD000`, Alert Red `#E30613`,
  fondo off-white `#F8F7F2`. Tipografía: **Manrope** (texto), **Geist** (datos/labels).
- Textos de UI del operario: [../resources/prompts/miniapp_prompts.json](../resources/prompts/miniapp_prompts.json).
- Referencia vanilla previa: [reference-vanilla/](reference-vanilla/).
- Dashboard React (referencia de stack): [../frontend/](../frontend/).

## 7. Preguntas abiertas

- ¿La demo corre con backend en `localhost` (mismo equipo del operario) o desplegado?
- ¿Se necesita identidad verificada del operario o basta con anónimo para la demo?
- ¿Se amplían pantallas (historial de conteos, confirmar anomalías) o solo captura?
</content>
</invoke>
