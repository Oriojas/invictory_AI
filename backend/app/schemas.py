from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class BodegaStockBase(BaseModel):
    id: str
    articulo: str
    unidad: str = "Unidad"
    cantidad: float
    bodegas: str

class BodegaStockCreate(BodegaStockBase):
    pass

class BodegaStockResponse(BodegaStockBase):
    class Config:
        from_attributes = True

class ConteoFisicoBase(BaseModel):
    producto_id: Optional[str] = None
    producto_nombre: str
    cantidad_contada: float
    bodega: str = "General"
    fuente: str # 'audio' | 'imagen'
    confianza: Optional[float] = 0.95
    observaciones: Optional[str] = None

class ConteoFisicoCreate(ConteoFisicoBase):
    pass

class ConteoFisicoResponse(ConteoFisicoBase):
    id: int
    fecha_conteo: datetime

    class Config:
        from_attributes = True

class DiscrepancyItem(BaseModel):
    sku: str
    articulo: str
    unidad: str
    bodega: str
    cantidad_sistema: float
    cantidad_fisica: float
    diferencia: float # cantidad_fisica - cantidad_sistema
    estado: str # 'COINCIDE' | 'FALTANTE' | 'SOBRANTE' | 'NO_REGISTRADO'
    alerta_prioridad: str # 'ALTA' | 'MEDIA' | 'BAJA' | 'NINGUNA'
    ultima_fuente: Optional[str] = None
    observaciones: Optional[str] = None

class DashboardSummaryResponse(BaseModel):
    total_skus: int
    total_bodegas: int
    total_conteos_ia: int
    total_descuadres: int
    porcentaje_precision: float
    items_descuadrados: List[DiscrepancyItem]
