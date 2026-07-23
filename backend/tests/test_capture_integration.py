import os
import pytest
from fastapi.testclient import TestClient

def test_files_directory_contains_fixtures(files_dir: str):
    """
    Verifica que la carpeta 'files/' contenga los archivos binarios reales de prueba
    para el dictado por voz y la inspección por foto OCR.
    """
    audio_path = os.path.join(files_dir, "Record (online-voice-recorder.com).mp3")
    image_path = os.path.join(files_dir, "aceite_vegetal.webp")

    assert os.path.exists(audio_path), f"Falta el archivo fixture de audio en {audio_path}"
    assert os.path.exists(image_path), f"Falta el archivo fixture de imagen en {image_path}"
    assert os.path.getsize(audio_path) > 0, "El archivo de audio de prueba está vacío."
    assert os.path.getsize(image_path) > 0, "El archivo de imagen de prueba está vacío."


def test_capture_audio_endpoint_with_real_fixture(client: TestClient, files_dir: str):
    """
    Prueba de integración del endpoint POST /api/v1/capture/audio utilizando
    el archivo real 'Record (online-voice-recorder.com).mp3' ubicado en la carpeta files/.
    Valida la captura completa, procesamiento y estructura de anomalía.
    """
    audio_path = os.path.join(files_dir, "Record (online-voice-recorder.com).mp3")

    with open(audio_path, "rb") as f:
        files = {"file": ("Record (online-voice-recorder.com).mp3", f, "audio/mpeg")}
        response = client.post("/api/v1/capture/audio", files=files)

    assert response.status_code == 200, f"Error en captura de audio: {response.json()}"
    data = response.json()
    
    assert "conteo" in data
    assert "anomaly" in data
    conteo = data["conteo"]
    assert conteo["id"] > 0
    assert isinstance(conteo["producto_nombre"], str)
    assert isinstance(conteo["cantidad_contada"], (int, float))
    assert conteo["fuente"] == "audio"

    anomaly = data["anomaly"]
    assert "is_anomaly" in anomaly
    assert "severity" in anomaly
    assert "message" in anomaly


def test_capture_image_endpoint_with_real_fixture(client: TestClient, files_dir: str):
    """
    Prueba de integración del endpoint POST /api/v1/capture/image utilizando
    el archivo real 'aceite_vegetal.webp' ubicado en la carpeta files/.
    Valida la captura completa por OCR, procesamiento y estructura de anomalía.
    """
    image_path = os.path.join(files_dir, "aceite_vegetal.webp")

    with open(image_path, "rb") as f:
        files = {"file": ("aceite_vegetal.webp", f, "image/webp")}
        response = client.post("/api/v1/capture/image", files=files)

    assert response.status_code == 200, f"Error en captura de imagen OCR: {response.json()}"
    data = response.json()
    
    assert "conteo" in data
    assert "anomaly" in data
    conteo = data["conteo"]
    assert conteo["id"] > 0
    assert isinstance(conteo["producto_nombre"], str)
    assert isinstance(conteo["cantidad_contada"], (int, float))
    assert conteo["fuente"] == "imagen"


def test_capture_rejects_empty_file(client: TestClient):
    """Verifica que los endpoints rechacen archivos vacíos (0 bytes)."""
    files = {"file": ("archivo_vacio.mp3", b"", "audio/mpeg")}
    response = client.post("/api/v1/capture/audio", files=files)
    assert response.status_code == 400
    assert "vacío" in response.json()["detail"].lower()


def test_capture_rejects_unsupported_media_type(client: TestClient):
    """Verifica que los endpoints rechacen extensiones/MIME no soportados (ej: .exe, .txt)."""
    files = {"file": ("documento.txt", b"Texto plano no soportado", "text/plain")}
    response = client.post("/api/v1/capture/audio", files=files)
    assert response.status_code == 415
    assert "no soportado" in response.json()["detail"].lower()
