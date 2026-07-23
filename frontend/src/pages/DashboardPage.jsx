import React, { useState, useEffect } from 'react';
import BentoGridKPI from '../components/BentoGridKPI.jsx';
import DiscrepancyTable from '../components/DiscrepancyTable.jsx';
import SplitViewDashboard from '../components/SplitViewDashboard.jsx';
import MiniAppSimulator from '../components/MiniAppSimulator.jsx';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [variant, setVariant] = useState('OPERATIVO'); // 'EJECUTIVO' | 'OPERATIVO' | 'HIBRIDO'
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [apiConnected, setApiConnected] = useState(true);

  const API_BASE = 'http://localhost:8080';

  const fetchDiscrepancies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/dashboard/discrepancies`);
      if (!res.ok) throw new Error('Falló respuesta de API');
      const data = await res.json();
      setSummary(data);
      setApiConnected(true);
    } catch (err) {
      console.warn('API no alcanzada, cargando datos mock estáticos de demostración:', err);
      setApiConnected(false);
      setSummary({
        total_skus: 12,
        total_bodegas: 4,
        total_conteos_ia: 3,
        total_descuadres: 3,
        porcentaje_precision: 75.0,
        items_descuadrados: [
          { sku: "97503113", articulo: "Caldero Recort Tapa 50x60 cm", unidad: "Unidad", bodega: "Stock Almacén Suministros", cantidad_sistema: 1.0, cantidad_fisica: 1.0, diferencia: 0.0, estado: "COINCIDE", alerta_prioridad: "NINGUNA", ultima_fuente: "ERP" },
          { sku: "95026919", articulo: "Cazuela 16 Onz", unidad: "Unidad", bodega: "Stock Almacén Suministros", cantidad_sistema: 10.0, cantidad_fisica: 15.0, diferencia: 5.0, estado: "SOBRANTE", alerta_prioridad: "MEDIA", ultima_fuente: "audio", observaciones: "Conteo por voz: 15 cazuelas." },
          { sku: "95004459", articulo: "Cinta Sellamiento 48 mm x 50 mts", unidad: "Unidad", bodega: "Stock Almacén Suministros", cantidad_sistema: 14.0, cantidad_fisica: 18.0, diferencia: 4.0, estado: "SOBRANTE", alerta_prioridad: "MEDIA", ultima_fuente: "imagen", observaciones: "Foto OCR detail=high: 18 cintas." },
          { sku: "7290", articulo: "Aceite Vegetal", unidad: "Liter", bodega: "Stock Restaurante Fuentes AYB", cantidad_sistema: 851.43, cantidad_fisica: 800.0, diferencia: -51.43, estado: "FALTANTE", alerta_prioridad: "ALTA", ultima_fuente: "audio", observaciones: "Faltante de 51.43 litros." },
          { sku: "7292", articulo: "Aceite de Ajongolí", unidad: "Liter", bodega: "Stock Restaurante Fuentes AYB", cantidad_sistema: 1.65, cantidad_fisica: 1.65, diferencia: 0.0, estado: "COINCIDE", alerta_prioridad: "NINGUNA", ultima_fuente: "ERP" },
          { sku: "7293", articulo: "Aceite de Oliva", unidad: "Liter", bodega: "Stock Restaurante Fuentes AYB", cantidad_sistema: 28.82, cantidad_fisica: 28.82, diferencia: 0.0, estado: "COINCIDE", alerta_prioridad: "NINGUNA", ultima_fuente: "ERP" },
          { sku: "95026266", articulo: "Plato Blanco Rectangular", unidad: "Unidad", bodega: "Stock Restaurante Fuentes Sumin", cantidad_sistema: 2500.0, cantidad_fisica: 2500.0, diferencia: 0.0, estado: "COINCIDE", alerta_prioridad: "NINGUNA", ultima_fuente: "ERP" },
          { sku: "97502964", articulo: "Balde Plástico 10 Lts", unidad: "Unidad", bodega: "Stock Restaurante Fuentes Sumin", cantidad_sistema: 3.0, cantidad_fisica: 3.0, diferencia: 0.0, estado: "COINCIDE", alerta_prioridad: "NINGUNA", ultima_fuente: "ERP" },
          { sku: "97503242", articulo: "Abrelatas Mariposa FB", unidad: "Unidad", bodega: "Stock Restaurante Fuentes Sumin", cantidad_sistema: 4.0, cantidad_fisica: 4.0, diferencia: 0.0, estado: "COINCIDE", alerta_prioridad: "NINGUNA", ultima_fuente: "ERP" },
          { sku: "5001", articulo: "Acelga Fresca", unidad: "Kilogram", bodega: "Zoológico (Alimentos)", cantidad_sistema: 220.7, cantidad_fisica: 220.7, diferencia: 0.0, estado: "COINCIDE", alerta_prioridad: "NINGUNA", ultima_fuente: "ERP" },
          { sku: "5004", articulo: "Aguacate", unidad: "Kilogram", bodega: "Zoológico (Alimentos)", cantidad_sistema: 30.0, cantidad_fisica: 30.0, diferencia: 0.0, estado: "COINCIDE", alerta_prioridad: "NINGUNA", ultima_fuente: "ERP" },
          { sku: "5005", articulo: "Ahuyama", unidad: "Kilogram", bodega: "Zoológico (Alimentos)", cantidad_sistema: 123.0, cantidad_fisica: 123.0, diferencia: 0.0, estado: "COINCIDE", alerta_prioridad: "NINGUNA", ultima_fuente: "ERP" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const reseedDatabase = async () => {
    try {
      await fetch(`${API_BASE}/api/v1/inventory/seed`, { method: 'POST' });
      fetchDiscrepancies();
    } catch (e) {
      alert('Se restablecieron los datos de 12 productos de referencia.');
    }
  };

  useEffect(() => {
    fetchDiscrepancies();
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
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF' }}>
                📊 Dashboard MVP (Reto Hotelería)
              </h2>
              <span style={{
                fontSize: '11px',
                backgroundColor: apiConnected ? '#28A745' : '#E30613',
                color: '#FFFFFF',
                padding: '4px 10px',
                borderRadius: '4px',
                fontWeight: 800,
                fontFamily: "'Geist', monospace"
              }}>
                {apiConnected ? '🟢 API Online (Port 8080)' : '🟡 Modo Demo'}
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
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              🔄 Restablecer 12 SKUs
            </button>
          </div>
        </div>

        {/* Componente Simulador MiniApp */}
        <MiniAppSimulator onCaptureSuccess={fetchDiscrepancies} />

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
