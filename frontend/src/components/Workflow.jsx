import React from 'react';
import { IconMobile, IconBrain, IconDashboard } from './Icons.jsx';
import { useInView } from '../hooks/useInView.js';

export default function Workflow() {
  const [ref, isInView] = useInView({ threshold: 0.15 });

  const steps = [
    {
      num: '01',
      title: 'Interacción con la Mini app',
      icon: <IconMobile size={28} color="#0067b1" />,
      desc: 'En la mini app el operario podrá interactuar para hacer la carga de información por dictado de voz o captura de foto y la verificación en tiempo real.',
      image: '/clean_step1.jpg',
      stagger: 'motion-stagger-1'
    },
    {
      num: '02',
      title: 'Validación por IA & Alerta de Anomalías',
      icon: <IconBrain size={28} color="#0067b1" />,
      desc: 'La IA traduce expresiones coloquiales al catálogo ERP exacto y audita las cantidades contra el stock histórico. Si detecta descuadres, alerta al instante.',
      image: '/clean_step2.jpg',
      stagger: 'motion-stagger-2'
    },
    {
      num: '03',
      title: 'Analítica Ejecutiva & Reportes PDF',
      icon: <IconDashboard size={28} color="#0067b1" />,
      desc: 'Gerencia y auditores visualizan métricas de precisión en vivo, realizan preguntas al asistente inteligente y exportan informes certificados.',
      image: '/clean_step3.jpg',
      stagger: 'motion-stagger-3'
    }
  ];

  return (
    <section id="workflow-section" ref={ref} style={{
      maxWidth: '1280px',
      margin: '60px auto',
      padding: '0 24px'
    }}>
      <div className={`motion-reveal ${isInView ? 'is-visible' : ''}`} style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#111827', letterSpacing: '-0.5px' }}>
          Cómo Funciona en 3 Simples Pasos
        </h2>
        <p style={{ color: '#575756', marginTop: '8px', fontWeight: 500, fontSize: '16px', maxWidth: '650px', margin: '8px auto 0 auto' }}>
          Del dictado o fotografía en la bodega a la validación automática, prevención de mermas y auditoría ejecutiva.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {steps.map((step) => (
          <div key={step.num} className={`corporate-card motion-card-interactive motion-reveal ${step.stagger} ${isInView ? 'is-visible' : ''}`} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #c1c6d3',
            position: 'relative'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: '#f0f6fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {step.icon}
                </div>
                <span style={{
                  backgroundColor: '#0067b1',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px'
                }}>
                  PASO {step.num}
                </span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '10px', color: '#0067b1' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#575756', lineHeight: 1.6, marginBottom: '16px' }}>
                {step.desc}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '14px',
              padding: '6px 0'
            }}>
              <img
                src={step.image}
                alt={step.title}
                style={{
                  height: '84px',
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  mixBlendMode: 'multiply'
                }}
              />
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
