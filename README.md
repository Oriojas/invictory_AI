# Invictory_AI - Reto de Hotelería (Hackathon Colsubsidio x 30X)

**Invictory_AI** es una solución MVP construida para eliminar la captura manual de inventarios en almacenes y bodegas de hotelería mediante agentes de inteligencia artificial multimodal (Voz con OpenAI Whisper y OCR de alta resolución con DeepSeek Vision).

---

## ⚡ Características Principales

1. **Captura por Voz (Speech-to-Text):** Operarios dictan conteos físicos mediante la **Telegram Mini App**, procesados por `whisper-1` de OpenAI y estructurados por DeepSeek LLM.
2. **Captura por Imagen (OCR detail=high):** Lectura e identificación de empaques y etiquetas de insumos procesada por DeepSeek Vision (`deepseek-chat` con `detail: high`).
3. **Reporte de Descuadres en Tiempo Real:** Dashboard interactivo que calcula y resalta las discrepancias (faltantes y sobrantes) entre el stock del sistema ERP (`BodegaStock`) y lo reportado por la IA (`ConteoFisico`).
4. **Dataset Real Semilla (12 Productos):** Basado en el archivo oficial `docs/BODEGAS Y STOCK.xlsx`.
5. **Frontend React con Design System Neo-Brutalista (StitchMCP):** Paleta de colores oficial (`#FFCC00` fondo amarillo, `#000000` negro sólido, `#1A1A1A` gris oscuro y `#FFFFFF` contraste) con selector de 3 variantes visuales (Ejecutivo Bento, Operativo Tabla Central e Híbrido Split View).

---

## 📁 Estructura del Proyecto

```text
invictory_AI/
├── .env.example               # Variables de entorno sanitizadas (sin llaves reales)
├── pyproject.toml             # Gestión de paquetes Python con uv
├── README.md                  # Documentación del proyecto
├── docs/                      # Guías técnicas del reto y datos oficiales
│   ├── colores.md
│   ├── ocr.md
│   ├── BODEGAS Y STOCK.xlsx
│   └── Cómo usar los recursos del reto Hotelería.docx
├── backend/                   # Servidor FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── main.py            # Entrypoint FastAPI
│   │   ├── config.py          # Configuración Pydantic Settings
│   │   ├── database.py        # Engine y sesión SQLAlchemy (PostgreSQL / SQLite fallback)
│   │   ├── models.py          # Modelos BodegaStock y ConteoFisico
│   │   ├── schemas.py         # Validadores Pydantic
│   │   ├── services/          # Servicios STT (Whisper) y OCR (DeepSeek)
│   │   └── routers/           # Routers /capture, /inventory y /dashboard
├── miniapp/                   # Telegram Mini App (HTML5 + CSS + JS)
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── frontend/                  # Aplicación React + Vite
    ├── package.json
    ├── vite.config.js
    └── src/                   # Componentes, Páginas y Tokens de Estilo Neo-Brutalistas
```

---

## 🚀 Guía de Ejecución

### 1. Configuración de Variables de Entorno
Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

### 2. Backend (FastAPI + `uv`)
Asegúrate de tener `uv` instalado. Luego ejecuta:

```bash
# Sincronizar e instalar dependencias Python
uv sync

# Iniciar servidor FastAPI
uv run uvicorn backend.app.main:app --reload --port 8000
```
El servidor estará disponible en `http://localhost:8000` y la documentación interactiva en `http://localhost:8000/docs`.

### 3. Frontend (React + Vite)
En una nueva terminal, navega a `frontend/` y ejecuta:

```bash
cd frontend
npm install
npm run dev
```
La aplicación web React estará disponible en `http://localhost:5173`.

### 4. Telegram Mini App
Abre `miniapp/index.html` en tu navegador o sírvela a través de un servidor local.

---

## 📊 Endpoints Clave

- `GET /api/v1/dashboard/discrepancies`: Obtiene el reporte en vivo de descuadres y porcentaje de precisión.
- `POST /api/v1/capture/audio`: Procesa dictado de voz mediante OpenAI Whisper STT.
- `POST /api/v1/capture/image`: Procesa fotografía de producto mediante DeepSeek Vision OCR (`detail: high`).
- `POST /api/v1/inventory/seed`: Restablece el inventario semilla de 12 productos de prueba.

---

## 🏆 Créditos
Desarrollado para el **Reto de Hotelería** de la **Hackathon Colsubsidio x 30X**.
