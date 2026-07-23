import pytest
from fastapi.testclient import TestClient
from backend.app.services.inventory_agent import query_database_tools

def test_query_database_tools_direct(db_session):
    """Prueba las 3 herramientas de base de datos utilizadas por el Agente DeepSeek sobre la sesión DB de prueba."""
    from backend.app.routers.inventory import seed_inventory
    seed_inventory(db_session)

    # 1. get_discrepancies_summary
    summary = query_database_tools(db_session, "get_discrepancies_summary", {})
    assert summary["total_skus"] == 12
    assert summary["total_descuadres"] == 3
    assert summary["porcentaje_precision"] == 75.0

    # 2. search_product_stock
    matched = query_database_tools(db_session, "search_product_stock", {"term": "Aceite"})
    assert isinstance(matched, list)
    assert len(matched) >= 2
    skus = [m["sku"] for m in matched]
    assert "7290" in skus

    # 3. get_physical_counts_history
    history = query_database_tools(db_session, "get_physical_counts_history", {"sku_or_name": "7290"})
    assert isinstance(history, list)
    assert len(history) >= 1
    assert history[0]["producto_id"] == "7290"

def test_agent_chat_query_endpoint(client: TestClient):
    """Prueba de integración para la consulta al Agente DeepSeek sobre la base de datos PostgreSQL."""
    client.post("/api/v1/inventory/seed")

    payload = {"query": "¿Cuáles son los descuadres de inventario detectados?"}
    response = client.post("/api/v1/agent/chat", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert "tool_used" in data
    assert isinstance(data["response"], str)
    assert len(data["response"]) > 0

def test_agent_chat_query_empty_error(client: TestClient):
    """Prueba que el agente rechace consultas vacías con un 400 Bad Request."""
    payload = {"query": "   "}
    response = client.post("/api/v1/agent/chat", json=payload)
    assert response.status_code == 400
