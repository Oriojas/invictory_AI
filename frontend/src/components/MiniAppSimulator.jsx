import React, { useState } from 'react';

export default function MiniAppSimulator({ onCaptureSuccess }) {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const API_BASE = 'http://localhost:8080';

  const simulateAudio = async () => {
    setLoading(true);
    setStatusMsg('🎙️ Procesando audio simulado ("15 cazuelas en almacén de suministros") con OpenAI Whisper & DeepSeek...');

    try {
      const formData = new FormData();
      const dummyBlob = new Blob(["audio dummy stream"], { type: "audio/mp3" });
      formData.append("file", dummyBlob, "simulacion_voz.mp3");

      const res = await fetch(`${API_BASE}/api/v1/capture/audio`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        setStatusMsg('✅ Audio procesado y guardado en la BD');
      } else {
        setStatusMsg('ℹ️ Modo Demo: Conteo de voz registrado');
      }
    } catch (e) {
      setStatusMsg('ℹ️ Simulación de voz ejecutada (FastAPI Demo)');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatusMsg('');
        onCaptureSuccess();
      }, 1200);
    }
  };

  const simulateImage = async () => {
    setLoading(true);
    setStatusMsg('📸 Ejecutando OCR en imagen con DeepSeek Vision (detail=high)...');

    try {
      const formData = new FormData();
      const dummyBlob = new Blob(["image dummy bytes"], { type: "image/jpeg" });
      formData.append("file", dummyBlob, "simulacion_ocr.jpg");

      const res = await fetch(`${API_BASE}/api/v1/capture/image`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        setStatusMsg('✅ Imagen analizada por OCR detail=high');
      } else {
        setStatusMsg('ℹ️ Modo Demo: Conteo OCR de imagen registrado');
      }
    } catch (e) {
      setStatusMsg('ℹ️ Simulación de OCR ejecutada (FastAPI Demo)');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatusMsg('');
        onCaptureSuccess();
      }, 1200);
    }
  };

  return (
    <div className="corporate-card" style={{ marginBottom: '28px', backgroundColor: '#FFFFFF', border: '1px solid #00427b' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-block', backgroundColor: '#FDD000', color: '#111827', fontWeight: 800, fontSize: '11px', padding: '3px 8px', borderRadius: '4px', marginBottom: '4px' }}>
            PRUEBA EN VIVO
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#00427b' }}>
            ⚡ Simulación de Captura (Telegram MiniApp)
          </h3>
          <p style={{ fontSize: '13px', color: '#414751', marginTop: '2px' }}>
            Simula entradas por voz u OCR para ver cómo se actualiza el reporte de descuadres.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={simulateAudio}
            disabled={loading}
            className="corporate-btn"
            style={{ fontSize: '13px', padding: '10px 18px' }}
          >
            🎙️ Simular Conteo por Voz
          </button>
          <button
            onClick={simulateImage}
            disabled={loading}
            className="corporate-btn corporate-btn-yellow"
            style={{ fontSize: '13px', padding: '10px 18px' }}
          >
            📸 Simular Conteo por Foto OCR
          </button>
        </div>
      </div>

      {statusMsg && (
        <div style={{
          marginTop: '16px',
          padding: '10px 14px',
          backgroundColor: '#e9edff',
          color: '#00427b',
          fontWeight: 700,
          borderRadius: '6px',
          fontSize: '13px',
          border: '1px solid #b4d1ff'
        }}>
          {statusMsg}
        </div>
      )}
    </div>
  );
}
