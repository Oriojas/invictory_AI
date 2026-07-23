import React from 'react';

export default function Workflow() {
  const steps = [
    {
      num: '01',
      title: 'Telegram Mini App (Voz & Foto)',
      icon: '📱',
      desc: 'El operario dicta un audio de voz o toma una foto del empaque/estantería desde Telegram sin planillas de papel.'
    },
    {
      num: '02',
      title: 'IA Multimodal & Conciliación ERP',
      icon: '🧠',
      desc: 'OpenAI Whisper (STT) y DeepSeek Vision (detail=high) extraen datos e inyectan el catálogo ERP para conciliar semánticamente jerga de bodega.'
    },
    {
      num: '03',
      title: 'Detección de Anomalías Pre-Guardado',
      icon: '🚨',
      desc: 'FastAPI compara la cantidad reportada contra el stock histórico. Si la desviación supera el umbral, genera una alerta y exige confirmación antes de guardar.'
    },
    {
      num: '04',
      title: 'Dashboard & Agente DeepSeek LLM',
      icon: '🎯',
      desc: 'Visualización de descuadres en tiempo real con KPIs Bento Grid y consultas en lenguaje natural mediante Function Calling sobre PostgreSQL.'
    }
  ];

  return (
    <section id="workflow-section" style={{
      maxWidth: '1200px',
      margin: '50px auto',
      padding: '0 20px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 900, color: '#111827', letterSpacing: '-0.5px' }}>
          Flujo de Captura Inteligente & Detección de Anomalías
        </h2>
        <p style={{ color: '#414751', marginTop: '6px', fontWeight: 500, fontSize: '15px' }}>
          Del dictado o foto en bodega a la validación semántica, prevención de errores y analítica en tiempo real.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {steps.map((step) => (
          <div key={step.num} className="corporate-card" style={{ position: 'relative', backgroundColor: '#FFFFFF' }}>
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: '#0059a3',
              color: '#FFFFFF',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontFamily: "'Geist', monospace"
            }}>
              PASO {step.num}
            </div>

            <div style={{ fontSize: '36px', marginBottom: '14px' }}>{step.icon}</div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px', color: '#00427b' }}>{step.title}</h3>
            <p style={{ fontSize: '13px', color: '#414751', lineHeight: 1.5, margin: 0 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
