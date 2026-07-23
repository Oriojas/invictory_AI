import pytest
from fastapi.testclient import TestClient

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
