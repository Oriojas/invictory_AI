import React, { useState } from 'react';
import { captureAudio, captureImage } from '../services/api.js';

export default function MiniAppSimulator({ onCaptureSuccess }) {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [anomalyAlert, setAnomalyAlert] = useState(null);

  const handleCaptureResponse = (res) => {
    if (res.ok && res.data) {
      const data = res.data;
      // Nueva estructura CaptureResponse: { conteo, anomaly }
      if (data.anomaly && data.anomaly.is_anomaly) {
        setAnomalyAlert(data.anomaly);
        setStatusMsg(`⚠️ ${data.anomaly.message}`);
        setIsError(true);
      } else {
        setAnomalyAlert(null);
        const conteo = data.conteo || data;
        setStatusMsg(`✅ Conteo registrado: ${conteo.producto_nombre} → ${conteo.cantidad_contada} (${conteo.fuente})`);
      }
    } else {
      setIsError(true);
      const detail = res.data?.detail || `HTTP ${res.status}`;
      setStatusMsg(`⚠️ El backend rechazó la captura: ${detail}`);
    }
  };

  const simulateAudio = async () => {
    setLoading(true);
    setIsError(false);
    setAnomalyAlert(null);
    setStatusMsg('🎙️ Procesando audio simulado con OpenAI Whisper & DeepSeek...');

    try {
      const dummyBlob = new Blob(["Simulación de audio de voz dictado: 15 cazuelas de 16 onzas en almacén de suministros"], { type: "audio/wav" });
      const res = await captureAudio(dummyBlob, "simulacion_voz.wav");
      handleCaptureResponse(res);
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
    setAnomalyAlert(null);
    setStatusMsg('📸 Ejecutando OCR en imagen con OpenAI Vision (detail=high)...');

    try {
      const dummyBlob = new Blob(["Simulación de imagen OCR: 18 cintas sellamiento"], { type: "image/webp" });
      const res = await captureImage(dummyBlob, "simulacion_ocr.webp");
      handleCaptureResponse(res);
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

      {/* Alerta de Anomalía en Tiempo Real */}
      {anomalyAlert && anomalyAlert.is_anomaly && (
        <div style={{
          marginTop: '12px',
          padding: '14px 18px',
          backgroundColor: anomalyAlert.severity === 'CRITICA' ? '#FDE8E8' : '#FFF3CD',
          border: `2px solid ${anomalyAlert.severity === 'CRITICA' ? '#E30613' : '#FFC107'}`,
          borderRadius: '8px',
          animation: 'pulse 1.5s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '22px' }}>
              {anomalyAlert.severity === 'CRITICA' ? '🚨' : anomalyAlert.severity === 'ALTA' ? '⚠️' : 'ℹ️'}
            </span>
            <span style={{
              fontWeight: 900,
              fontSize: '14px',
              color: anomalyAlert.severity === 'CRITICA' ? '#E30613' : '#856404',
              textTransform: 'uppercase'
            }}>
              Anomalía {anomalyAlert.severity} — Desviación del {anomalyAlert.deviation_percent}%
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#111827', lineHeight: '1.5', margin: 0 }}>
            {anomalyAlert.message}
          </p>
          {anomalyAlert.expected_quantity !== null && (
            <div style={{
              marginTop: '10px',
              display: 'flex',
              gap: '16px',
              fontSize: '12px',
              fontFamily: "'Geist', monospace",
              fontWeight: 700,
              color: '#414751'
            }}>
              <span>📦 Stock ERP: {anomalyAlert.expected_quantity}</span>
              <span>📊 Desviación: {anomalyAlert.deviation_percent}%</span>
              <span>🔒 {anomalyAlert.requires_confirmation ? 'Requiere confirmación' : 'Registrado con alerta'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
