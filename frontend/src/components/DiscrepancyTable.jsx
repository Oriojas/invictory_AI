import React from 'react';
import { IconList, IconMic, IconCamera, IconPackage } from './Icons.jsx';

export default function DiscrepancyTable({ items, filterStatus, setFilterStatus }) {
  if (!items) return null;

  const filtered = items.filter(item => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'DESCUADRES') return item.estado !== 'COINCIDE';
    return item.estado === filterStatus;
  });

  return (
    <div className="corporate-card" style={{ padding: '0', overflow: 'hidden' }}>
      {/* Header & Filtros */}
      <div style={{
        padding: '20px 24px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #c1c6d3',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', backgroundColor: '#f1f3ff', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
            <IconList size={22} color="#00427b" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#00427b' }}>
              Inspección de Descuadres en Tiempo Real
            </h3>
            <p style={{ fontSize: '13px', color: '#414751', marginTop: '2px' }}>
              Comparación directa entre Stock ERP vs Conteo Físico Capturado por la IA
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'DESCUADRES', 'SOBRANTE', 'FALTANTE', 'COINCIDE'].map(mode => (
            <button
              key={mode}
              onClick={() => setFilterStatus(mode)}
              style={{
                backgroundColor: filterStatus === mode ? '#00427b' : '#f1f3ff',
                color: filterStatus === mode ? '#FFFFFF' : '#00427b',
                border: '1px solid #c1c6d3',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Geist', monospace"
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Productos */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#00427b', color: '#FFFFFF', borderBottom: '2px solid #001c3a' }}>
              <th style={{ padding: '14px 16px', fontFamily: "'Geist', monospace", fontSize: '12px', textTransform: 'uppercase' }}>SKU</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Artículo / Insumo</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Bodega</th>
              <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', textTransform: 'uppercase' }}>Stock ERP</th>
              <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', textTransform: 'uppercase' }}>Conteo IA</th>
              <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', textTransform: 'uppercase' }}>Diferencia</th>
              <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase' }}>Estado</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Fuente</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => {
              const isDiscrepant = item.estado !== 'COINCIDE';
              return (
                <tr
                  key={item.sku}
                  style={{
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#f9f9ff',
                    borderBottom: '1px solid #e1e8fd'
                  }}
                >
                  <td className="font-geist" style={{ padding: '14px 16px', fontWeight: 700, color: '#00427b' }}>
                    {item.sku}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#111827' }}>
                    {item.articulo}
                    <span style={{ fontSize: '12px', color: '#727782', marginLeft: '6px' }}>({item.unidad})</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#414751' }}>{item.bodega}</td>
                  <td className="font-geist" style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                    {item.cantidad_sistema}
                  </td>
                  <td className="font-geist" style={{
                    padding: '14px 16px',
                    textAlign: 'right',
                    fontWeight: 800,
                    fontSize: '15px',
                    color: isDiscrepant ? '#00427b' : '#111827'
                  }}>
                    {item.cantidad_fisica}
                  </td>
                  <td className="font-geist" style={{
                    padding: '14px 16px',
                    textAlign: 'right',
                    fontWeight: 800,
                    fontSize: '15px',
                    color: item.diferencia > 0 ? '#28A745' : item.diferencia < 0 ? '#E30613' : '#727782'
                  }}>
                    {item.diferencia > 0 ? `+${item.diferencia}` : item.diferencia}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span className={`badge-geist badge-${item.estado.toLowerCase()}`}>
                      {item.estado}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#727782' }}>
                    {item.ultima_fuente === 'audio' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <IconMic size={14} color="#00427b" /> Voz (Whisper)
                      </span>
                    ) : item.ultima_fuente === 'imagen' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <IconCamera size={14} color="#0059A3" /> Foto (DeepSeek)
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <IconPackage size={14} color="#727782" /> ERP
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
