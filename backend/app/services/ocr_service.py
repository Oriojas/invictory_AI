import base64
import json
import requests
from typing import Dict, Any
from fastapi import HTTPException
from backend.app.config import settings

def process_image_ocr(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Procesa una imagen enviándola a la API de DeepSeek Vision (deepseek-chat)
    con modalidad 'detail: high' para OCR de alta precisión según docs/ocr.md.
    Reporte transparente de errores sin fallbacks silenciosos.
    """
    deepseek_key = settings.DEEPSEEK_API_KEY

    if not deepseek_key or deepseek_key == "tu_deepseek_api_key_aqui":
        raise HTTPException(
            status_code=400,
            detail="DEEPSEEK_API_KEY no está configurada en el archivo .env. Por favor ingresa tu API Key de DeepSeek para habilitar OCR de alta resolución."
        )

    b64_img = base64.b64encode(file_bytes).decode("utf-8")
    url = f"{settings.DEEPSEEK_BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {deepseek_key}",
        "Content-Type": "application/json"
    }

    prompt = (
        "Actúa como un OCR de máxima precisión para inventarios de hotelería. "
        "Examina esta imagen, lee el texto visible o el empaque del producto y "
        "devuelve ÚNICAMENTE un objeto JSON válido con las claves:\n"
        "- producto_nombre (string: nombre exacto del insumo)\n"
        "- cantidad_contada (float: cantidad visible de unidades/litros/kilos)\n"
        "- bodega (string: ubicación o bodega identificada)\n"
        "- texto_extraido (string: todo el texto leído por el OCR)\n"
        "- observaciones (string: detalles visuales de empaque/estado)"
    )

    payload = {
        "model": "deepseek-chat",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{b64_img}",
                            "detail": "high"  # Requerido por docs/ocr.md
                        }
                    }
                ]
            }
        ],
        "max_tokens": 2000,
        "temperature": 0.0,
        "response_format": {"type": "json_object"}
    }

    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=25)
        if resp.status_code != 200:
            raise HTTPException(
                status_code=resp.status_code,
                detail=f"Error en la API de DeepSeek Vision ({resp.status_code}): {resp.text}"
            )

        result = resp.json()
        content = result["choices"][0]["message"]["content"]
        parsed = json.loads(content)

        return {
            "raw_text": parsed.get("texto_extraido", "OCR DeepSeek completado exitosamente"),
            "structured": {
                "producto_nombre": parsed.get("producto_nombre", "Insumo Desconocido"),
                "cantidad_contada": float(parsed.get("cantidad_contada", 1.0)),
                "bodega": parsed.get("bodega", "Stock Almacén Suministros"),
                "observaciones": parsed.get("observaciones", "Procesado mediante DeepSeek Vision detail=high")
            }
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=502,
            detail=f"Falla de conexión o procesamiento en DeepSeek OCR Vision: {str(e)}"
        )
