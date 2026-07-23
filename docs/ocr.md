# Documento Técnico: Integración de OCR con DeepSeek y Speech-to-Text con Whisper API

**Versión:** 1.0  
**Fecha:** 2026-07-22  
**Autor:** Arquitectura de IA  
**Propósito:** Guía de implementación para desarrolladores que requieren extraer texto de imágenes (OCR) y transcribir audio a texto (STT) utilizando servicios en la nube, con procesamiento posterior mediante modelos de lenguaje.

---

## 1. Alcance y Arquitectura General

Este documento describe cómo construir un módulo de extracción multimodal que combina:

- **OCR (Reconocimiento óptico de caracteres):** Utilizando la API de DeepSeek (`deepseek-chat`), que es un LLM multimodal con capacidad de comprensión de imágenes.
- **STT (Speech-to-Text):** Utilizando la API de Whisper de OpenAI (`whisper-1`), que ofrece transcripción de audio de alta precisión.

Ambos servicios se consumen vía API REST con formato compatible OpenAI, lo que unifica la integración y permite usar la misma librería cliente (`openai` en Python) para ambos.

**Flujo de datos previsto:**

1.  El usuario final sube una imagen (factura, documento, captura) o un archivo de audio.
2.  El backend recibe el archivo y decide qué servicio invocar.
3.  El texto extraído/transcrito se devuelve crudo o se envía opcionalmente a DeepSeek (modelo `deepseek-chat` o `deepseek-reasoner`) para análisis, resumen, extracción de entidades, clasificación, etc.
4.  El resultado se retorna al cliente.

---

## 2. OCR con DeepSeek: Análisis y Configuración

### 2.1 ¿Por qué DeepSeek para OCR?

A diferencia de los motores de OCR tradicionales (Tesseract, Azure Form Recognizer), DeepSeek no devuelve bounding boxes ni coordenadas; en su lugar, **ve la imagen completa y transcribe su contenido textual** con un entendimiento contextual profundo. Esto le permite:

- Extraer texto en escenas complejas (fotos con perspectiva, baja iluminación).
- Corregir errores de OCR inherentes (caracteres borrosos) basándose en el contexto del lenguaje.
- Conservar la estructura semántica (párrafos, listas, tablas simples).
- Reconocer múltiples idiomas y tipografías (incluyendo manuscrita legible).

**Modelo a utilizar:** `deepseek-chat`  
**Endpoint:** `https://api.deepseek.com/chat/completions`  
**Formato de petición:** Compatible con el estándar de Chat Completions de OpenAI, incluyendo el tipo de contenido `image_url`.

### 2.2 Modos de imagen y cálculo de tokens

La API de DeepSeek procesa las imágenes en dos modalidades que afectan al coste y al detalle:

| Modo | Tokens de entrada | Uso recomendado |
| :--- | :--- | :--- |
| **Baja resolución** (`low`) | 85 tokens fijos | Imágenes pequeñas o cuando solo se necesita una descripción general. **No usar para OCR.** |
| **Alta resolución** (`high`) | 85 tokens base + 170 tokens por cada tile de 512x512 px | **Obligatorio para OCR de precisión.** Permite leer texto pequeño y detalles finos. |

**Cálculo de coste para OCR (modo `high`):**  
Una imagen de 1024x1024 píxeles se divide en 4 tiles (2x2). El coste de entrada será:  
`85 (base) + 4 * 170 = 85 + 680 = 765 tokens de entrada`.  
A $0.14 / 1M tokens de entrada, esto cuesta **≈ $0.000107**. La salida (texto extraído) tiene un coste de $0.28 / 1M tokens, típicamente insignificante para una página (unos 500-1000 tokens de salida).

### 2.3 Ejemplo de implementación OCR en Python

```python
import base64
import requests

DEEPSEEK_API_KEY = "sk-tu-api-key-deepseek"
DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"

def encode_image_to_base64(image_path: str) -> str:
    """Convierte una imagen local a base64 para enviar en la API."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def extract_text_from_image(image_path: str) -> str:
    """Extrae todo el texto de una imagen usando DeepSeek."""
    base64_image = encode_image_to_base64(image_path)
    
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "deepseek-chat",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            "Actúa como un OCR de máxima precisión. "
                            "Extrae TODO el texto visible en esta imagen. "
                            "Conserva la estructura de párrafos, listas y tablas si las hay. "
                            "No añadas comentarios, solo el texto extraído."
                        )
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                            "detail": "high"  # Indispensable para OCR
                        }
                    }
                ]
            }
        ],
        "max_tokens": 2000,  # Ajusta según la cantidad de texto esperada
        "temperature": 0.0    # 0 para máxima fidelidad al texto original
    }

    response = requests.post(DEEPSEEK_URL, headers=headers, json=payload)
    response.raise_for_status()
    
    result = response.json()
    return result["choices"][0]["message"]["content"]

# Uso
texto_extraido = extract_text_from_image("factura_escaneada.png")
print(texto_extraido)

Buenas prácticas para el prompt de OCR:

    Indica claramente "Actúa como un OCR".

    Pide explícitamente conservar la estructura.

    Usa temperature: 0 para evitar alucinaciones o texto inventado.

    Si procesas documentos legales/tablas, menciona "Conserva el formato tabular usando espacios o caracteres".

3. Speech-to-Text con Whisper API: Análisis y Configuración
3.1 ¿Por qué Whisper API?

Whisper (whisper-1) es actualmente uno de los modelos STT más robustos para múltiples idiomas, especialmente español e inglés. Su API es extremadamente simple y comparte el formato de autenticación con DeepSeek (Bearer token, aunque de proveedores distintos).
Ventajas clave:

    Gran precisión base, sin necesidad de entrenamiento por dominio.

    Puntuación y mayúsculas automáticas.

    Soporte para archivos de audio de hasta 25 MB.

    Transcripción multilingüe (autodetects o fuerza un idioma con el parámetro language).

    Opción de traducción directa a inglés (endpoint /translations).

Modelo: whisper-1
Endpoint: https://api.openai.com/v1/audio/transcriptions
Coste: $0.006 por minuto de audio (redondeado por segundo).
3.2 Ejemplo de implementación STT en Python
python

import requests

OPENAI_API_KEY = "sk-tu-api-key-openai"
WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions"

def transcribe_audio(audio_path: str, language: str = "es") -> str:
    """Transcribe un archivo de audio usando Whisper API."""
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }

    # Enviamos el archivo como multipart/form-data
    with open(audio_path, "rb") as audio_file:
        files = {
            "file": (audio_path, audio_file, "audio/mpeg")  # Ajusta MIME type si es wav/flac
        }
        data = {
            "model": "whisper-1",
            "language": language,      # "es" para español. Quítalo para autodetectar.
            "response_format": "text"  # Opciones: json, text, srt, verbose_json, vtt
        }
        
        response = requests.post(WHISPER_URL, headers=headers, files=files, data=data)
        response.raise_for_status()
        
        # Si response_format='text', la respuesta es texto plano
        return response.text

# Uso
transcripcion = transcribe_audio("reunion_cliente.mp3", language="es")
print(transcripcion)

Formatos de audio soportados: mp3, mp4, mpeg, mpga, m4a, wav, webm, flac.
Límite de tamaño: 25 MB por archivo. Para audios más largos, hay que trocearlos (ver sección 5 de consideraciones).
4. Integración Completa: Flujo Unificado de Procesamiento

Un desarrollador puede encapsular ambas funcionalidades en una sola clase o módulo, y luego opcionalmente pasar el texto resultante a DeepSeek para un posprocesamiento inteligente.
4.1 Ejemplo de módulo MultimodalProcessor
python

import base64
import requests
from typing import Optional

class MultimodalProcessor:
    def __init__(self, deepseek_key: str, openai_key: str):
        self.deepseek_key = deepseek_key
        self.openai_key = openai_key
        self.deepseek_url = "https://api.deepseek.com/chat/completions"
        self.whisper_url = "https://api.openai.com/v1/audio/transcriptions"

    # --- OCR (DeepSeek) ---
    def image_to_text(self, image_path: str, prompt: Optional[str] = None) -> str:
        if prompt is None:
            prompt = "Extrae TODO el texto de esta imagen. Solo el texto, sin comentarios."
        
        with open(image_path, "rb") as f:
            b64_img = base64.b64encode(f.read()).decode("utf-8")
        
        headers = {"Authorization": f"Bearer {self.deepseek_key}", "Content-Type": "application/json"}
        payload = {
            "model": "deepseek-chat",
            "messages": [{
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64_img}", "detail": "high"}}
                ]
            }],
            "max_tokens": 3000,
            "temperature": 0
        }
        resp = requests.post(self.deepseek_url, headers=headers, json=payload).json()
        return resp["choices"][0]["message"]["content"]

    # --- STT (Whisper) ---
    def audio_to_text(self, audio_path: str, language: str = "es") -> str:
        headers = {"Authorization": f"Bearer {self.openai_key}"}
        with open(audio_path, "rb") as f:
            files = {"file": (audio_path, f, "audio/mpeg")}
            data = {"model": "whisper-1", "language": language, "response_format": "text"}
            resp = requests.post(self.whisper_url, headers=headers, files=files, data=data)
        return resp.text

    # --- Posprocesamiento con DeepSeek (análisis de texto) ---
    def analyze_text(self, text: str, instruction: str) -> str:
        """Envía cualquier texto a DeepSeek para resumir, extraer entidades, etc."""
        headers = {"Authorization": f"Bearer {self.deepseek_key}", "Content-Type": "application/json"}
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "Eres un asistente de análisis de texto preciso."},
                {"role": "user", "content": f"{instruction}\n\nTEXTO:\n{text}"}
            ],
            "temperature": 0.1
        }
        resp = requests.post(self.deepseek_url, headers=headers, json=payload).json()
        return resp["choices"][0]["message"]["content"]

# --- Demo de uso ---
if __name__ == "__main__":
    processor = MultimodalProcessor(
        deepseek_key="sk-deepseek-...",
        openai_key="sk-openai-..."
    )

    # Procesar una imagen
    texto_factura = processor.image_to_text("factura.jpg")
    print("TEXTO OCR:", texto_factura)

    # Procesar un audio
    texto_reunion = processor.audio_to_text("reunion.mp3")
    print("TEXTO STT:", texto_reunion)

    # Analizar el texto transcrito con DeepSeek (extraer acuerdos)
    resumen = processor.analyze_text(
        texto_reunion,
        "Extrae los 3 acuerdos principales mencionados en esta reunión, en viñetas."
    )
    print("ANÁLISIS:", resumen)

5. Consideraciones de Producción
5.1 Gestión de archivos grandes

    Imágenes: Aunque DeepSeek soporta hasta 20 MB, para OCR es mejor no sobrepasar los 5 MB y mantener una resolución suficiente (>150 DPI). Comprime sin pérdida si es necesario.

    Audio: El límite de 25 MB de Whisper API equivale a ~40 minutos de audio en MP3 a 128 kbps. Para audios más largos, implementa un splitter silencioso (usando pydub) que divida el audio por pausas y luego transcriba cada fragmento uniendo los resultados.

5.2 Costes estimados (por unidad)
Operación	Volumen típico	Coste unitario aprox.
OCR (imagen A4)	1000 tokens entrada	$0.00014 entrada + $0.00028 salida = $0.00042
STT (1 minuto)	1 minuto de audio	$0.006
Análisis extra DeepSeek	500 tokens entrada + 200 salida	$0.00007 entrada + $0.000056 salida = $0.00013

Para 1000 imágenes y 1000 minutos de audio procesados al mes, el coste sería ≈ $0.42 (OCR) + $6.00 (STT) = $6.42 mensuales (sin contar análisis extra).
5.3 Manejo de errores y reintentos

    Implementa lógica de reintento con backoff exponencial (status 429, 5xx).

    La API de DeepSeek tiene límites de rate por minuto; consulta el dashboard.

    Para Whisper, los errores de audio corrupto devuelven 400 Bad Request; valida el archivo antes de enviarlo.

5.4 Seguridad

    Las API keys nunca deben ir en cliente (frontend). Todas las llamadas deben realizarse desde el backend.

    Si procesas datos sensibles, recuerda que los archivos se envían a servidores externos (DeepSeek/OpenAI). A partir de cierto volumen, considera cláusulas de privacidad con los proveedores o, para STT, montar Whisper en self-hosted (no incluido en este documento pero factible).

6. Conclusión

La combinación DeepSeek (OCR) + OpenAI Whisper (STT) proporciona una solución ligera, fácil de integrar y extremadamente económica para extraer texto de imágenes y audio. Al estar ambas APIs alineadas con el estándar OpenAI, el código de integración es homogéneo y mantenible. DeepSeek añade además la capacidad de razonar sobre el texto extraído, cerrando el ciclo de procesamiento multimodal.
