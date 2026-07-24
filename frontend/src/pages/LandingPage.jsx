import React from 'react';
import Hero from '../components/Hero.jsx';
import Workflow from '../components/Workflow.jsx';
import Footer from '../components/Footer.jsx';
import { IconDownload, IconFileText } from '../components/Icons.jsx';
import GridBackground from '../components/GridBackground.jsx';

export default function LandingPage({ onGoToDashboard }) {
  const metrics = [
    { value: '80%', label: 'Ahorro de Tiempo', desc: 'Reducción drástica en tiempos de toma de inventario físico' },
    { value: '100%', label: 'Precisión Digital', desc: 'Eliminación completa de errores de tipeo y hojas de papel' },
    { value: '0%', label: 'Mermas No Explicadas', desc: 'Alertas preventivas de descuadres antes de guardar' },
    { value: '< 1 seg', label: 'Respuesta Inmediata', desc: 'Auditoría en tiempo real en cada conteo' }
  ];

  const enterpriseFeatures = [
    {
      title: '🔒 Seguridad & Privacidad Enterprise',
      desc: 'Encriptación de extremo a extremo, control de acceso basado en roles y cumplimiento estricto con normativas de protección de datos.'
    },
    {
      title: '🔄 Integración Transparente con ERPs',
      desc: 'Conexión lista con SAP, Oracle, Microsoft Dynamics y bases de datos corporativas a través de APIs REST seguras.'
    },
    {
      title: '📱 Operatividad Móvil & Cola Diferida (Offline Queue)',
      desc: 'Funciona en dispositivos móviles (iOS, Android, Tablets). En áreas sin señal, los audios y fotos se guardan en cola local y se procesan automáticamente al recuperar cobertura.'
    }

  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <GridBackground />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {/* 1. Hero Principal con Animación Minimalista estilo Trazo */}
        <Hero onGoToDashboard={onGoToDashboard} />

        {/* 2. Franja de Métricas de Impacto Comercial (Social Proof & ROI) en Azul Colsubsidio */}
        <section style={{
          maxWidth: '1280px',
          margin: '40px auto',
          padding: '0 24px'
        }}>
          <div style={{
            backgroundColor: '#0067b1', // Azul Colsubsidio Pantone 2196 C
            borderRadius: '16px',
            padding: '40px 32px',
            color: '#FFFFFF',
            boxShadow: '0 12px 32px rgba(0, 103, 177, 0.2)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
            textAlign: 'center'
          }}>
            {metrics.map((m, idx) => (
              <div key={idx} style={{ borderRight: idx < metrics.length - 1 ? '1px solid rgba(255,255,255,0.18)' : 'none', padding: '0 12px' }}>
                <div style={{ fontSize: '40px', fontWeight: 900, color: '#ffd000', marginBottom: '4px' }}>
                  {m.value}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '13px', color: '#f0f6fa', lineHeight: 1.4 }}>
                  {m.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Flujo en 3 Simples Pasos (Con Interacción con la Mini app) */}
        <Workflow />

        {/* 4. Sección de Garantía Enterprise & Confianza Corporativa */}
        <section style={{ maxWidth: '1280px', margin: '60px auto 40px auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#111827', letterSpacing: '-0.5px' }}>
              Diseñado para la Escala y Exigencia Corporativa
            </h2>
            <p style={{ color: '#575756', fontWeight: 500, fontSize: '16px', marginTop: '8px' }}>
              Infraestructura sólida, segura y compatible con los estándares de grandes cadenas de consumo y hotelería.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {enterpriseFeatures.map((f, i) => (
              <div key={i} className="corporate-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', borderRadius: '12px' }}>
                <h3 style={{ color: '#0067b1', fontSize: '18px', fontWeight: 800, marginBottom: '12px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#575756', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Comercial Final con Botón de Descarga del Manual de Adopción */}
          <div style={{
            textAlign: 'center',
            marginTop: '56px',
            backgroundColor: '#FFFFFF',
            padding: '48px 32px',
            borderRadius: '16px',
            border: '1px solid #c1c6d3',
            boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#111827', marginBottom: '12px' }}>
              ¿Listo para transformar el control de tus almacenes?
            </h3>
            <p style={{ fontSize: '16px', color: '#575756', marginBottom: '28px', maxWidth: '640px', margin: '0 auto 28px auto' }}>
              Explora la demostración interactiva con datos reales o descarga la guía operativa completa para equipos en campo.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={onGoToDashboard}
                className="corporate-btn"
                style={{
                  backgroundColor: '#0067b1',
                  padding: '18px 36px',
                  fontSize: '15px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                🔥 Abrir Demo Interactivo
              </button>

              <a
                href="/Manual_Operativo_Adopcion_Colsubsidio.pdf"
                download="Manual_Operativo_Adopcion_Colsubsidio.pdf"
                className="corporate-btn corporate-btn-yellow"
                style={{
                  backgroundColor: '#ffd000',
                  color: '#111827',
                  padding: '18px 32px',
                  fontSize: '15px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none'
                }}
              >
                <IconDownload size={20} color="#111827" />
                Descargar Manual de Adopción (PDF)
              </a>


            </div>
          </div>
        </section>
      </main>

      {/* Footer Corporativo con Logos de Colsubsidio y 30X */}
      <Footer />
      </div>
    </div>
  );
}




