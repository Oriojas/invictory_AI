from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import BodegaStock, ConteoFisico
from backend.app.schemas import ConteoFisicoResponse
from backend.app.services.stt_service import process_audio_stt
from backend.app.services.ocr_service import process_image_ocr

router = APIRouter(prefix="/api/v1/capture", tags=["Capture & Multimodal AI"])

@router.post("/audio", response_model=ConteoFisicoResponse)
async def process_audio_capture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Recibe audio enviado desde Telegram MiniApp u operario.
    1. Transcribe con OpenAI Whisper (whisper-1).
    2. Extrae JSON estructurado con DeepSeek LLM.
    3. Guarda conteo en ConteoFisico y asocia a BodegaStock.
    """
    contents = await file.read()
    res = process_audio_stt(contents, file.filename or "audio_dictado.mp3")
    data = res.get("structured", {})

    producto_nombre = data.get("producto_nombre", "Insumo Desconocido")
    cantidad = float(data.get("cantidad_contada", 0.0))
    bodega = data.get("bodega", "Stock Almacén Suministros")
    obs = data.get("observaciones", res.get("raw_text", ""))

    # Intentar emparejar producto en la base de datos por similitud de nombre
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
        confianza=0.96,
        observaciones=obs
    )
    db.add(conteo)
    db.commit()
    db.refresh(conteo)

    return conteo


@router.post("/image", response_model=ConteoFisicoResponse)
async def process_image_capture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Recibe imagen enviada desde Telegram MiniApp u operario.
    1. Ejecuta OCR de alta precisión con DeepSeek Vision (detail: high).
    2. Extrae JSON estructurado.
    3. Guarda conteo en ConteoFisico y asocia a BodegaStock.
    """
    contents = await file.read()
    res = process_image_ocr(contents, file.filename or "captura_foto.jpg")
    data = res.get("structured", {})

    producto_nombre = data.get("producto_nombre", "Insumo Desconocido")
    cantidad = float(data.get("cantidad_contada", 0.0))
    bodega = data.get("bodega", "Stock Almacén Suministros")
    obs = data.get("observaciones", res.get("raw_text", ""))

    # Intentar emparejar producto en la base de datos por similitud de nombre
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
        confianza=0.98,
        observaciones=obs
    )
    db.add(conteo)
    db.commit()
    db.refresh(conteo)

    return conteo
