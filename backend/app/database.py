import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.config import settings

logger = logging.getLogger(__name__)

db_url = settings.DATABASE_URL

def _get_engine(url: str):
    connect_args = {}
    if url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}
    return create_engine(url, connect_args=connect_args, pool_pre_ping=True)

try:
    engine = _get_engine(db_url)
    # Probar conexión inicial
    with engine.connect() as conn:
        pass
except Exception as exc:
    logger.warning("⚠️ No se pudo conectar a %s (%s). Usando fallback explícito SQLite para desarrollo local.", db_url, exc)
    db_url = settings.FALLBACK_DATABASE_URL
    engine = _get_engine(db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
