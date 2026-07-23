from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.database import get_db
from backend.app.models import BodegaStock, ConteoFisico
from backend.app.schemas import BodegaStockResponse, ConteoFisicoResponse, BodegaStockCreate

router = APIRouter(prefix="/api/v1/inventory", tags=["Inventory Management"])

# Dataset Semilla Oficial (12 Productos Representativos de Colsubsidio)
INITIAL_STOCK_DATA = [
    {"id": "97503113", "articulo": "Caldero Recort Tapa 50x60 cm", "unidad": "Unidad", "cantidad": 1.0, "bodegas": "Stock Almacén Suministros"},
    {"id": "95026919", "articulo": "Cazuela 16 Onz", "unidad": "Unidad", "cantidad": 10.0, "bodegas": "Stock Almacén Suministros"},
    {"id": "95004459", "articulo": "Cinta Sellamiento 48 mm x 50 mts", "unidad": "Unidad", "cantidad": 14.0, "bodegas": "Stock Almacén Suministros"},
    {"id": "7290", "articulo": "Aceite Vegetal", "unidad": "Liter", "cantidad": 851.43, "bodegas": "Stock Restaurante Fuentes AYB"},
    {"id": "7292", "articulo": "Aceite de Ajonjolí", "unidad": "Liter", "cantidad": 1.65, "bodegas": "Stock Restaurante Fuentes AYB"},
    {"id": "7293", "articulo": "Aceite de Oliva", "unidad": "Liter", "cantidad": 28.82, "bodegas": "Stock Restaurante Fuentes AYB"},
    {"id": "95026266", "articulo": "Plato Blanco Rectangular", "unidad": "Unidad", "cantidad": 2500.0, "bodegas": "Stock Restaurante Fuentes Sumin"},
    {"id": "97502964", "articulo": "Balde Plástico 10 Lts", "unidad": "Unidad", "cantidad": 3.0, "bodegas": "Stock Restaurante Fuentes Sumin"},
    {"id": "97503242", "articulo": "Abrelatas Mariposa FB", "unidad": "Unidad", "cantidad": 4.0, "bodegas": "Stock Restaurante Fuentes Sumin"},
    {"id": "5001", "articulo": "Acelga Fresca", "unidad": "Kilogram", "cantidad": 220.7, "bodegas": "Zoológico (Alimentos)"},
    {"id": "5004", "articulo": "Aguacate", "unidad": "Kilogram", "cantidad": 30.0, "bodegas": "Zoológico (Alimentos)"},
    {"id": "5005", "articulo": "Ahuyama", "unidad": "Kilogram", "cantidad": 123.0, "bodegas": "Zoológico (Alimentos)"}
]

@router.get("/stock", response_model=List[BodegaStockResponse])
def get_system_stock(db: Session = Depends(get_db)):
    """Lista todos los registros de inventario en el sistema (ERP)."""
    items = db.query(BodegaStock).all()
    if not items:
        # Auto-seed si la base de datos está vacía
        seed_inventory(db)
        items = db.query(BodegaStock).all()
    return items

@router.post("/seed", response_model=List[BodegaStockResponse])
def seed_inventory(db: Session = Depends(get_db)):
    """Pobla la base de datos con los 12 productos reales de Colsubsidio."""
    db.query(BodegaStock).delete()
    db.commit()

    created_items = []
    for item in INITIAL_STOCK_DATA:
        stock = BodegaStock(
            id=item["id"],
            articulo=item["articulo"],
            unidad=item["unidad"],
            cantidad=item["cantidad"],
            bodegas=item["bodegas"]
        )
        db.add(stock)
        created_items.append(stock)

    # Insertar también un conteo inicial simulado para demostrar descuadres
    db.query(ConteoFisico).delete()
    db.commit()

    # Ejemplo de Descuadres para demostración en vivo del Dashboard:
    # 1. Cazuela 16 Onz (ERP: 10 vs Físico: 15 -> Sobrante de 5)
    db.add(ConteoFisico(
        producto_id="95026919",
        producto_nombre="Cazuela 16 Onz",
        cantidad_contada=15.0,
        bodega="Stock Almacén Suministros",
        fuente="audio",
        confianza=0.98,
        observaciones="Dictado de voz en almacén. Encontradas 15 cazuelas."
    ))
    # 2. Cinta Sellamiento (ERP: 14 vs Físico: 18 -> Sobrante de 4)
    db.add(ConteoFisico(
        producto_id="95004459",
        producto_nombre="Cinta Sellamiento 48 mm x 50 mts",
        cantidad_contada=18.0,
        bodega="Stock Almacén Suministros",
        fuente="imagen",
        confianza=0.99,
        observaciones="Foto de estantería analizada por DeepSeek OCR (detail=high)."
    ))
    # 3. Aceite Vegetal (ERP: 851.43 vs Físico: 800.0 -> Faltante de 51.43)
    db.add(ConteoFisico(
        producto_id="7290",
        producto_nombre="Aceite Vegetal",
        cantidad_contada=800.0,
        bodega="Stock Restaurante Fuentes AYB",
        fuente="audio",
        confianza=0.95,
        observaciones="Conteo de bidones realizado por voz."
    ))

    db.commit()
    return db.query(BodegaStock).all()

@router.get("/physical", response_model=List[ConteoFisicoResponse])
def get_physical_counts(db: Session = Depends(get_db)):
    """Lista el historial de conteos reportados por la IA Multimodal."""
    return db.query(ConteoFisico).order_by(ConteoFisico.fecha_conteo.desc()).all()
