from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict
from backend.app.database import get_db
from backend.app.models import BodegaStock, ConteoFisico
from backend.app.schemas import DashboardSummaryResponse, DiscrepancyItem

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard & Analytics"])

@router.get("/discrepancies", response_model=DashboardSummaryResponse)
def get_dashboard_discrepancies(db: Session = Depends(get_db)):
    """
    Calcula y devuelve el reporte de descuadres entre el Stock del Sistema (BodegaStock)
    y lo reportado físicamente por la IA (ConteoFisico).
    """
    system_stock = db.query(BodegaStock).all()
    physical_counts = db.query(ConteoFisico).order_by(ConteoFisico.fecha_conteo.desc()).all()

    # Mapear conteo físico más reciente por SKU o por Nombre de Producto
    latest_counts: Dict[str, ConteoFisico] = {}
    for count in physical_counts:
        key = count.producto_id or count.producto_nombre.lower().strip()
        if key not in latest_counts:
            latest_counts[key] = count

    discrepancy_list: List[DiscrepancyItem] = []
    total_descuadres = 0
    total_coincidencias = 0

    bodegas_set = set()

    for stock in system_stock:
        bodegas_set.add(stock.bodegas)
        key_id = stock.id
        key_name = stock.articulo.lower().strip()

        # Buscar conteo físico correspondiente
        count_record = latest_counts.get(key_id) or latest_counts.get(key_name)

        cant_sistema = float(stock.cantidad)
        if count_record:
            cant_fisica = float(count_record.cantidad_contada)
            diferencia = round(cant_fisica - cant_sistema, 2)
            fuente = count_record.fuente
            obs = count_record.observaciones
        else:
            cant_fisica = cant_sistema
            diferencia = 0.0
            fuente = "sin_captura"
            obs = "Sin conteo reciente registrado por la IA."

        if abs(diferencia) < 0.01:
            estado = "COINCIDE"
            prioridad = "NINGUNA"
            total_coincidencias += 1
        elif diferencia < 0:
            estado = "FALTANTE"
            prioridad = "ALTA" if abs(diferencia) > 10 else "MEDIA"
            total_descuadres += 1
        else:
            estado = "SOBRANTE"
            prioridad = "ALTA" if diferencia > 10 else "MEDIA"
            total_descuadres += 1

        discrepancy_list.append(DiscrepancyItem(
            sku=stock.id,
            articulo=stock.articulo,
            unidad=stock.unidad,
            bodega=stock.bodegas,
            cantidad_sistema=cant_sistema,
            cantidad_fisica=cant_fisica,
            diferencia=diferencia,
            estado=estado,
            alerta_prioridad=prioridad,
            ultima_fuente=fuente,
            observaciones=obs
        ))

    total_skus = len(system_stock)
    precision = round((total_coincidencias / total_skus * 100), 1) if total_skus > 0 else 100.0

    return DashboardSummaryResponse(
        total_skus=total_skus,
        total_bodegas=len(bodegas_set),
        total_conteos_ia=len(physical_counts),
        total_descuadres=total_descuadres,
        porcentaje_precision=precision,
        items_descuadrados=discrepancy_list
    )
