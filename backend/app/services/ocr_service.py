import base64
import json
import requests
from typing import Dict, Any
from fastapi import HTTPException
from backend.app.config import settings
from backend.app.services.prompt_loader import load_prompt_resource, get_catalog_context_text

def process_image_ocr(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Procesa una imagen enviándola a la API de OpenAI Vision (gpt-4o-mini detail: high)
    con inyección del catálogo ERP para conciliación semántica visual.
    """
    openai_key = settings.OPENAI_API_KEY.strip().strip('"').strip("'")
    deepseek_key = settings.DEEPSEEK_API_KEY.strip().strip('"').strip("'")

    if not openai_key and not deepseek_key:
        raise HTTPException(
            status_code=400,
            detail="Se requiere al menos OPENAI_API_KEY o DEEPSEEK_API_KEY en el archivo .env para procesar OCR de imágenes."
        )

    b64_img = base64.b64encode(file_bytes).decode("utf-8")
    
    mime_type = "image/jpeg"
    if filename.lower().endswith(".png"):
        mime_type = "image/png"
    elif filename.lower().endswith(".webp"):
        mime_type = "image/webp"

    # Cargar prompt centralizado + catálogo ERP para conciliación semántica
    ocr_prompts = load_prompt_resource("ocr_prompts.json")["vision_ocr"]
    catalog_text = get_catalog_context_text()
    prompt = ocr_prompts["prompt_template"].format(catalog=catalog_text)

    if openai_key and openai_key != "tu_openai_api_key_aqui":
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {openai_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:{mime_type};base64,{b64_img}",
                                    "detail": "high"
                                }
                            }
                        ]
                    }
                ],
                "response_format": {"type": "json_object"}
            }
            resp = requests.post(url, headers=headers, json=payload, timeout=20)
            if resp.status_code == 200:
                result = resp.json()
                content = result["choices"][0]["message"]["content"]
                parsed = json.loads(content)
                
                prod_nombre = parsed.get("producto_nombre") or "SIN IDENTIFICAR"
                cant = 0.0
                try:
                    cant = float(parsed.get("cantidad_contada", 0.0))
                except (ValueError, TypeError):
                    cant = 0.0

                return {
                    "raw_text": f"OCR Vision completado para {filename}",
                    "structured": {
                        "producto_nombre": prod_nombre,
                        "cantidad_contada": cant,
                        "bodega": parsed.get("bodega") or "SIN ASIGNAR",
                        "unidad_detectada": parsed.get("unidad_detectada") or "Unidad",
                        "observaciones": parsed.get("observaciones") or "Procesado mediante Vision API (detail=high)"
                    }
                }
        except Exception as e:
            print(f"Error procesando Vision con OpenAI: {e}")

    raise HTTPException(
        status_code=502,
        detail="No se pudo procesar el OCR de la imagen. Verifica la validez de tus API Keys en el archivo .env."
    )
