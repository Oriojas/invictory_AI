import re
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.config import settings
from backend.app.database import get_db
from backend.app.models import BodegaStock, ConteoFisico
from backend.app.schemas import ConteoFisicoResponse
from backend.app.services.stt_service import process_audio_stt
from backend.app.services.ocr_service import process_image_ocr

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
    # Si content_type está especificado pero no está en la lista de permitidos
    if file.content_type and file.content_type not in tipos_permitidos:
        # Permitir fallback flexible si la extensión es válida
        ext = (file.filename or "").split(".")[-1].lower()
        valid_exts = [t.split("/")[-1] for t in tipos_permitidos]
        if ext not in valid_exts and ext not in ["mp3", "jpg", "jpeg", "webp", "png", "wav"]:
            raise HTTPException(
                status_code=415,
                detail=f"Tipo '{file.content_type}' no soportado. Permitidos: {', '.join(tipos_permitidos)}"
            )

@router.post("/audio", response_model=ConteoFisicoResponse)
def process_audio_capture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Recibe audio enviado desde Telegram MiniApp u operario.
    Ejecución síncrona en threadpool para no bloquear el event loop.
    """
    contents = file.file.read()
    _validar_upload(file, contents, settings.ALLOWED_AUDIO_TYPES)

    res = process_audio_stt(contents, file.filename or "audio_dictado.mp3")
    data = res.get("structured", {})

    producto_nombre = data.get("producto_nombre", "SIN IDENTIFICAR")
    cantidad = _parse_cantidad(data.get("cantidad_contada"))
    bodega = data.get("bodega", "SIN ASIGNAR")
    obs = data.get("observaciones", res.get("raw_text", ""))

    # Si es un fallback heurístico, la confianza es 0.0 para revisión manual
    is_fallback = data.get("is_fallback", False) or producto_nombre == "SIN IDENTIFICAR"
    confianza = 0.0 if is_fallback else 0.96

    # Intentar emparejar producto en la base de datos por similitud de nombre
    stock_item = None
    if producto_nombre != "SIN IDENTIFICAR":
        stock_item = db.query(BodegaStock).filter(
            BodegaStock.articulo.ilike(f"%{producto_nombre}%")
        ).first()

    sku_id = stock_item.id if stock_item else None

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

    return conteo


@router.post("/image", response_model=ConteoFisicoResponse)
def process_image_capture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Recibe imagen enviada desde Telegram MiniApp u operario.
    Ejecución síncrona en threadpool para no bloquear el event loop.
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

    return conteo
