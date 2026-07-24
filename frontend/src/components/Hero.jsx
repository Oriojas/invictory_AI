import React from 'react';
import { IconMobile, IconAlert, IconBrain, IconRuler, IconDashboard, IconZap, IconList } from './Icons.jsx';
import HeroAnimation from './HeroAnimation.jsx';

export default function Hero({ onGoToDashboard }) {
  const differentiators = [
    {
      icon: <IconMobile size={26} color="#0067b1" />,
      badge: 'REDUCCIÓN DE USO PAPEL',
      title: 'Captura Ágil Multimodal',
      desc: 'El personal de bodega dicta por voz o toma fotos de productos desde la Telegram Mini App.'
    },
    {
      icon: <IconAlert size={26} color="#E30613" />,
      badge: 'ANTI-PÉRDIDAS',
      title: 'Detección de Anomalías Pre-Guardado',
      desc: 'El sistema valida el conteo con el inventario teórico y alerta al instante ante cualquier discrepancia.'
    },
    {
      icon: <IconBrain size={26} color="#0067b1" />,
      badge: 'CONCILIACIÓN ERP',
      title: 'Traducción Semántica de Productos',
      desc: 'Traduce jerga cotidiana de bodega o nombres regionales al SKU exacto del catálogo oficial.'
    },
    {
      icon: <IconRuler size={26} color="#575756" />,
      badge: 'PRECISIÓN TOTAL',
      title: 'Manejo de Fracciones y Mermas',
      desc: 'Calcula automáticamente porciones, mermas y envases abiertos ("medio kilo", "botella a tres cuartos").'
    },
    {
      icon: <IconList size={26} color="#0067b1" />,
      badge: 'RESPALDO DIGITAL',
      title: 'Reportes PDF Certificados',
      desc: 'Exportación inmediata de informes de auditoría en PDF estructurados para firmas corporativas.'
    },
    {
      icon: <IconDashboard size={26} color="#0067b1" />,
      badge: 'CONTROL 24/7',
      title: 'Panel Ejecutivo & Asistente IA',
      desc: 'Visualización de descuadres en tiempo real con asistente virtual para responder preguntas sobre stock.'
    }
  ];

  return (
    <section style={{
      maxWidth: '1280px',
      margin: '20px auto 40px auto',
      padding: '0 24px',
      position: 'relative'
    }}>
      {/* Sección Superior: Titular & Descripción */}
      <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 36px auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#ffd000', // Amarillo Colsubsidio
          color: '#111827',
          fontWeight: 800,
          fontSize: '12px',
          padding: '6px 18px',
          borderRadius: '20px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          textTransform: 'uppercase',
          letterSpacing: '0.8px'
        }}>
          ⚡ Control Inteligente de Inventarios & Bodegas
        </div>

        <h1 style={{
          fontSize: '44px',
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: '-1.2px',
          marginBottom: '20px',
          color: '#111827'
        }}>
          Toma de inventarios en minutos, <br />
          <span style={{
            color: '#0067b1', // Azul Colsubsidio
            backgroundColor: '#f0f6fa',
            padding: '2px 16px',
            borderRadius: '8px',
            display: 'inline-block',
            marginTop: '6px'
          }}>
            0% errores manuales y control de mermas
          </span>
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#575756', // Grafito Colsubsidio
          lineHeight: 1.6,
          fontWeight: 500,
          marginBottom: '32px'
        }}>
          Elimina las planillas de papel. Invictory_AI permite a tu equipo registrar existencias hablando o tomando fotos. Nuestra IA audita las cifras en tiempo real y <strong>previene descuadres financieros antes de guardar el conteo</strong>.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={onGoToDashboard}
            className="corporate-btn"
            style={{
              backgroundColor: '#0067b1', // Azul Colsubsidio
              padding: '16px 36px',
              fontSize: '15px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <IconDashboard size={20} color="#FFFFFF" />
            Probar Demo Interactivo
          </button>
          <a
            href="#workflow-section"
            className="corporate-btn corporate-btn-yellow"
            style={{
              backgroundColor: '#ffd000', // Amarillo Colsubsidio
              color: '#111827',
              padding: '16px 30px',
              fontSize: '15px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <IconZap size={20} color="#111827" />
            Ver Cómo Funciona
          </a>
        </div>
      </div>

      {/* Animación SVG Fluida & Organizada (Invictory AI Workflow Animation) */}
      <div style={{ marginBottom: '48px' }}>
        <HeroAnimation />
      </div>


      {/* Grid de 6 Tarjetas de Beneficios */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        textAlign: 'left'
      }}>
        {differentiators.map((d, i) => (
          <div key={i} className="corporate-card" style={{
            padding: '22px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #c1c6d3',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 6px rgba(0, 103, 177, 0.04)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{
                  padding: '10px',
                  backgroundColor: '#f0f6fa',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {d.icon}
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  backgroundColor: '#0067b1', // Azul Colsubsidio
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  {d.badge}
                </span>
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0067b1', marginBottom: '8px' }}>
                {d.title}
              </h4>
              <p style={{ fontSize: '13px', color: '#575756', lineHeight: '1.5', margin: 0 }}>
                {d.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


