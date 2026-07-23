import os
import json
from typing import Dict, Any

PROMPTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "resources", "prompts"))

def load_prompt_resource(filename: str) -> Dict[str, Any]:
    """
    Carga de forma centralizada los prompts definidos en formato .json dentro de la carpeta resources/prompts/
    """
    filepath = os.path.join(PROMPTS_DIR, filename)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"No se encontró el recurso de prompt centralizado en {filepath}")
    
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)
