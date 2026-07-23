import os
import pytest
from fastapi.testclient import TestClient

def test_capture_audio_endpoint_with_real_fixture(client: TestClient, files_dir: str):
    """
    Prueba de integración del endpoint POST /api/v1/capture/audio utilizando
    el archivo real 'Record (online-voice-recorder.com).mp3' ubicado en files/.
    Valida que la respuesta incluya conteo + alerta de anomalía.
    """
    audio_path = os.path.join(files_dir, "Record (online-voice-recorder.com).mp3")
    assert os.path.exists(audio_path), f"El archivo de prueba {audio_path} no existe."

    with open(audio_path, "rb") as f:
        files = {"file": ("Record (online-voice-recorder.com).mp3", f, "audio/mpeg")}
        response = client.post("/api/v1/capture/audio", files=files)

    assert response.status_code == 200, f"Error en captura de audio: {response.json()}"
    data = response.json()
    # Nueva estructura CaptureResponse con conteo + anomaly
    assert "conteo" in data
    assert "anomaly" in data
    conteo = data["conteo"]
    assert "id" in conteo
    assert "producto_nombre" in conteo
    assert "cantidad_contada" in conteo
    assert conteo["fuente"] == "audio"
    # Validar estructura de anomalía
    anomaly = data["anomaly"]
    assert "is_anomaly" in anomaly
    assert "severity" in anomaly
    assert "message" in anomaly

def test_capture_image_endpoint_with_real_fixture(client: TestClient, files_dir: str):
    """
    Prueba de integración del endpoint POST /api/v1/capture/image utilizando
    el archivo real 'aceite_vegetal.webp' ubicado en files/.
    Valida que la respuesta incluya conteo + alerta de anomalía.
    """
    image_path = os.path.join(files_dir, "aceite_vegetal.webp")
    assert os.path.exists(image_path), f"El archivo de prueba {image_path} no existe."

    with open(image_path, "rb") as f:
        files = {"file": ("aceite_vegetal.webp", f, "image/webp")}
        response = client.post("/api/v1/capture/image", files=files)

    assert response.status_code == 200, f"Error en captura de imagen OCR: {response.json()}"
    data = response.json()
    assert "conteo" in data
    assert "anomaly" in data
    conteo = data["conteo"]
    assert "id" in conteo
    assert "producto_nombre" in conteo
    assert "cantidad_contada" in conteo
    assert conteo["fuente"] == "imagen"
