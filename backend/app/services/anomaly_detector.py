import logging
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.app.models import BodegaStock, ConteoFisico
from backend.app.config import settings

logger = logging.getLogger(__name__)

# Umbral configurable: si la desviación % supera este valor, se activa la alerta
ANOMALY_THRESHOLD_PERCENT = float(getattr(settings, 'ANOMALY_THRESHOLD_PERCENT', 50.0))
# Diferencia absoluta mínima para considerar anomalía (evita alertas por decimales)
ANOMALY_MIN_ABSOLUTE_DIFF = float(getattr(settings, 'ANOMALY_MIN_ABSOLUTE_DIFF', 2.0))


def detect_anomaly(
    db: Session,
    producto_nombre: str,
    cantidad_contada: float,
    bodega: str,
    sku_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Compara la cantidad reportada por el operario contra el stock histórico del ERP (BodegaStock).
    Si la desviación supera el umbral configurado, retorna una alerta de anomalía.
    
    Retorna un diccionario con:
    - is_anomaly: bool - Si se detectó una anomalía
    - severity: str - 'CRITICA' | 'ALTA' | 'MEDIA' | 'NINGUNA'
    - message: str - Mensaje descriptivo de la anomalía
    - expected_quantity: float - Cantidad esperada según el ERP
    - deviation_percent: float - Porcentaje de desviación
    - requires_confirmation: bool - Si el conteo requiere confirmación humana
    """
    # 1. Buscar el producto en BodegaStock por SKU o por nombre
    stock_item = None
    if sku_id:
        stock_item = db.query(BodegaStock).filter(BodegaStock.id == sku_id).first()
    
    if not stock_item and producto_nombre and producto_nombre != "SIN IDENTIFICAR":
        stock_item = db.query(BodegaStock).filter(
            BodegaStock.articulo.ilike(f"%{producto_nombre}%")
        ).first()

    # Si no se encontró el producto en el ERP, no hay referencia para comparar
    if not stock_item:
        return {
            "is_anomaly": False,
            "severity": "NINGUNA",
            "message": f"Producto '{producto_nombre}' no encontrado en el catálogo ERP. Sin referencia para validación de anomalía.",
            "expected_quantity": None,
            "deviation_percent": 0.0,
            "requires_confirmation": producto_nombre == "SIN IDENTIFICAR"
        }

    expected_qty = float(stock_item.cantidad)
    diff = cantidad_contada - expected_qty
    abs_diff = abs(diff)

    # Calcular porcentaje de desviación relativa al stock esperado
    if expected_qty > 0:
        deviation_pct = round((abs_diff / expected_qty) * 100, 1)
    elif cantidad_contada > 0:
        deviation_pct = 100.0  # Si el ERP dice 0 pero el operario contó algo
    else:
        deviation_pct = 0.0

    # 2. Evaluar severidad de la anomalía
    is_anomaly = False
    severity = "NINGUNA"
    requires_confirmation = False
    message = f"Conteo de {cantidad_contada} {stock_item.unidad} de '{stock_item.articulo}' coincide con el ERP ({expected_qty})."

    if abs_diff < ANOMALY_MIN_ABSOLUTE_DIFF:
        # Diferencia insignificante
        pass
    elif deviation_pct >= 200:
        # Desviación extrema (ej: ERP dice 9, operario dice 90)
        is_anomaly = True
        severity = "CRITICA"
        requires_confirmation = True
        direction = "MÁS" if diff > 0 else "MENOS"
        message = (
            f"⚠️ ANOMALÍA CRÍTICA: El operario reporta {cantidad_contada} {stock_item.unidad} de '{stock_item.articulo}', "
            f"pero el ERP registra {expected_qty}. Eso es {abs_diff} {direction} ({deviation_pct}% de desviación). "
            f"¿Es correcto este conteo? Se requiere confirmación antes de guardar."
        )
    elif deviation_pct >= ANOMALY_THRESHOLD_PERCENT:
        # Desviación significativa
        is_anomaly = True
        severity = "ALTA"
        requires_confirmation = True
        direction = "sobrante" if diff > 0 else "faltante"
        message = (
            f"⚠️ ALERTA: Desviación del {deviation_pct}% detectada en '{stock_item.articulo}'. "
            f"ERP: {expected_qty} → Conteo: {cantidad_contada} ({direction} de {abs_diff} {stock_item.unidad}). "
            f"Se recomienda verificar antes de confirmar."
        )
    elif deviation_pct >= 20:
        # Desviación moderada
        is_anomaly = True
        severity = "MEDIA"
        requires_confirmation = False
        direction = "sobrante" if diff > 0 else "faltante"
        message = (
            f"ℹ️ Desviación moderada del {deviation_pct}% en '{stock_item.articulo}'. "
            f"ERP: {expected_qty} → Conteo: {cantidad_contada} ({direction} de {abs_diff} {stock_item.unidad})."
        )

    if is_anomaly:
        logger.warning("Anomalía detectada: %s (severidad: %s, desviación: %s%%)", 
                       stock_item.articulo, severity, deviation_pct)

    return {
        "is_anomaly": is_anomaly,
        "severity": severity,
        "message": message,
        "expected_quantity": expected_qty,
        "deviation_percent": deviation_pct,
        "requires_confirmation": requires_confirmation
    }
