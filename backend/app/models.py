from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class BodegaStock(Base):
    """
    Modelo representativo de los datos del ERP (Stock de Sistema).
    Basado en las columnas reales del Excel de Colsubsidio:
    CANTIDAD, Nr.Artículo (id), Artículo, Unidad, BODEGAS.
    """
    __tablename__ = "bodega_stock"

    id = Column(String, primary_key=True, index=True) # Nr.Artículo / SKU (ej: "97503113")
    articulo = Column(String, nullable=False, index=True)
    unidad = Column(String, nullable=False, default="Unidad")
    cantidad = Column(Float, nullable=False, default=0.0) # Cantidad teórica según ERP
    bodegas = Column(String, nullable=False, default="General", index=True)

    conteos_fisicos = relationship("ConteoFisico", back_populates="bodega_stock")


class ConteoFisico(Base):
    """
    Modelo de conteos físicos capturados por la IA Multimodal (Whisper STT / DeepSeek OCR).
    """
    __tablename__ = "conteo_fisico"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    producto_id = Column(String, ForeignKey("bodega_stock.id"), nullable=True, index=True)
    producto_nombre = Column(String, nullable=False)
    cantidad_contada = Column(Float, nullable=False, default=0.0)
    bodega = Column(String, nullable=False, default="General")
    fuente = Column(String, nullable=False) # 'audio' o 'imagen'
    confianza = Column(Float, default=0.95)
    observaciones = Column(String, nullable=True)
    fecha_conteo = Column(DateTime, default=datetime.utcnow)

    bodega_stock = relationship("BodegaStock", back_populates="conteos_fisicos")
