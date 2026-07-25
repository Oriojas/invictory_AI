# Cola offline de capturas

En bodegas subterráneas el celular pierde señal. La Mini App **captura audio/foto sin conexión**,
los guarda en una **cola local persistente** y los **sincroniza** cuando vuelve la red.

Punto clave: la IA (Whisper/OCR/DeepSeek) vive en el **backend**. Offline solo se puede *capturar*
el medio crudo (mic y cámara no necesitan red); el *procesamiento* se difiere hasta reconectar.

## Cómo funciona

- **Almacenamiento:** IndexedDB (`src/offline/queueDB.js`) — guarda los Blobs de audio/imagen y
  persiste aunque se cierre la app. Cada ítem:
  `{ id, tipo:'audio'|'imagen', blob, filename, createdAt, estado:'pendiente'|'enviando'|'error', intentos, lastError }`.
- **Estado compartido:** `src/offline/QueueProvider.jsx` (React Context) expone
  `online`, `items`, `pendingCount`, `enqueue`, `sync`, `syncedTick`.
- **Decisión de captura** (`src/screens/CaptureScreen.jsx`):
  - **online** → envía ya (flujo Conciliación → Éxito).
  - **offline** o el POST falla por red (`isNetworkError` en `src/api.js`) → **encola** y muestra
    "Guardado en cola".
- **Sincronización:**
  - **Automática** al volver la red (evento `window 'online'`) y al reabrir la app (si hay pendientes).
  - **Manual** con el botón **"Sincronizar"** en la pantalla *Pendientes* (`src/screens/PendingScreen.jsx`)
    o la card del Inicio.
  - `sync()` procesa FIFO con `captureAudio`/`captureImage`; al éxito elimina el ítem y sube
    `syncedTick` (refresca Inicio/Alertas). Si se cae la red a mitad, deja el ítem `pendiente` y para.
- **UX:** banner de estado (`src/components/OfflineBanner.jsx`), card en Inicio y contador.

## Límite conocido (honesto)

"Sincronizar apenas vuelva la señal" aplica con la app **abierta o al reabrirla**. Procesar con la app
**totalmente cerrada** exigiría Service Worker + Background Sync API, **no confiable** en el webview de
Telegram (iOS/WKWebView casi no lo soporta y Telegram no garantiza persistir el SW). Por eso queda
fuera de alcance a propósito.

IndexedDB puede purgarse bajo presión de almacenamiento; se pide `navigator.storage.persist()`
(no garantizado en todos los webviews).

## Pendiente para más adelante: idempotencia (evitar duplicados)

Hoy se acepta un riesgo mínimo: si un envío se guarda en el servidor pero el cliente no recibe la
respuesta y reintenta, se podría crear un `ConteoFisico` duplicado.

**Cambio propuesto (toca backend):**
1. Cliente: enviar un `client_uuid` estable por captura (el `id` del ítem de cola) como campo del
   `multipart` o header `X-Idempotency-Key`.
2. Backend (`backend/app/routers/capture.py` + `models.py`): añadir columna `client_uuid`
   **única** en `ConteoFisico`; antes de insertar, si ya existe ese `client_uuid`, devolver el
   conteo existente en vez de crear uno nuevo (upsert idempotente). Migración Alembic para la columna.

Con esto, reintentar un envío ya procesado es seguro (no duplica).
