import re
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.config import settings
from backend.app.database import get_db
from backend.app.models import BodegaStock, ConteoFisico
from backend.app.schemas import CaptureResponse, AnomalyAlert, ConteoFisicoResponse
from backend.app.services.stt_service import process_audio_stt
from backend.app.services.ocr_service import process_image_ocr
from backend.app.services.anomaly_detector import detect_anomaly

router = APIRouter(prefix="/api/v1/capture", tags=["Capture & Multimodal AI"])

def _parse_cantidad(valor) -> float:
    """
    Convierte de forma segura a float lo que devuelva la IA.
    Si devuelve texto como '15 unidades', extrae el número 15.0; si no es interpretable, retorna 0.0.
    """
    if valor is None:
        return 0.0
    try:
        return float(valor)
    except (TypeError, ValueError):
        match = re.search(r"-?\d+(?:[.,]\d+)?", str(valor))
        return float(match.group().replace(",", ".")) if match else 0.0

def _validar_upload(file: UploadFile, contents: bytes, tipos_permitidos: list[str]) -> None:
    """Valida tamaño máximo y tipo MIME de archivo subido."""
    if not contents:
        raise HTTPException(status_code=400, detail="El archivo está vacío.")
    if len(contents) > settings.MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Archivo demasiado grande. El límite máximo es de {settings.MAX_UPLOAD_BYTES // (1024*1024)} MB."
        )
    if file.content_type and file.content_type not in tipos_permitidos:
        ext = (file.filename or "").split(".")[-1].lower()
        valid_exts = [t.split("/")[-1] for t in tipos_permitidos]
        if ext not in valid_exts and ext not in ["mp3", "jpg", "jpeg", "webp", "png", "wav"]:
            raise HTTPException(
                status_code=415,
                detail=f"Tipo '{file.content_type}' no soportado. Permitidos: {', '.join(tipos_permitidos)}"
            )

@router.post("/audio", response_model=CaptureResponse)
def process_audio_capture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Recibe audio enviado desde Telegram MiniApp u operario.
    1. Transcribe con OpenAI Whisper.
    2. Estructura con DeepSeek LLM + catálogo ERP (conciliación semántica).
    3. Detecta anomalías comparando contra stock histórico ANTES de guardar.
    4. Guarda conteo en ConteoFisico y retorna alerta si hay anomalía.
    """
    contents = file.file.read()
    _validar_upload(file, contents, settings.ALLOWED_AUDIO_TYPES)

    res = process_audio_stt(contents, file.filename or "audio_dictado.mp3")
    data = res.get("structured", {})

    producto_nombre = data.get("producto_nombre", "SIN IDENTIFICAR")
    cantidad = _parse_cantidad(data.get("cantidad_contada"))
    bodega = data.get("bodega", "SIN ASIGNAR")
    obs = data.get("observaciones", res.get("raw_text", ""))

    is_fallback = data.get("is_fallback", False) or producto_nombre == "SIN IDENTIFICAR"
    confianza = 0.0 if is_fallback else 0.96

    # Buscar producto en la BD
    stock_item = None
    if producto_nombre != "SIN IDENTIFICAR":
        stock_item = db.query(BodegaStock).filter(
            BodegaStock.articulo.ilike(f"%{producto_nombre}%")
        ).first()

    sku_id = stock_item.id if stock_item else None

    # DETECCIÓN DE ANOMALÍAS: Comparar contra stock histórico ANTES de guardar
    anomaly_result = detect_anomaly(db, producto_nombre, cantidad, bodega, sku_id)

    # Si hay anomalía, agregarla a las observaciones del conteo
    if anomaly_result["is_anomaly"]:
        obs = f"{anomaly_result['message']} | {obs}"

    conteo = ConteoFisico(
        producto_id=sku_id,
        producto_nombre=producto_nombre,
        cantidad_contada=cantidad,
        bodega=bodega,
        fuente="audio",
        confianza=confianza,
        observaciones=obs
    )
    db.add(conteo)
    db.commit()
    db.refresh(conteo)

    return CaptureResponse(
        conteo=ConteoFisicoResponse.model_validate(conteo),
        anomaly=AnomalyAlert(**anomaly_result)
    )


@router.post("/image", response_model=CaptureResponse)
def process_image_capture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Recibe imagen enviada desde Telegram MiniApp u operario.
    1. Ejecuta OCR con OpenAI Vision (detail=high) + catálogo ERP.
    2. Detecta anomalías comparando contra stock histórico ANTES de guardar.
    3. Guarda conteo en ConteoFisico y retorna alerta si hay anomalía.
    """
    contents = file.file.read()
    _validar_upload(file, contents, settings.ALLOWED_IMAGE_TYPES)

    res = process_image_ocr(contents, file.filename or "captura_foto.jpg")
    data = res.get("structured", {})

    producto_nombre = data.get("producto_nombre", "SIN IDENTIFICAR")
    cantidad = _parse_cantidad(data.get("cantidad_contada"))
    bodega = data.get("bodega", "SIN ASIGNAR")
    obs = data.get("observaciones", res.get("raw_text", ""))

    is_fallback = data.get("is_fallback", False) or producto_nombre == "SIN IDENTIFICAR"
    confianza = 0.0 if is_fallback else 0.98

    stock_item = None
    if producto_nombre != "SIN IDENTIFICAR":
        stock_item = db.query(BodegaStock).filter(
            BodegaStock.articulo.ilike(f"%{producto_nombre}%")
        ).first()

    sku_id = stock_item.id if stock_item else None

    # DETECCIÓN DE ANOMALÍAS: Comparar contra stock histórico ANTES de guardar
    anomaly_result = detect_anomaly(db, producto_nombre, cantidad, bodega, sku_id)

    if anomaly_result["is_anomaly"]:
        obs = f"{anomaly_result['message']} | {obs}"

    conteo = ConteoFisico(
        producto_id=sku_id,
        producto_nombre=producto_nombre,
        cantidad_contada=cantidad,
        bodega=bodega,
        fuente="imagen",
        confianza=confianza,
        observaciones=obs
    )
    db.add(conteo)
    db.commit()
    db.refresh(conteo)

    return CaptureResponse(
        conteo=ConteoFisicoResponse.model_validate(conteo),
        anomaly=AnomalyAlert(**anomaly_result)
    )
