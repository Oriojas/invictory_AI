from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.database import engine, Base
from backend.app.routers import capture, inventory, dashboard

# Crear tablas en la base de datos si no existen
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

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
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
