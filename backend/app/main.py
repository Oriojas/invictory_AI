from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.database import engine, Base, SessionLocal
from backend.app.routers import capture, inventory, dashboard
from backend.app.routers.inventory import seed_inventory

# Aplicar modelos a la base de datos PostgreSQL
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend FastAPI para el Reto Hotelería Hackathon Colsubsidio x 30X - Invictory_AI"
)

# Configurar CORS dinámicamente desde variables de entorno
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar Routers
app.include_router(capture.router)
app.include_router(inventory.router)
app.include_router(dashboard.router)

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        print(f"🚀 [Invictory_AI] Conectado exitosamente a la base de datos PostgreSQL: {engine.url}")
        # Auto-seed si la base de datos PostgreSQL está vacía
        inventory.get_system_stock(db)
    except Exception as e:
        print(f"⚠️ Error durante el arranque de base de datos: {e}")
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "database": str(engine.url),
        "version": settings.VERSION,
        "docs": "/docs",
        "message": "Bienvenido a Invictory_AI API - Captura Multimodal de Inventarios con IA"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
