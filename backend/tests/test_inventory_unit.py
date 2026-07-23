import pytest
from backend.app.models import BodegaStock, ConteoFisico
from backend.app.schemas import BodegaStockResponse, DiscrepancyItem, DashboardSummaryResponse

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
