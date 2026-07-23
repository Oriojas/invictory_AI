import React from 'react';
import Hero from '../components/Hero.jsx';
import Workflow from '../components/Workflow.jsx';

export default function LandingPage({ onGoToDashboard }) {
  return (
    <div style={{ paddingBottom: '80px', backgroundColor: '#F8F7F2', minHeight: '100vh' }}>
      <Hero onGoToDashboard={onGoToDashboard} />
      <Workflow />

      {/* Sección Opciones de Diseño Stitch (docs/DESIGN .md) */}
      <section style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
            Enfoques de Diseño Stitch (StitchMCP)
          </h2>
          <p style={{ color: '#414751', fontWeight: 500, fontSize: '16px', marginTop: '6px' }}>
            Tres conceptos de experiencia visual integrados según el Corporate Innovation Framework.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="corporate-card">
            <h3 style={{ color: '#00427b', fontSize: '18px', fontWeight: 800, marginBottom: '10px' }}>
              🚀 Innovación Tecnológica
            </h3>
            <p style={{ fontSize: '14px', color: '#414751', lineHeight: 1.6 }}>
              Enfocado en mostrar la arquitectura multimodal: OpenAI Whisper para voz y DeepSeek Vision (detail: high) para OCR.
            </p>
          </div>

          <div className="corporate-card">
            <h3 style={{ color: '#00427b', fontSize: '18px', fontWeight: 800, marginBottom: '10px' }}>
              ⚡ Eficiencia Operativa
            </h3>
            <p style={{ fontSize: '14px', color: '#414751', lineHeight: 1.6 }}>
              Diseñado para operarios de bodega hoteleros. Reducción drástica del uso de hojas de papel y disminución del 80% del tiempo de toma.
            </p>
          </div>

          <div className="corporate-card">
            <h3 style={{ color: '#00427b', fontSize: '18px', fontWeight: 800, marginBottom: '10px' }}>
              📊 Resultados y ROI
            </h3>
            <p style={{ fontSize: '14px', color: '#414751', lineHeight: 1.6 }}>
              Orientado a auditores y directores de hotelería para ver descuadres en tiempo real y evitar fugas de inventario.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <button onClick={onGoToDashboard} className="corporate-btn" style={{ padding: '18px 36px', fontSize: '16px' }}>
            🔥 Abrir Dashboard MVP con Datos Reales de Colsubsidio
          </button>
        </div>
      </section>
    </div>
  );
}
