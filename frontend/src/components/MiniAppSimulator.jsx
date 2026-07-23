import React, { useState } from 'react';
import { captureAudio, captureImage } from '../services/api.js';

export default function MiniAppSimulator({ onCaptureSuccess }) {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const simulateAudio = async () => {
    setLoading(true);
    setIsError(false);
    setStatusMsg('🎙️ Procesando audio simulado con OpenAI Whisper & DeepSeek...');

    try {
      const dummyBlob = new Blob(["Simulación de audio de voz dictado: 15 cazuelas de 16 onzas en almacén de suministros"], { type: "audio/wav" });
      const res = await captureAudio(dummyBlob, "simulacion_voz.wav");

      if (res.ok) {
        setStatusMsg('✅ Audio procesado exitosamente y guardado en la BD');
      } else {
        setIsError(true);
        const detail = res.data?.detail || `HTTP ${res.status}`;
        setStatusMsg(`⚠️ El backend rechazó la captura: ${detail}`);
      }
    } catch (e) {
      setIsError(true);
      setStatusMsg(`⚠️ Error de conexión con el backend: ${e.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => {
        onCaptureSuccess();
      }, 1500);
    }
  };

  const simulateImage = async () => {
    setLoading(true);
    setIsError(false);
    setStatusMsg('📸 Ejecutando OCR en imagen con OpenAI Vision (detail=high)...');

    try {
      const dummyBlob = new Blob(["Simulación de imagen OCR: 18 cintas sellamiento"], { type: "image/webp" });
      const res = await captureImage(dummyBlob, "simulacion_ocr.webp");

      if (res.ok) {
        setStatusMsg('✅ Imagen analizada exitosamente por OCR detail=high');
      } else {
        setIsError(true);
        const detail = res.data?.detail || `HTTP ${res.status}`;
        setStatusMsg(`⚠️ El backend rechazó el OCR: ${detail}`);
      }
    } catch (e) {
      setIsError(true);
      setStatusMsg(`⚠️ Error de conexión con el backend: ${e.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => {
        onCaptureSuccess();
      }, 1500);
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
            Simula entradas por voz u OCR para ver cómo se actualiza el reporte de descuadres en tiempo real.
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
          backgroundColor: isError ? '#FFDAD6' : '#e9edff',
          color: isError ? '#E30613' : '#00427b',
          fontWeight: 700,
          borderRadius: '6px',
          fontSize: '13px',
          border: isError ? '1px solid #E30613' : '1px solid #b4d1ff'
        }}>
          {statusMsg}
        </div>
      )}
    </div>
  );
}
