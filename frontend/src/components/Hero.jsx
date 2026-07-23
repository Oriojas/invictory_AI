import React from 'react';

export default function Hero({ onGoToDashboard }) {
  return (
    <section style={{
      maxWidth: '1200px',
      margin: '40px auto 20px auto',
      padding: '0 20px',
      textAlign: 'center'
    }}>
      {/* Badge Superior con Accent Yellow */}
      <div style={{
        display: 'inline-block',
        backgroundColor: '#FDD000',
        color: '#111827',
        fontWeight: 800,
        fontSize: '13px',
        padding: '8px 20px',
        borderRadius: '20px',
        marginBottom: '24px',
        border: '1px solid #c1c6d3',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        ⚡ Solución Oficial Reto Hotelería | Hackathon Colsubsidio x 30X
      </div>

      {/* Titular Principal en Action Blue & Manrope */}
      <h1 style={{
        fontSize: '48px',
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: '-1.5px',
        marginBottom: '24px',
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
          impulsada por IA Multimodal (Voz & OCR)
        </span>
      </h1>

      {/* Descripción */}
      <p style={{
        fontSize: '18px',
        color: '#414751',
        maxWidth: '850px',
        margin: '0 auto 36px auto',
        lineHeight: 1.6,
        fontWeight: 400
      }}>
        Eliminamos la captura manual en planillas de papel. Operarios de bodega dictan voz o toman fotos en la <strong>Telegram Mini App</strong>; nuestros Agentes de IA extraen datos limpios y detectan descuadres antes de actualizar el ERP sin integraciones costosas.
      </p>

      {/* Acciones Principales */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button onClick={onGoToDashboard} className="corporate-btn" style={{ padding: '16px 32px', fontSize: '15px' }}>
          📊 Abrir Dashboard de Descuadres MVP
        </button>
        <a
          href="#workflow-section"
          className="corporate-btn corporate-btn-yellow"
          style={{ padding: '16px 32px', fontSize: '15px' }}
        >
          ⚡ Ver Arquitectura Multimodal
        </a>
      </div>
    </section>
  );
}
