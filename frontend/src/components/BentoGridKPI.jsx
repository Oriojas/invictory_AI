import React from 'react';
import { IconPackage, IconBot, IconAlert, IconCheck } from './Icons.jsx';

export default function BentoGridKPI({ summary }) {
  if (!summary) return null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
      marginBottom: '28px'
    }}>
      {/* Card 1: SKUs Monitoreados */}
      <div className="corporate-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="font-geist" style={{ fontSize: '12px', fontWeight: 600, color: '#727782', letterSpacing: '0.5px' }}>
            SKUS EN ERP (SISTEMA)
          </span>
          <div style={{ padding: '6px', backgroundColor: '#f1f3ff', borderRadius: '6px', display: 'flex' }}>
            <IconPackage size={20} color="#00427b" />
          </div>
        </div>
        <div className="font-geist" style={{ fontSize: '42px', fontWeight: 800, color: '#00427b', marginTop: '8px' }}>
          {summary.total_skus}
        </div>
        <div style={{ fontSize: '12px', color: '#414751', marginTop: '4px', fontWeight: 500 }}>
          En {summary.total_bodegas} bodegas de hotelería
        </div>
      </div>

      {/* Card 2: Conteos Procesados IA */}
      <div className="corporate-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="font-geist" style={{ fontSize: '12px', fontWeight: 600, color: '#727782', letterSpacing: '0.5px' }}>
            CONTEOS PROCESADOS IA
          </span>
          <div style={{ padding: '6px', backgroundColor: '#f1f3ff', borderRadius: '6px', display: 'flex' }}>
            <IconBot size={20} color="#0059A3" />
          </div>
        </div>
        <div className="font-geist" style={{ fontSize: '42px', fontWeight: 800, color: '#111827', marginTop: '8px' }}>
          {summary.total_conteos_ia}
        </div>
        <div style={{ fontSize: '12px', color: '#414751', marginTop: '4px', fontWeight: 500 }}>
          Voz (Whisper) & OCR (DeepSeek)
        </div>
      </div>

      {/* Card 3: Descuadres (Alerta Red) */}
      <div className="corporate-card" style={{ borderColor: summary.total_descuadres > 0 ? '#E30613' : '#c1c6d3', borderLeftWidth: '4px', borderLeftColor: '#E30613' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="font-geist" style={{ fontSize: '12px', fontWeight: 700, color: '#E30613', letterSpacing: '0.5px' }}>
            DESCUADRES DETECTADOS
          </span>
          <div style={{ padding: '6px', backgroundColor: '#FFDAD6', borderRadius: '6px', display: 'flex' }}>
            <IconAlert size={20} color="#E30613" />
          </div>
        </div>
        <div className="font-geist" style={{ fontSize: '42px', fontWeight: 800, color: '#E30613', marginTop: '8px' }}>
          {summary.total_descuadres}
        </div>
        <div style={{ fontSize: '12px', color: '#E30613', marginTop: '4px', fontWeight: 700 }}>
          {summary.total_descuadres > 0 ? '¡Requiere auditoría antes de guardar!' : 'Sin descuadres reportados'}
        </div>
      </div>

      {/* Card 4: Precisión % */}
      <div className="corporate-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="font-geist" style={{ fontSize: '12px', fontWeight: 600, color: '#727782', letterSpacing: '0.5px' }}>
            PRECISIÓN GLOBAL IA
          </span>
          <div style={{ padding: '6px', backgroundColor: '#e6f4ea', borderRadius: '6px', display: 'flex' }}>
            <IconCheck size={20} color="#28A745" />
          </div>
        </div>
        <div className="font-geist" style={{ fontSize: '42px', fontWeight: 800, color: '#28A745', marginTop: '8px' }}>
          {summary.porcentaje_precision}%
        </div>
        <div style={{ fontSize: '12px', color: '#414751', marginTop: '4px', fontWeight: 500 }}>
          Coincidencia exactas ERP vs IA
        </div>
      </div>
    </div>
  );
}
