import pytest
from fastapi.testclient import TestClient

def test_seed_inventory_endpoint(client: TestClient):
    """Prueba de integración para poblar los 12 insumos de Colsubsidio."""
    response = client.post("/api/v1/inventory/seed")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 12
    # Verificar un insumo específico
    skus = [item["id"] for item in data]
    assert "97503113" in skus
    assert "7290" in skus

def test_get_stock_endpoint(client: TestClient):
    """Prueba la consulta de inventario ERP."""
    client.post("/api/v1/inventory/seed")
    response = client.get("/api/v1/inventory/stock")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 12

def test_get_physical_counts_endpoint(client: TestClient):
    """Prueba la consulta del historial de conteos físicos."""
    client.post("/api/v1/inventory/seed")
    response = client.get("/api/v1/inventory/physical")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3
