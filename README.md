# Invictory_AI - Reto de Hotelería (Hackathon Colsubsidio x 30X)

**Invictory_AI** es una solución MVP de nivel empresarial diseñada para eliminar la captura manual de inventarios en almacenes y bodegas de hotelería mediante agentes de inteligencia artificial multimodal (**OpenAI Whisper** para voz, **OpenAI Vision `detail: high`** para OCR, **Detección de Anomalías Pre-Guardado en Tiempo Real** y **DeepSeek LLM `deepseek-chat`** con *Function Calling* sobre PostgreSQL y conciliación semántica).

---

## 🔗 Enlaces de Interés

- **Landing Page**: 
- **Video Pitch**: 
- **Pitch Deck (Presentación)**: [Ver Presentación en Google Slides](https://docs.google.com/presentation/d/15nrBpftSDrdij5Z69bnZO74sCXQiHb3K/edit?usp=sharing&ouid=108128111373168036932&rtpof=true&sd=true)
- **Telegram Mini App (Bot)**: [Abrir col_inventory_bot en Telegram](https://t.me/col_inventory_bot)

---

## 📁 Gestión Centralizada de Prompts por Actor (`resources/prompts/`)

Para garantizar mantenibilidad, evolución continua y separar la lógica del software de las instrucciones de Inteligencia Artificial, **todos los prompts del proyecto están centralizados en archivos JSON** dentro de la carpeta `resources/prompts/`.

### 🎯 Arquitectura de Carga de Prompts

El módulo `backend/app/services/prompt_loader.py` lee dinámicamente cada archivo JSON en tiempo de ejecución. Esto permite que desarrolladores, prompt engineers y administradores editen las instrucciones de cualquier actor del sistema sin necesidad de modificar el código fuente Python ni recompilar la aplicación.

```text
resources/prompts/
├── catalog_context.json   # Actor: Catálogo ERP oficial & Reglas de Conciliación Semántica
├── stt_prompts.json       # Actor: Operario / Agente Speech-to-Text (Whisper + DeepSeek)
├── ocr_prompts.json       # Actor: Agente Vision OCR (OpenAI Vision gpt-4o-mini detail: high)
├── agent_prompts.json     # Actor: Agente Inteligente de Inventarios (DeepSeek LLM + DB Tools)
└── miniapp_prompts.json   # Actor: UI Operario Telegram MiniApp
```

### 📋 Detalle de Archivos de Prompts

1. **`catalog_context.json` (Contexto del Catálogo ERP):**
   ```json
   {
     "actor": "Contexto del Catálogo ERP de Colsubsidio (Inyección en Prompts de IA)",
     "catalogo_erp": [
       {"sku": "97503113", "articulo": "Caldero Recort Tapa 50x60 cm", "unidad": "Unidad", "bodega": "Stock Almacén Suministros"},
       {"sku": "95026919", "articulo": "Cazuela 16 Onz", "unidad": "Unidad", "bodega": "Stock Almacén Suministros"}
     ],
     "instrucciones_matching": "Mapea siempre el producto mencionado al artículo más cercano semánticamente..."
   }
   ```
2. **`stt_prompts.json` (Speech-to-Text con Conciliación Semántica y Fracciones):**
   ```json
   {
     "actor": "Operario de Bodega / Agente STT (Speech-to-Text)",
     "structured_extraction": {
       "system_role": "Eres un agente experto en inventarios de hotelería para Colsubsidio.",
       "prompt_template": "Extrae los datos dictados por voz, mapea contra el catálogo ERP {catalog} y convierte fracciones (medio kilo = 0.5)..."
     }
   }
   ```
3. **`ocr_prompts.json` (Vision OCR detail=high):**
   ```json
   {
     "actor": "Agente OCR Multimodal (Vision)",
     "vision_ocr": {
       "system_role": "Actúa como un OCR de máxima precisión para inventarios de hotelería.",
       "prompt_template": "Examina la imagen, mapea contra el catálogo ERP {catalog} y estima fracciones visibles en productos abiertos..."
     }
   }
   ```
4. **`agent_prompts.json` (Agente DeepSeek LLM sobre PostgreSQL):**
   ```json
   {
     "actor": "Agente Inteligente de Inventarios (DeepSeek LLM)",
     "system_instruction": "Eres el Agente Inteligente de Inventarios de Invictory_AI para la Hackathon Colsubsidio x 30X...",
     "tools": {
       "get_discrepancies_summary": "Obtiene el reporte consolidado de descuadres...",
       "search_product_stock": "Busca un producto o insumo específico en la base de datos...",
       "get_physical_counts_history": "Consulta el historial de capturas físicas de inventario..."
     }
   }
   ```
5. **`miniapp_prompts.json` (UI Telegram MiniApp):**
   ```json
   {
     "actor": "Operario Telegram MiniApp UI",
     "dictado_voz": { "guia_usuario": "Presiona grabar y dicta el conteo..." },
     "captura_foto": { "guia_usuario": "Toma una foto clara a la etiqueta, caja o estantería..." }
   }
   ```

---

## 📐 Diagrama de Arquitectura del Sistema (Mermaid)

El siguiente diagrama ilustra el flujo completo de información desde la captura por el operario, la inyección del catálogo ERP para **conciliación semántica**, la **detección de anomalías pre-guardado** en tiempo real, hasta la persistencia en PostgreSQL y la analítica en el Dashboard:

```mermaid
graph TD
    %% Clientes e Interfaces
    subgraph Clientes ["📱 Interfaces de Usuario"]
        A["Operario de Bodega<br/>(Telegram Mini App)"]
        B["Auditor / Director Hotelero<br/>(Dashboard React + Vite)"]
    end

    %% Módulo de Captura Multimodal
    subgraph Captura ["⚡ Captura Multimodal"]
        C["Dictado por Voz<br/>(MediaRecorder API)"]
        D["Foto de Estantería / Empaque<br/>(Cámara del Dispositivo)"]
    end

    %% Recursos Centralizados de Prompts y Catálogo ERP
    subgraph PromptsResource ["📁 Recursos Centralizados (.json)"]
        PR0["resources/prompts/catalog_context.json<br/>(12 SKUs Catálogo ERP)"]
        PR1["resources/prompts/stt_prompts.json"]
        PR2["resources/prompts/ocr_prompts.json"]
        PR3["resources/prompts/agent_prompts.json"]
    end

    %% Backend FastAPI Service Layer
    subgraph Backend ["🚀 Backend Server (FastAPI + Python)"]
        E["/api/v1/capture/audio<br/>(Router Captura Voz)"]
        F["/api/v1/capture/image<br/>(Router Captura Foto)"]
        G["/api/v1/dashboard/discrepancies<br/>(Router Analítica & Descuadres)"]
        H["/api/v1/agent/chat<br/>(Router Agente DeepSeek LLM)"]

        subgraph IAServices ["🤖 IA Multimodal & Conciliación Semántica"]
            I["OpenAI Whisper API<br/>(whisper-1 STT)"]
            J["OpenAI Vision API<br/>(gpt-4o-mini detail: high)"]
            K["DeepSeek LLM<br/>(Conciliación Semántica + Fracciones)"]
        end

        subgraph ValidationLayer ["🚨 Capa de Detección de Anomalías"]
            AD["anomaly_detector.py<br/>(Comparación Pre-Guardado vs ERP)"]
        end
    end

    %% Base de Datos PostgreSQL
    subgraph DB ["🗄️ Base de Datos Relacional (PostgreSQL)"]
        L[("Tabla: BodegaStock<br/>(Stock Teórico ERP - 12 SKUs Colsubsidio)")]
        M[("Tabla: ConteoFisico<br/>(Capturas Físicas + Alertas)")]
    end

    %% Flujos de Conexión
    A --> C
    A --> D
    C -->|POST MP3| E
    D -->|POST WebP| F

    PR0 -.->|Inyecta Catálogo ERP| K
    PR1 -.->|Carga Prompt STT| K
    PR2 -.->|Carga Prompt Vision| J
    PR3 -.->|Carga System Prompt & Tools| H

    E -->|Audio Bytes| I
    F -->|Image Base64| J

    I -->|Texto Transcrito| K
    J -->|OCR + Cantidad| K

    K -->|Resultado Estructurado| AD
    AD -->|Consulta Stock Teórico| L
    AD -->|Evalúa % Desviación & Severidad| AD

    AD -->|Persiste Conteo + Alerta| M
    AD -->|CaptureResponse con AnomalyAlert| E
    AD -->|CaptureResponse con AnomalyAlert| F

    E -->|Respuesta con Alerta Visual| A
    F -->|Respuesta con Alerta Visual| A

    B -->|Consulta Descuadres en Vivo| G
    B -->|Preguntas en Lenguaje Natural| H

    G -->|Calcula ERP vs Físico| L
    G -->|Calcula ERP vs Físico| M

    H -->|Function Calling| DB
```

---

## ⚡ Características Principales (Diferenciadores Clave)

1. **🚨 Detección de Anomalías en Tiempo Real (Pre-Guardado):** Antes de persistir cualquier conteo, el servicio `anomaly_detector.py` compara la cantidad dictada u observada contra el stock teórico registrado en `BodegaStock`. Si la desviación supera el umbral configurado (`ANOMALY_THRESHOLD_PERCENT`), el sistema marca una alerta con severidad (`CRITICA`, `ALTA`, `MEDIA`) y solicita confirmación al operario.
2. **🧠 Conciliación Semántica Inteligente:** El catálogo ERP oficial de 12 SKUs (`catalog_context.json`) se inyecta dinámicamente en los prompts de IA. El LLM traduce la jerga de bodega (ej: *"ollas grandes"* → `"Caldero Recort Tapa 50x60 cm"`, *"cintas de empaque"* → `"Cinta Sellamiento 48 mm x 50 mts"`) mapeando exactamente a los artículos oficiales del sistema.
3. **📐 Manejo de Fracciones y Mermas:** El prompt instructivo interpreta fraccionamientos coloquiales (ej: *"medio kilo"*, *"una botella y media"*, *"quedó como un cuarto de bolsa"*) y los convierte a valores numéricos `float` precisos.
4. **🎙️ Captura Multimodal por Voz (Whisper-1 STT):** Transcripción rápida de dictados mediante OpenAI Whisper y estructuración JSON mediante DeepSeek LLM.
5. **📸 Captura Multimodal por Imagen (Vision OCR detail=high):** Inspección visual de etiquetas y empaques procesada por OpenAI Vision (`gpt-4o-mini`).
6. **🤖 Agente Inteligente DeepSeek con Function Calling (`/api/v1/agent/chat`):** Consultas interactivas sobre PostgreSQL en tiempo real con razonamiento en lenguaje natural.
7. **📊 Dashboard de Analítica de Descuadres:** Interfaz React con Corporate Innovation Framework que permite visualizar métricas KPI en formato Bento Grid, tabla detallada de descuadres y vistas híbridas.
8. **📄 Reporte Digital PDF Certificado y Respaldo de Auditoría:** Generador de reportes PDF en cliente (`pdfExporter.js` con `jspdf` + `jspdf-autotable`) estructurado según el Corporate Innovation Framework (`docs/DESIGN .md`). Permite exportar informes oficiales en modo Eco-Friendly para firmas de supervisores, auditorías formales y respaldo documental en contingencias de baja conectividad, promoviendo una drástica reducción del uso de papel.

---

## 📁 Estructura del Proyecto

```text
invictory_AI/
├── .env.example               # Variables de entorno sanitizadas (incluye umbrales de anomalía)
├── pyproject.toml             # Gestión de paquetes Python con uv y pytest
├── README.md                  # Documentación completa del proyecto con diagrama Mermaid
├── MANUAL_OPERATIVO_ADOPCION.md # Manual formal de adopción operativa en campo
├── alembic.ini                # Configuración de migraciones de base de datos
├── alembic/                   # Versiones de migraciones PostgreSQL
├── resources/                 # 📁 Prompts Centralizados por Actor (.json)
│   └── prompts/
│       ├── catalog_context.json # Catálogo ERP oficial para conciliación semántica
│       ├── stt_prompts.json
│       ├── ocr_prompts.json
│       ├── agent_prompts.json
│       └── miniapp_prompts.json
├── docs/                      # Guías técnicas del reto y datos oficiales
│   ├── DESIGN .md             # Corporate Innovation Framework (Sistema de Diseño)
│   ├── colores.md
│   ├── ocr.md
│   ├── BODEGAS Y STOCK.xlsx
│   └── Cómo usar los recursos del reto Hotelería.docx
├── files/                     # Archivos reales de prueba para testing multimodal
│   ├── Record (online-voice-recorder.com).mp3
│   └── aceite_vegetal.webp
├── backend/                   # Servidor FastAPI + SQLAlchemy + Alembic
│   ├── app/
│   │   ├── main.py            # Entrypoint FastAPI
│   │   ├── config.py          # Configuración Pydantic Settings
│   │   ├── database.py        # Conexión directa a PostgreSQL
│   │   ├── models.py          # Modelos BodegaStock y ConteoFisico
│   │   ├── schemas.py         # Validadores Pydantic V2 (CaptureResponse, AnomalyAlert)
│   │   ├── services/          # Servicios STT, OCR, Detector de Anomalías y Prompt Loader
│   │   │   ├── prompt_loader.py
│   │   │   ├── stt_service.py
   │   │   ├── ocr_service.py
│   │   │   ├── anomaly_detector.py # 🚨 Servicio de detección de anomalías pre-guardado
│   │   │   └── inventory_agent.py
│   │   └── routers/           # Routers /capture, /inventory, /dashboard y /agent
│   └── tests/                 # Pruebas unitarias y de integración (Pytest)
│       ├── conftest.py
│       ├── test_agent.py
│       ├── test_anomaly_detector.py # 🚨 8 escenarios de pruebas de anomalías
│       ├── test_inventory_unit.py
│       ├── test_capture_integration.py
│       ├── test_inventory_api.py
│       └── test_dashboard_api.py
├── miniapp/                   # Telegram Mini App (React + Vite + Smart Offline Queue)
│   ├── package.json
│   ├── vite.config.js
│   ├── server.js              # Proxy de desarrollo y producción
│   ├── DEPLOY.md              # Guía de despliegue
│   ├── OFFLINE.md             # Guía técnica de resiliencia offline
│   └── src/                   # Pantallas UI, Captura Multimodal y QueueDB IndexedDB
└── frontend/                  # Aplicación React + Vite + Vitest
    ├── package.json
    ├── vite.config.js
    ├── src/                   # Componentes, Páginas y Simulación MiniApp con alertas
    └── src/__tests__/         # Pruebas de componentes React (Vitest)
```

---

## 🛠️ Guía Paso a Paso para Instalación y Despliegue Local

Esta guía está diseñada para que cualquier persona, incluso con conocimientos básicos de desarrollo, pueda instalar, configurar y ejecutar la solución en un entorno local desde cero.

---

### 📋 Prerrequisitos Básicos

Antes de comenzar, asegúrate de tener instalado en tu equipo:
1. **Python** (versión 3.10 o superior): [Descargar Python](https://www.python.org/downloads/)
2. **Node.js** (versión 18 o superior) y **npm**: [Descargar Node.js](https://nodejs.org/)
3. **Git**: Para clonar el repositorio.
4. *(Opcional pero muy recomendado)* **uv**: Gestor de paquetes ultrarrápido para Python. Se instala ejecutando:
   ```bash
   pip install uv
   ```

---

### 🚀 Paso 1: Clonar el Repositorio y Configurar Variables de Entorno

1. Abre una terminal y clona el proyecto en tu máquina local:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd invictory_AI
   ```

2. Crea tu archivo de variables de entorno `.env` a partir de la plantilla genérica `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Abre el archivo `.env` en tu editor de código (ej. VS Code) y completa tus credenciales:
   - **Base de Datos (`DATABASE_URL`)**: Por defecto utiliza SQLite (`sqlite:///./invictory.db`), lo cual no requiere instalar ningun servidor de base de datos adicional. Si deseas utilizar PostgreSQL, edita la cadena utilizando nombres genéricos como se muestra en la plantilla:
     ```env
     DATABASE_URL=postgresql://tu_usuario:tu_contrasena@localhost:5432/nombre_base_datos
     ```
   - **Llaves de API de Inteligencia Artificial**:
     - `OPENAI_API_KEY`: Requerida para la transcripción de voz (Whisper) y la visión por computadora (Vision OCR).
     - `DEEPSEEK_API_KEY`: Requerida para el modelo de lenguaje de conciliación semántica y el agente de inventarios.

---

### 🐍 Paso 2: Instalación de Dependencias del Backend (Python + FastAPI)

Tienes dos métodos para crear e instalar las dependencias del entorno backend:

#### Opción A (Recomendada con `uv`):
Sincroniza e instala automáticamente todas las dependencias del proyecto en un entorno virtual aislado:
```bash
uv sync
```

#### Opción B (Tradicional con `pip` y `venv`):
1. Crea un entorno virtual de Python:
   ```bash
   python -m venv .venv
   ```
2. Activa el entorno virtual:
   - **En Linux / macOS:**
     ```bash
     source .venv/bin/activate
     ```
   - **En Windows (PowerShell):**
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
3. Instala el proyecto y sus dependencias:
   ```bash
   pip install -e .
   ```

---

### 🗄️ Paso 3: Configuración y Migración de la Base de Datos

El sistema necesita crear la estructura de tablas (`bodega_stock` y `conteo_fisico`) en la base de datos antes de funcionar.

1. **Crear la Base de Datos**:
   - **Si usas SQLite (Por defecto):** No necesitas hacer nada previo, el archivo `invictory.db` se creará automáticamente en la raíz.
   - **Si usas PostgreSQL local o en Docker:** Asegúrate de tener el servidor PostgreSQL activo y haber creado la base de datos vacía configurada en tu `DATABASE_URL` (ej. `nombre_base_datos`). Por ejemplo, en Docker:
     ```bash
     docker run --name postgres_invictory -e POSTGRES_USER=tu_usuario -e POSTGRES_PASSWORD=tu_contrasena -e POSTGRES_DB=nombre_base_datos -p 5432:5432 -d postgres
     ```

2. **Ejecutar las Migraciones (Alembic)**:
   Alembic aplicará los scripts de migración para generar la estructura completa de tablas en tu base de datos:
   ```bash
   # Si usas uv:
   uv run alembic upgrade head

   # Si usas venv tradicional:
   alembic upgrade head
   ```

3. **Poblado Inicial de Datos (Seed)**:
   El proyecto cuenta con un catálogo semilla oficial de 12 SKUs de Colsubsidio. Este catálogo se poblará automáticamente en la base de datos la primera vez que inicies el backend o puedes forzar su carga mediante el endpoint `/api/v1/inventory/seed`.

---

### ⚡ Paso 4: Iniciar el Servidor Backend (FastAPI)

Con el entorno configurado y las migraciones ejecutadas, inicia el servidor en el puerto `8080`:

```bash
# Con uv:
uv run uvicorn backend.app.main:app --reload --port 8080

# O con venv activo:
uvicorn backend.app.main:app --reload --port 8080
```

- **Verificación:** Abre tu navegador e ingresa a `http://localhost:8080/docs`. Verás la documentación interactiva de la API (Swagger UI).

---

### 💻 Paso 5: Instalación y Ejecución del Frontend (React + Vite)

En una **nueva ventana o pestaña de terminal**, navega a la carpeta `frontend/` e instala las dependencias de Node.js:

1. Ingresa a la carpeta del frontend:
   ```bash
   cd frontend
   ```

2. Instala los paquetes de Node.js:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo en el puerto `5180`:
   ```bash
   npm run dev -- --port 5180
   ```

4. **Verificación:** Abre tu navegador e ingresa a `http://localhost:5180`. Verás el Dashboard de Analítica de Inventario funcionando y conectado con el backend.

---

## 🧪 Ejecución de Pruebas (Backend y Frontend)

### Pruebas del Backend (Pytest)
Ejecuta las 20 pruebas unitarias e integración que validan endpoints, detector de anomalías (8 escenarios), agente DeepSeek y fixtures multimodales:

```bash
uv run pytest -v
```

### Pruebas del Frontend (Vitest)
Ejecuta las 8 pruebas de componentes e interfaz en React:

```bash
cd frontend
npm test
```

---

## 📊 Endpoints Clave

- `POST /api/v1/capture/audio`: Procesa dictado de voz mediante OpenAI Whisper STT + DeepSeek, inyecta catálogo ERP y retorna `CaptureResponse` con `AnomalyAlert`.
- `POST /api/v1/capture/image`: Procesa fotografía mediante OpenAI Vision OCR (`detail: high`), inyecta catálogo ERP y retorna `CaptureResponse` con `AnomalyAlert`.
- `POST /api/v1/agent/chat`: Consulta interactiva en lenguaje natural al **Agente DeepSeek LLM** con *Function Calling* sobre PostgreSQL.
- `GET /api/v1/dashboard/discrepancies`: Obtiene el reporte en vivo de descuadres y porcentaje de precisión.
- `POST /api/v1/inventory/seed`: Restablece el inventario semilla de 12 productos de prueba de Colsubsidio.

---

## 🏆 Créditos
Desarrollado para el **Reto de Hotelería** de la **Hackathon Colsubsidio x 30X**.
