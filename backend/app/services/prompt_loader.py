import os
import json
from typing import Dict, Any
from functools import lru_cache

PROMPTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "resources", "prompts"))

@lru_cache(maxsize=16)
def load_prompt_resource(filename: str) -> str:
    """
    Carga de forma centralizada los prompts definidos en formato .json dentro de la carpeta resources/prompts/
    Usa @lru_cache para evitar releer el disco en cada request.
    Retorna el contenido como string raw para luego parsearlo según necesidad.
    """
    filepath = os.path.join(PROMPTS_DIR, filename)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"No se encontró el recurso de prompt centralizado en {filepath}")
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    return json.loads(content)


def get_catalog_context_text() -> str:
    """
    Genera una representación de texto del catálogo ERP para inyectar en prompts del LLM.
    Esto permite que el LLM haga conciliación semántica contra los nombres reales del sistema.
    """
    catalog_data = load_prompt_resource("catalog_context.json")
    items = catalog_data.get("catalogo_erp", [])
    
    lines = []
    for item in items:
        lines.append(f"- SKU {item['sku']}: \"{item['articulo']}\" ({item['unidad']}) — Bodega: {item['bodega']}")
    
    return "\n".join(lines)
