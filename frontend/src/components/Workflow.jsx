import React from 'react';

export default function Workflow() {
  const steps = [
    {
      num: '01',
      title: 'Telegram Mini App',
      icon: '📱',
      desc: 'El operario dicta un audio de voz o toma una foto del empaque/estantería desde Telegram sin planillas.'
    },
    {
      num: '02',
      title: 'IA Multimodal',
      icon: '🤖',
      desc: 'OpenAI Whisper (whisper-1) transcribe el audio. DeepSeek OCR (detail: high) analiza la imagen.'
    },
    {
      num: '03',
      title: 'Motor de Conciliación',
      icon: '⚡',
      desc: 'FastAPI procesa y compara los datos recibidos contra el stock teórico del ERP (BodegaStock).'
    },
    {
      num: '04',
      title: 'Dashboard de Descuadres',
      icon: '🎯',
      desc: 'El sistema resalta faltantes y sobrantes en tiempo real para auditorías rápidas antes de guardar.'
    }
  ];

  return (
    <section id="workflow-section" style={{
      maxWidth: '1200px',
      margin: '60px auto',
      padding: '0 20px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
          Arquitectura del Proceso de Captura
        </h2>
        <p style={{ color: '#414751', marginTop: '8px', fontWeight: 500, fontSize: '16px' }}>
          Del flujo operativo manual al dato limpio procesado por la Inteligencia Artificial.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px'
      }}>
        {steps.map((step) => (
          <div key={step.num} className="corporate-card" style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: '#0059a3',
              color: '#FFFFFF',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: "'Geist', monospace"
            }}>
              PASO {step.num}
            </div>

            <div style={{ fontSize: '38px', marginBottom: '16px' }}>{step.icon}</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px', color: '#00427b' }}>{step.title}</h3>
            <p style={{ fontSize: '14px', color: '#414751', lineHeight: 1.5 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
