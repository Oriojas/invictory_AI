import React from 'react';

export default function Hero({ onGoToDashboard }) {
  const differentiators = [
    {
      icon: '📱',
      badge: 'CERO PAPEL',
      title: 'Captura Natural (Voz & Foto)',
      desc: 'Telegram Mini App para operarios con OpenAI Whisper STT y DeepSeek Vision OCR detail: high desde tabletas corporativas.'
    },
    {
      icon: '🚨',
      badge: 'ALERTA EN TIEMPO REAL',
      title: 'Detección de Anomalías Pre-Guardado',
      desc: 'Alertas inmediatas y confirmación requerida si el conteo dictado (ej: 90 unidades) se desvía del historial ERP (9 unidades).'
    },
    {
      icon: '🧠',
      badge: 'MATCHING ERP',
      title: 'Conciliación Semántica LLM',
      desc: 'Traducción inteligente de jerga de bodega ("ollas grandes") al SKU exacto del ERP ("Caldero Recort Tapa 50x60 cm").'
    },
    {
      icon: '📐',
      badge: 'SOPORTE DE MERMAS',
      title: 'Manejo de Fracciones',
      desc: 'Interpretación de productos abiertos y porciones ("medio kilo", "botella a la mitad", 0.5/0.25) convertidos a float.'
    },
    {
      icon: '📊',
      badge: 'PUNTOS EXTRA',
      title: 'Dashboard & Agente DeepSeek',
      desc: 'KPIs Bento, auditoría de descuadres y Agente LLM con Function Calling sobre PostgreSQL para preguntas en lenguaje natural.'
    }
  ];

  return (
    <section style={{
      maxWidth: '1200px',
      margin: '30px auto 40px auto',
      padding: '0 20px',
      textAlign: 'center'
    }}>
      {/* Badge Superior con Accent Yellow */}
      <div style={{
        display: 'inline-block',
        backgroundColor: '#FDD000',
        color: '#111827',
        fontWeight: 800,
        fontSize: '12px',
        padding: '6px 18px',
        borderRadius: '20px',
        marginBottom: '20px',
        border: '1px solid #c1c6d3',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        textTransform: 'uppercase',
        letterSpacing: '0.8px'
      }}>
        🏆 Solución Ganadora Reto Hotelería | Hackathon Colsubsidio x 30X
      </div>

      {/* Titular Principal en Action Blue & Manrope */}
      <h1 style={{
        fontSize: '44px',
        fontWeight: 900,
        lineHeight: 1.15,
        letterSpacing: '-1.2px',
        marginBottom: '20px',
        color: '#111827'
      }}>
        Captura Inteligente de Inventarios <br />
        <span style={{
          color: '#00427b',
          backgroundColor: '#e9edff',
          padding: '4px 16px',
          borderRadius: '8px',
          display: 'inline-block',
          marginTop: '8px'
        }}>
          IA Multimodal · Anomalías Pre-Guardado · Conciliación ERP
        </span>
      </h1>

      {/* Descripción Ejecutiva */}
      <p style={{
        fontSize: '17px',
        color: '#414751',
        maxWidth: '880px',
        margin: '0 auto 32px auto',
        lineHeight: 1.6,
        fontWeight: 500
      }}>
        Eliminamos la captura manual en planillas de papel. Operarios en bodega dictan voz o toman fotos en la <strong>Telegram Mini App</strong>; nuestro backend FastAPI valida el stock histórico en tiempo real, <strong>alerta antes de guardar anomalías</strong> y concilia semánticamente cualquier término contra el catálogo ERP de Colsubsidio.
      </p>

      {/* Grid de Diferenciadores Clave para Ganar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '36px',
        textAlign: 'left'
      }}>
        {differentiators.map((d, i) => (
          <div key={i} className="corporate-card" style={{
            padding: '16px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #c1c6d3',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '26px' }}>{d.icon}</span>
                <span style={{
                  fontSize: '9px',
                  fontWeight: 900,
                  backgroundColor: '#00427b',
                  color: '#FFFFFF',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  fontFamily: "'Geist', monospace",
                  textTransform: 'uppercase'
                }}>
                  {d.badge}
                </span>
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#00427b', marginBottom: '6px' }}>
                {d.title}
              </h4>
              <p style={{ fontSize: '12px', color: '#414751', lineHeight: '1.45', margin: 0 }}>
                {d.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Acciones Principales */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button onClick={onGoToDashboard} className="corporate-btn" style={{ padding: '14px 28px', fontSize: '15px' }}>
          📊 Abrir Dashboard & Detección de Anomalías
        </button>
        <a
          href="#workflow-section"
          className="corporate-btn corporate-btn-yellow"
          style={{ padding: '14px 28px', fontSize: '15px' }}
        >
          ⚡ Ver Arquitectura del Sistema
        </a>
      </div>
    </section>
  );
}
