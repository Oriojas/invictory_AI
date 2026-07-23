import pytest
from fastapi.testclient import TestClient

def test_dashboard_discrepancies_endpoint(client: TestClient):
    """Prueba el cálculo de descuadres y la precisión del dashboard en el backend."""
    client.post("/api/v1/inventory/seed")

    response = client.get("/api/v1/dashboard/discrepancies")
    assert response.status_code == 200

    data = response.json()
    assert "total_skus" in data
    assert "total_bodegas" in data
    assert "total_descuadres" in data
    assert "porcentaje_precision" in data
    assert "items_descuadrados" in data

    assert data["total_skus"] == 12
    assert data["total_bodegas"] == 4
    assert data["total_descuadres"] == 3
    assert data["porcentaje_precision"] == 75.0

    # Verificar que los ítems descuadrados incluyan sobrantes y faltantes
    estados = [item["estado"] for item in data["items_descuadrados"]]
    assert "SOBRANTE" in estados
    assert "FALTANTE" in estados
    assert "COINCIDE" in estados
