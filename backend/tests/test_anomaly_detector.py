import pytest
from sqlalchemy.orm import Session
from backend.app.models import BodegaStock
from backend.app.services.anomaly_detector import detect_anomaly


def test_anomaly_critical_deviation(db_session: Session):
    """Desviación extrema (ERP: 10, operario: 90) → anomalía CRITICA."""
    db_session.add(BodegaStock(
        id="TST001", articulo="Cazuela 16 Onz", unidad="Unidad",
        cantidad=10.0, bodegas="Stock Almacén Suministros"
    ))
    db_session.commit()

    result = detect_anomaly(db_session, "Cazuela 16 Onz", 90.0, "Stock Almacén Suministros", "TST001")

    assert result["is_anomaly"] is True
    assert result["severity"] == "CRITICA"
    assert result["requires_confirmation"] is True
    assert result["deviation_percent"] >= 200


def test_anomaly_high_deviation(db_session: Session):
    """Desviación significativa (ERP: 10, operario: 16) → anomalía ALTA."""
    db_session.add(BodegaStock(
        id="TST002", articulo="Balde Plástico 10 Lts", unidad="Unidad",
        cantidad=10.0, bodegas="Stock Restaurante"
    ))
    db_session.commit()

    result = detect_anomaly(db_session, "Balde Plástico 10 Lts", 16.0, "Stock Restaurante", "TST002")

    assert result["is_anomaly"] is True
    assert result["severity"] == "ALTA"
    assert result["requires_confirmation"] is True
    assert result["deviation_percent"] >= 50


def test_anomaly_medium_deviation(db_session: Session):
    """Desviación moderada (ERP: 100, operario: 75) → anomalía MEDIA."""
    db_session.add(BodegaStock(
        id="TST003", articulo="Plato Blanco Rectangular", unidad="Unidad",
        cantidad=100.0, bodegas="Stock Restaurante"
    ))
    db_session.commit()

    result = detect_anomaly(db_session, "Plato Blanco Rectangular", 75.0, "Stock Restaurante", "TST003")

    assert result["is_anomaly"] is True
    assert result["severity"] == "MEDIA"
    assert result["requires_confirmation"] is False


def test_no_anomaly_small_difference(db_session: Session):
    """Diferencia menor al umbral absoluto (ERP: 10, operario: 11) → sin anomalía."""
    db_session.add(BodegaStock(
        id="TST004", articulo="Abrelatas Mariposa FB", unidad="Unidad",
        cantidad=10.0, bodegas="Stock Restaurante"
    ))
    db_session.commit()

    result = detect_anomaly(db_session, "Abrelatas Mariposa FB", 11.0, "Stock Restaurante", "TST004")

    assert result["is_anomaly"] is False
    assert result["severity"] == "NINGUNA"
    assert result["requires_confirmation"] is False


def test_no_anomaly_exact_match(db_session: Session):
    """Conteo exacto (ERP: 10, operario: 10) → sin anomalía."""
    db_session.add(BodegaStock(
        id="TST005", articulo="Aceite Vegetal", unidad="Liter",
        cantidad=851.43, bodegas="Stock Restaurante"
    ))
    db_session.commit()

    result = detect_anomaly(db_session, "Aceite Vegetal", 851.43, "Stock Restaurante", "TST005")

    assert result["is_anomaly"] is False
    assert result["severity"] == "NINGUNA"


def test_anomaly_product_not_found(db_session: Session):
    """Producto no existe en el catálogo ERP → sin anomalía, sin referencia."""
    result = detect_anomaly(db_session, "Producto Inventado XYZ", 50.0, "Bodega X")

    assert result["is_anomaly"] is False
    assert result["expected_quantity"] is None
    assert "no encontrado" in result["message"].lower()


def test_anomaly_sin_identificar(db_session: Session):
    """Producto SIN IDENTIFICAR → requires_confirmation = True."""
    result = detect_anomaly(db_session, "SIN IDENTIFICAR", 5.0, "SIN ASIGNAR")

    assert result["requires_confirmation"] is True


def test_anomaly_faltante_significativo(db_session: Session):
    """Faltante grande (ERP: 851.43, operario: 400) → anomalía ALTA."""
    db_session.add(BodegaStock(
        id="TST006", articulo="Aceite Test", unidad="Liter",
        cantidad=851.43, bodegas="Stock Restaurante"
    ))
    db_session.commit()

    result = detect_anomaly(db_session, "Aceite Test", 400.0, "Stock Restaurante", "TST006")

    assert result["is_anomaly"] is True
    assert result["severity"] in ["ALTA", "CRITICA"]
    assert result["expected_quantity"] == 851.43
    assert result["deviation_percent"] > 50
