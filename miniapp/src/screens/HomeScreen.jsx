import { useEffect, useState } from "react";
import BrandHeader from "../components/BrandHeader.jsx";
import LocationCard from "../components/LocationCard.jsx";
import StatTile from "../components/StatTile.jsx";
import { getDiscrepancies, getPhysicalCounts } from "../api.js";

function isToday(iso) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

const FUENTE_ICON = { audio: "🎙️", imagen: "📷" };

export default function HomeScreen({ user, onStartCapture, reloadToken }) {
  const [data, setData] = useState(null); // { disc, counts }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([getDiscrepancies(), getPhysicalCounts()])
      .then(([disc, counts]) => {
        if (!alive) return;
        setData({ disc, counts });
        setError(null);
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [reloadToken]);

  const itemsHoy = data ? data.counts.filter((c) => isToday(c.fecha_conteo)).length : 0;
  const alertas = data?.disc?.total_descuadres ?? 0;
  const precision = data?.disc?.porcentaje_precision ?? null;
  const recientes = data ? data.counts.slice(0, 4) : [];

  return (
    <div className="screen">
      <BrandHeader user={user} />
      <LocationCard />

      {error ? (
        <div className="status-card error">
          <p>⚠️ No se pudo cargar el resumen: {error}</p>
        </div>
      ) : (
        <div className="stat-grid">
          <StatTile icon="📦" value={loading ? "…" : itemsHoy} label="Items contados hoy" />
          <StatTile
            icon="🔔"
            value={loading ? "…" : alertas}
            label="Alertas pendientes"
            alert
            pill={alertas > 0 ? "Revisar" : null}
          />
        </div>
      )}

      {precision != null && (
        <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="stat-label">Precisión de inventario</span>
          <span className="stat-value" style={{ fontSize: 22 }}>{precision}%</span>
        </div>
      )}

      <button className="action-btn cta" onClick={onStartCapture}>
        + Nueva toma de inventario
      </button>

      <div className="section-label">Actividad reciente</div>
      {loading ? (
        <div className="center-loading">
          <div className="spinner" /> Cargando…
        </div>
      ) : recientes.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🗒️</span>
          Aún no hay conteos registrados.
        </div>
      ) : (
        <div className="list">
          {recientes.map((c) => (
            <div className="list-item" key={c.id}>
              <span className="li-icon">{FUENTE_ICON[c.fuente] || "✏️"}</span>
              <div className="li-body">
                <div className="li-title">{c.producto_nombre}</div>
                <div className="li-sub">
                  {c.cantidad_contada} und · {c.bodega}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
