import json
import requests
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.config import settings
from backend.app.models import BodegaStock, ConteoFisico
from backend.app.routers.dashboard import get_dashboard_discrepancies

def query_database_tools(db: Session, tool_name: str, arguments: Dict[str, Any]) -> Any:
    """
    Ejecuta herramientas de base de datos sobre PostgreSQL según las instrucciones de DeepSeek Agent.
    """
    if tool_name == "get_discrepancies_summary":
        summary = get_dashboard_discrepancies(db)
        return {
            "total_skus": summary.total_skus,
            "total_bodegas": summary.total_bodegas,
            "total_conteos_ia": summary.total_conteos_ia,
            "total_descuadres": summary.total_descuadres,
            "porcentaje_precision": summary.porcentaje_precision,
            "items_descuadrados": [i.model_dump() for i in summary.items_descuadrados if i.estado != "COINCIDE"]
        }
    elif tool_name == "search_product_stock":
        query_term = arguments.get("term", "").lower().strip()
        items = db.query(BodegaStock).all()
        matched = []
        for item in items:
            if query_term in item.articulo.lower() or query_term in item.id or query_term in item.bodegas.lower():
                matched.append({
                    "sku": item.id,
                    "articulo": item.articulo,
                    "unidad": item.unidad,
                    "cantidad_erp": float(item.cantidad),
                    "bodega": item.bodegas
                })
        return matched
    elif tool_name == "get_physical_counts_history":
        sku_or_name = arguments.get("sku_or_name", "").lower().strip()
        counts = db.query(ConteoFisico).order_by(ConteoFisico.fecha_conteo.desc()).all()
        result = []
        for c in counts:
            if not sku_or_name or (c.producto_id and sku_or_name in c.producto_id) or (sku_or_name in c.producto_nombre.lower()):
                result.append({
                    "id": c.id,
                    "producto_id": c.producto_id,
                    "producto_nombre": c.producto_nombre,
                    "cantidad_contada": float(c.cantidad_contada),
                    "bodega": c.bodega,
                    "fuente": c.fuente,
                    "observaciones": c.observaciones,
                    "fecha": c.fecha_conteo.isoformat() if c.fecha_conteo else None
                })
        return result
    return {"error": f"Herramienta {tool_name} no encontrada"}


def process_agent_chat_query(db: Session, user_query: str) -> Dict[str, Any]:
    """
    Procesa una consulta en lenguaje natural utilizando DeepSeek LLM (deepseek-chat)
    con capacidad de Function Calling sobre la base de datos PostgreSQL.
    """
    deepseek_key = settings.DEEPSEEK_API_KEY.strip().strip('"').strip("'")

    if not deepseek_key or deepseek_key == "tu_deepseek_api_key_aqui":
        # Respuesta Heurística Inteligente de respaldo si no hay API key
        return fallback_agent_reasoning(db, user_query)

    url = f"{settings.DEEPSEEK_BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {deepseek_key}",
        "Content-Type": "application/json"
    }

    # Herramientas disponibles para el Agente DeepSeek sobre PostgreSQL
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_discrepancies_summary",
                "description": "Obtiene el reporte consolidado de descuadres (faltantes y sobrantes) entre el ERP y los conteos de IA en PostgreSQL.",
                "parameters": {"type": "object", "properties": {}, "required": []}
            }
        },
        {
            "type": "function",
            "function": {
                "name": "search_product_stock",
                "description": "Busca un producto o insumo específico en la base de datos de stock del ERP por SKU o nombre.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "term": {"type": "string", "description": "Término de búsqueda, SKU o nombre del insumo"}
                    },
                    "required": ["term"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_physical_counts_history",
                "description": "Consulta el historial de capturas físicas de inventario (voz o foto OCR) registradas en PostgreSQL.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "sku_or_name": {"type": "string", "description": "SKU o nombre del producto a filtrar (opcional)"}
                    },
                    "required": []
                }
            }
        }
    ]

    messages = [
        {
            "role": "system",
            "content": (
                "Eres el Agente Inteligente de Inventarios de Invictory_AI para la Hackathon Colsubsidio x 30X. "
                "Tienes acceso a herramientas para consultar PostgreSQL en tiempo real. "
                "Responde de forma concisa, profesional y con datos exactos sobre descuadres, bodegas e insumos."
            )
        },
        {"role": "user", "content": user_query}
    ]

    payload = {
        "model": "deepseek-chat",
        "messages": messages,
        "tools": tools,
        "temperature": 0.1
    }

    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=25)
        if resp.status_code != 200:
            return fallback_agent_reasoning(db, user_query)

        res_data = resp.json()
        choice = res_data["choices"][0]["message"]

        # Si el modelo decidió llamar a una herramienta de BD
        if choice.get("tool_calls"):
            tool_call = choice["tool_calls"][0]
            func_name = tool_call["function"]["name"]
            func_args = json.loads(tool_call["function"]["arguments"] or "{}")

            # Ejecutar la herramienta en PostgreSQL
            tool_result = query_database_tools(db, func_name, func_args)

            # Enviar el resultado de vuelta a DeepSeek para formular la respuesta final
            messages.append(choice)
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call["id"],
                "content": json.dumps(tool_result, ensure_ascii=False)
            })

            second_payload = {
                "model": "deepseek-chat",
                "messages": messages,
                "temperature": 0.2
            }
            second_resp = requests.post(url, headers=headers, json=second_payload, timeout=25)
            if second_resp.status_code == 200:
                final_text = second_resp.json()["choices"][0]["message"]["content"]
                return {
                    "response": final_text,
                    "tool_used": func_name,
                    "data": tool_result
                }

        return {
            "response": choice.get("content", "Procesado correctamente."),
            "tool_used": "direct_reasoning",
            "data": None
        }
    except Exception as e:
        print(f"Error invocando Agente DeepSeek: {e}")
        return fallback_agent_reasoning(db, user_query)


def fallback_agent_reasoning(db: Session, user_query: str) -> Dict[str, Any]:
    summary = get_dashboard_discrepancies(db)
    q = user_query.lower()
    
    if "descuadre" in q or "faltante" in q or "sobrante" in q:
        items_str = ", ".join([f"{i.articulo} ({i.estado}: {i.diferencia})" for i in summary.items_descuadrados if i.estado != "COINCIDE"])
        return {
            "response": f"Actualmente se registran {summary.total_descuadres} descuadres críticos en PostgreSQL: {items_str}. La precisión global del inventario es del {summary.porcentaje_precision}%.",
            "tool_used": "get_discrepancies_summary",
            "data": summary.model_dump()
        }
    
    return {
        "response": f"El sistema monitorea {summary.total_skus} SKUs en {summary.total_bodegas} bodegas hoteleras con una precisión del {summary.porcentaje_precision}%. Se registran {summary.total_conteos_ia} conteos por IA en PostgreSQL.",
        "tool_used": "get_discrepancies_summary",
        "data": summary.model_dump()
    }
