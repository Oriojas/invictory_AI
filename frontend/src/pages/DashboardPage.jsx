import React, { useState, useEffect } from 'react';
import BentoGridKPI from '../components/BentoGridKPI.jsx';
import DiscrepancyTable from '../components/DiscrepancyTable.jsx';
import SplitViewDashboard from '../components/SplitViewDashboard.jsx';
import MiniAppSimulator from '../components/MiniAppSimulator.jsx';
import { fetchDiscrepancies as getDiscrepanciesAPI, seedInventory as seedInventoryAPI } from '../services/api.js';
import { DEMO_SUMMARY } from '../mocks/demoSummary.js';
import { IconDashboard, IconRefresh, IconCheck, IconAlert } from '../components/Icons.jsx';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [variant, setVariant] = useState('OPERATIVO'); // 'EJECUTIVO' | 'OPERATIVO' | 'HIBRIDO'
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [apiConnected, setApiConnected] = useState(true);

  const loadDiscrepancies = async () => {
    setLoading(true);
    try {
      const data = await getDiscrepanciesAPI();
      setSummary(data);
      setApiConnected(true);
    } catch (err) {
      console.warn('API no alcanzada, cargando datos mock estáticos de demostración:', err);
      setApiConnected(false);
      setSummary(DEMO_SUMMARY);
    } finally {
      setLoading(false);
    }
  };

  const reseedDatabase = async () => {
    try {
      await seedInventoryAPI();
      await loadDiscrepancies();
    } catch (e) {
      console.error('Fallo al restablecer la base de datos:', e);
      setApiConnected(false);
    }
  };

  useEffect(() => {
    loadDiscrepancies();
  }, []);

  return (
    <div style={{ backgroundColor: '#F8F7F2', minHeight: '100vh', padding: '24px 20px 60px 20px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Control Bar de Variantes Stitch (Action Blue) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          backgroundColor: '#00427b',
          color: '#FFFFFF',
          padding: '18px 24px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0, 66, 123, 0.15)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IconDashboard size={24} color="#FDD000" />
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF' }}>
                Dashboard MVP (Reto Hotelería)
              </h2>
              <span style={{
                fontSize: '11px',
                backgroundColor: apiConnected ? '#28A745' : '#E30613',
                color: '#FFFFFF',
                padding: '4px 10px',
                borderRadius: '4px',
                fontWeight: 800,
                fontFamily: "'Geist', monospace",
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {apiConnected ? <IconCheck size={12} color="#FFFFFF" /> : <IconAlert size={12} color="#FFFFFF" />}
                {apiConnected ? 'API Online' : 'Modo Demo'}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#b4d1ff', marginTop: '2px', fontWeight: 500 }}>
              Inspección de Descuadres entre Stock del ERP y Conteo Físico IA
            </p>
          </div>

          {/* Selector de Variantes UI Stitch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#b4d1ff', fontWeight: 700, textTransform: 'uppercase' }}>Variantes Stitch:</span>
            <button
              onClick={() => setVariant('EJECUTIVO')}
              style={{
                backgroundColor: variant === 'EJECUTIVO' ? '#FDD000' : '#0059a3',
                color: variant === 'EJECUTIVO' ? '#111827' : '#FFFFFF',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              1. Ejecutivo (Bento)
            </button>
            <button
              onClick={() => setVariant('OPERATIVO')}
              style={{
                backgroundColor: variant === 'OPERATIVO' ? '#FDD000' : '#0059a3',
                color: variant === 'OPERATIVO' ? '#111827' : '#FFFFFF',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              2. Operativo (Tabla)
            </button>
            <button
              onClick={() => setVariant('HIBRIDO')}
              style={{
                backgroundColor: variant === 'HIBRIDO' ? '#FDD000' : '#0059a3',
                color: variant === 'HIBRIDO' ? '#111827' : '#FFFFFF',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              3. Híbrido (Split)
            </button>
            <button
              onClick={reseedDatabase}
              className="corporate-btn corporate-btn-yellow"
              style={{ padding: '8px 14px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <IconRefresh size={14} color="#111827" /> Restablecer 12 SKUs
            </button>
          </div>
        </div>

        {/* Componente Simulador MiniApp */}
        <MiniAppSimulator onCaptureSuccess={loadDiscrepancies} />

        {loading ? (
          <div className="corporate-card" style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: '#00427b' }}>Cargando reporte de descuadres...</h3>
          </div>
        ) : (
          <>
            {variant === 'EJECUTIVO' && (
              <>
                <BentoGridKPI summary={summary} />
                <DiscrepancyTable
                  items={summary?.items_descuadrados}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  summary={summary}
                />
              </>
            )}

            {variant === 'OPERATIVO' && (
              <>
                <DiscrepancyTable
                  items={summary?.items_descuadrados}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                />
              </>
            )}

            {variant === 'HIBRIDO' && (
              <>
                <BentoGridKPI summary={summary} />
                <SplitViewDashboard summary={summary} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
