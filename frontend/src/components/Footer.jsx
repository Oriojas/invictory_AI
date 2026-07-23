import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#575756', // Grafito Colsubsidio (Pantone Cool Gray 11 C)
      color: '#FFFFFF',
      padding: '48px 24px 32px 24px',
      marginTop: 'auto',
      borderTop: '4px solid #ffd000' // Acento Amarillo Colsubsidio
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        textAlign: 'center'
      }}>
        {/* Contenedor de Logos Oficiales */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          flexWrap: 'wrap'
        }}>
          <img
            src="/logo_colsubsidio.png"
            alt="Logo Colsubsidio"
            style={{ height: '44px', objectFit: 'contain' }}
          />
          <div style={{ width: '1px', height: '36px', backgroundColor: 'rgba(255, 255, 255, 0.25)' }} />
          <img
            src="/logo_30x.png"
            alt="Logo 30X"
            style={{ height: '38px', objectFit: 'contain' }}
          />
        </div>

        {/* Texto Descriptivo e Institucional */}
        <p style={{
          fontSize: '14px',
          color: '#e2e8f0',
          maxWidth: '640px',
          lineHeight: 1.6,
          margin: 0
        }}>
          <strong>Invictory_AI</strong> — Solución de Inteligencia Artificial Multimodal desarrollada para el <strong>Reto de Hotelería Colsubsidio x 30X</strong>. Automatización de inventarios, prevención de mermas y auditoría en tiempo real.
        </p>

        {/* Copyright & Derechos */}
        <div style={{
          fontSize: '12px',
          color: '#a0aec0',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          paddingTop: '20px',
          width: '100%',
          maxWidth: '800px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <span>© {new Date().getFullYear()} Colsubsidio & 30X. Todos los derechos reservados.</span>
          <span>Desarrollado para el Reto de Hotelería</span>
        </div>
      </div>
    </footer>
  );
}
