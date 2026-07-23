import os
import json
import tempfile
import requests
from typing import Dict, Any
from fastapi import HTTPException
from openai import OpenAI
from backend.app.config import settings
from backend.app.services.prompt_loader import load_prompt_resource, get_catalog_context_text

def process_audio_stt(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Transcribe audio usando la API de Whisper (whisper-1) de OpenAI
    y realiza la estructuración de inventario mediante DeepSeek LLM
    con inyección del catálogo ERP para conciliación semántica.
    """
    api_key = settings.OPENAI_API_KEY.strip().strip('"').strip("'")

    if not api_key or api_key == "tu_openai_api_key_aqui":
        raise HTTPException(
            status_code=400,
            detail="OPENAI_API_KEY no está configurada en el archivo .env. Por favor ingresa tu API Key de OpenAI para usar Speech-to-Text (whisper-1)."
        )

    transcription_text = ""
    temp_dir = tempfile.gettempdir()
    clean_filename = "".join(c for c in filename if c.isalnum() or c in "._-")
    temp_path = os.path.join(temp_dir, f"stt_{clean_filename}")

    try:
        client = OpenAI(api_key=api_key)
        with open(temp_path, "wb") as f:
            f.write(file_bytes)
        
        with open(temp_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="es"
            )
            transcription_text = transcript.text

    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Error de conexión o autenticación con la API de OpenAI Whisper: {str(e)}"
        )
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass

    # Estructurar resultado con DeepSeek LLM usando prompts centralizados + catálogo ERP
    structured_data = extract_structured_inventory_from_text(transcription_text)

    return {
        "raw_text": transcription_text,
        "structured": structured_data
    }


def extract_structured_inventory_from_text(text: str) -> Dict[str, Any]:
    """
    Analiza el texto transcrito con DeepSeek (deepseek-chat) para retornar un JSON estructurado.
    Inyecta el catálogo ERP completo en el prompt para conciliación semántica.
    """
    deepseek_key = settings.DEEPSEEK_API_KEY.strip().strip('"').strip("'")

    if not deepseek_key or deepseek_key == "tu_deepseek_api_key_aqui":
        return parse_text_heuristically(text, "Sin DEEPSEEK_API_KEY configurada")

    try:
        # Carga dinámica del prompt centralizado + catálogo ERP
        stt_prompts = load_prompt_resource("stt_prompts.json")["structured_extraction"]
        prompt_template = stt_prompts["prompt_template"]
        catalog_text = get_catalog_context_text()
        prompt = prompt_template.format(text=text, catalog=catalog_text)

        url = f"{settings.DEEPSEEK_BASE_URL}/chat/completions"
        headers = {
            "Authorization": f"Bearer {deepseek_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.0,
            "response_format": {"type": "json_object"}
        }
        resp = requests.post(url, headers=headers, json=payload, timeout=20)
        
        if resp.status_code != 200:
            raise HTTPException(
                status_code=resp.status_code,
                detail=f"Error en la API de DeepSeek ({resp.status_code}): {resp.text}"
            )
            
        result = resp.json()
        content = result["choices"][0]["message"]["content"]
        return json.loads(content)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=502,
            detail=f"Falla al procesar estructuración de inventario en DeepSeek: {str(e)}"
        )


def parse_text_heuristically(text: str, default_obs: str) -> Dict[str, Any]:
    """
    Sin DEEPSEEK_API_KEY no se puede estructurar de forma confiable.
    Devolvemos el texto con confianza 0 y libre de datos inventados.
    """
    text_lower = text.lower()
    product_name = "SIN IDENTIFICAR"
    quantity = 0.0
    bodega = "SIN ASIGNAR"

    if "balde" in text_lower:
        product_name = "Balde Plástico 10 Lts"
    elif "aceite" in text_lower:
        product_name = "Aceite Vegetal"
    elif "cazuela" in text_lower:
        product_name = "Cazuela 16 Onz"

    return {
        "producto_nombre": product_name,
        "cantidad_contada": quantity,
        "bodega": bodega,
        "is_fallback": True,
        "observaciones": f"[REQUIERE REVISIÓN MANUAL] {default_obs}. Transcripción: '{text}'"
    }
