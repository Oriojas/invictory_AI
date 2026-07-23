import { useEffect, useRef, useState } from "react";
import { captureImage } from "../api.js";

// Captura/sube una foto del insumo y la envía al backend (OCR Vision).
export default function PhotoCapture({ onProcessing, onResult, onError }) {
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);
  const selectedRef = useRef(null);

  // Libera el object URL anterior al cambiar de foto y al desmontar (evita fuga de memoria).
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    selectedRef.current = file;
    setPreview(URL.createObjectURL(file));
  }

  async function send() {
    if (!selectedRef.current) return;
    onProcessing("📸 Procesando imagen con OCR de alta precisión…");
    try {
      onResult(await captureImage(selectedRef.current));
    } catch (err) {
      onError(`Error al procesar imagen: ${err.message}`);
    }
  }

  return (
    <section className="card capture-card">
      <h2>Capturar foto de productos</h2>
      <p className="description">
        Toma una foto clara de la etiqueta, caja o estantería del insumo. La IA extraerá texto y cantidades.
      </p>
      <label className="action-btn photo-label">
        <span className="btn-icon">📸</span> Tomar / subir foto
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={onSelect}
        />
      </label>
      {preview && (
        <div className="preview-container">
          <img className="image-preview" src={preview} alt="Vista previa del inventario" />
          <button className="action-btn send" onClick={send}>
            🚀 Enviar imagen a IA
          </button>
        </div>
      )}
    </section>
  );
}
