# Imagen determinista para el servicio BACKEND (FastAPI) en Railway.
# Reemplaza Nixpacks (deprecado). Build context = raíz del repo (Root Directory del servicio).
FROM python:3.11-slim

WORKDIR /app

# Deps de Python. psycopg2-binary trae libpq incluido (no requiere apt).
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Código + recursos que el backend lee en runtime.
# resources/ es OBLIGATORIO: prompt_loader.py resuelve <raíz>/resources/prompts en runtime.
COPY backend ./backend
COPY resources ./resources

# --host :: (IPv6) para la red privada de Railway; $PORT lo inyecta Railway.
CMD ["sh", "-c", "python -m uvicorn backend.app.main:app --host :: --port ${PORT:-8080}"]
