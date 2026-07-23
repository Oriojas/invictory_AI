import React from 'react';
import { IconDashboard, IconAlert } from './Icons.jsx';

export default function SplitViewDashboard({ summary }) {
  if (!summary) return null;

  // Agrupar descuadres por Bodega
  const warehouseStats = summary.items_descuadrados.reduce((acc, item) => {
    const b = item.bodega;
    if (!acc[b]) acc[b] = { total: 0, descuadres: 0 };
    acc[b].total += 1;
    if (item.estado !== 'COINCIDE') acc[b].descuadres += 1;
    return acc;
  }, {});

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '24px'
    }}>
      {/* Panel Izquierdo: Analítica de Bodegas */}
      <div className="corporate-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '6px', backgroundColor: '#f1f3ff', borderRadius: '6px', display: 'flex' }}>
            <IconDashboard size={20} color="#00427b" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#00427b', margin: 0 }}>
            Estado por Bodega Hotelera
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(warehouseStats).map(([bodegaName, stats]) => (
            <div key={bodegaName} style={{
              backgroundColor: '#F8F7F2',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #c1c6d3'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>{bodegaName}</span>
                <span className="font-geist" style={{
                  fontSize: '13px',
                  color: stats.descuadres > 0 ? '#E30613' : '#28A745',
                  fontWeight: 700
                }}>
                  {stats.descuadres} Descuadres
                </span>
              </div>
              <div style={{ backgroundColor: '#e1e8fd', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  backgroundColor: stats.descuadres > 0 ? '#E30613' : '#28A745',
                  width: `${(stats.descuadres / stats.total) * 100}%`,
                  height: '100%'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel Derecho: Lista de Descuadres Críticos */}
      <div className="corporate-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '6px', backgroundColor: '#FFDAD6', borderRadius: '6px', display: 'flex' }}>
            <IconAlert size={20} color="#E30613" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>
            Descuadres Críticos Detectados por IA
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {summary.items_descuadrados.filter(i => i.estado !== 'COINCIDE').map(item => (
            <div key={item.sku} style={{
              backgroundColor: '#f1f3ff',
              padding: '14px 16px',
              borderRadius: '8px',
              borderLeft: item.estado === 'SOBRANTE' ? '5px solid #28A745' : '5px solid #E30613',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>{item.articulo}</div>
                <div style={{ fontSize: '12px', color: '#727782', marginTop: '2px' }}>
                  SKU: {item.sku} | ERP: {item.cantidad_sistema} vs IA: {item.cantidad_fisica}
                </div>
              </div>
              <div className="font-geist" style={{
                fontWeight: 800,
                fontSize: '16px',
                color: item.estado === 'SOBRANTE' ? '#28A745' : '#E30613'
              }}>
                {item.diferencia > 0 ? `+${item.diferencia}` : item.diferencia}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
