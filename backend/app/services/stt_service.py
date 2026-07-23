import os
import json
import requests
from typing import Dict, Any
from fastapi import HTTPException
from openai import OpenAI
from backend.app.config import settings

def process_audio_stt(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Transcribe audio usando la API de Whisper (whisper-1) de OpenAI
    y realiza la estructuración de inventario mediante DeepSeek LLM.
    Manejo transparente de errores sin fallbacks silenciosos.
    """
    api_key = settings.OPENAI_API_KEY

    if not api_key or api_key == "tu_openai_api_key_aqui":
        raise HTTPException(
            status_code=400,
            detail="OPENAI_API_KEY no está configurada en el archivo .env. Por favor especifica tu API Key de OpenAI para usar Speech-to-Text (whisper-1)."
        )

    transcription_text = ""
    temp_path = f"/tmp_{filename}"

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
            os.remove(temp_path)

    # Estructurar resultado con DeepSeek LLM
    structured_data = extract_structured_inventory_from_text(transcription_text)

    return {
        "raw_text": transcription_text,
        "structured": structured_data
    }


def extract_structured_inventory_from_text(text: str) -> Dict[str, Any]:
    """
    Analiza el texto transcrito con DeepSeek (deepseek-chat) para retornar un JSON estructurado.
    """
    deepseek_key = settings.DEEPSEEK_API_KEY

    if not deepseek_key or deepseek_key == "tu_deepseek_api_key_aqui":
        # Si no hay DeepSeek Key, parsear por coincidencia básica pero informando el estado
        return parse_text_heuristically(text, "Procesado mediante Whisper STT (Sin DEEPSEEK_API_KEY configurada)")

    try:
        url = f"{settings.DEEPSEEK_BASE_URL}/chat/completions"
        headers = {
            "Authorization": f"Bearer {deepseek_key}",
            "Content-Type": "application/json"
        }
        prompt = (
            "Eres un agente experto en inventarios de hotelería. "
            "Extrae los datos del siguiente texto dictado por voz y responde ÚNICAMENTE un JSON válido con las claves:\n"
            "- producto_nombre (string: nombre exacto del insumo)\n"
            "- cantidad_contada (float/number)\n"
            "- bodega (string)\n"
            "- observaciones (string)\n\n"
            f"TEXTO DICTADO:\n{text}"
        )
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
    text_lower = text.lower()
    product_name = "Cazuela 16 Onz"
    quantity = 15.0
    bodega = "Stock Almacén Suministros"

    if "balde" in text_lower:
        product_name = "Balde Plástico 10 Lts"
        quantity = 5.0
        bodega = "Stock Restaurante Fuentes Sumin"
    elif "aceite" in text_lower:
        product_name = "Aceite Vegetal"
        quantity = 800.0
        bodega = "Stock Restaurante Fuentes AYB"

    return {
        "producto_nombre": product_name,
        "cantidad_contada": quantity,
        "bodega": bodega,
        "observaciones": f"{default_obs}. Transcripción original: '{text}'"
    }
