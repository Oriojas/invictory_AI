import pytest
from backend.app.models import BodegaStock, ConteoFisico
from backend.app.schemas import BodegaStockResponse, DiscrepancyItem, DashboardSummaryResponse
from backend.app.routers.capture import _parse_cantidad
from backend.app.services.stt_service import parse_text_heuristically

def test_parse_cantidad_tolera_variaciones_del_llm():
    assert _parse_cantidad(15) == 15.0
    assert _parse_cantidad("15") == 15.0
    assert _parse_cantidad("15.5") == 15.5
    assert _parse_cantidad("15,5 unidades") == 15.5
    assert _parse_cantidad("quince") == 0.0
    assert _parse_cantidad(None) == 0.0

def test_parse_text_heuristically_no_inventa_datos():
    res = parse_text_heuristically("Texto de prueba no reconocido", "Prueba sin API Key")
    assert res["producto_nombre"] == "SIN IDENTIFICAR"
    assert res["cantidad_contada"] == 0.0
    assert res["is_fallback"] is True
    assert "[REQUIERE REVISIÓN MANUAL]" in res["observaciones"]

def test_bodega_stock_model_creation():
    stock = BodegaStock(
        id="97503113",
        articulo="Caldero Recort Tapa 50x60 cm",
        unidad="Unidad",
        cantidad=5.0,
        bodegas="Stock Almacén Suministros"
    )
    assert stock.id == "97503113"
    assert stock.articulo == "Caldero Recort Tapa 50x60 cm"
    assert stock.cantidad == 5.0
    assert stock.bodegas == "Stock Almacén Suministros"

def test_conteo_fisico_model_creation():
    conteo = ConteoFisico(
        producto_id="95026919",
        producto_nombre="Cazuela 16 Onz",
        cantidad_contada=15.0,
        bodega="Stock Almacén Suministros",
        fuente="audio",
        confianza=0.98,
        observaciones="Transcripción de voz: 15 cazuelas"
    )
    assert conteo.producto_id == "95026919"
    assert conteo.cantidad_contada == 15.0
    assert conteo.fuente == "audio"

def test_discrepancy_schema_calculation():
    item = DiscrepancyItem(
        sku="7290",
        articulo="Aceite Vegetal",
        unidad="Liter",
        bodega="Stock Restaurante Fuentes AYB",
        cantidad_sistema=851.43,
        cantidad_fisica=800.0,
        diferencia=-51.43,
        estado="FALTANTE",
        alerta_prioridad="ALTA",
        ultima_fuente="audio",
        observaciones="Faltante detectado por voz"
    )
    assert item.sku == "7290"
    assert item.diferencia < 0
    assert item.estado == "FALTANTE"
    assert item.alerta_prioridad == "ALTA"
