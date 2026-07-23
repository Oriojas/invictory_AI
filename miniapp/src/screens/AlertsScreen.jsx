import { useEffect, useState } from "react";
import { getDiscrepancies } from "../api.js";

export default function AlertsScreen({ reloadToken }) {
  const [disc, setDisc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getDiscrepancies()
      .then((d) => {
        if (!alive) return;
        setDisc(d);
        setError(null);
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [reloadToken]);

  const items = (disc?.items_descuadrados || []).filter((it) => it.estado !== "COINCIDE");

  return (
    <div className="screen">
      <div>
        <div className="screen-title">Alertas de stock</div>
        <div className="screen-subtitle">
          Descuadres entre el conteo físico y el ERP
          {disc ? ` · precisión ${disc.porcentaje_precision}%` : ""}
        </div>
      </div>

      {loading ? (
        <div className="center-loading">
          <div className="spinner" /> Cargando alertas…
        </div>
      ) : error ? (
        <div className="status-card error">
          <p>⚠️ {error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">✅</span>
          Sin descuadres. Todo coincide con el ERP.
        </div>
      ) : (
        <div className="list">
          {items.map((it) => {
            const neg = it.diferencia < 0;
            const estadoClass = it.estado === "FALTANTE" ? "faltante" : "sobrante";
            return (
              <div className="list-item" key={it.sku}>
                <span className="li-icon">{neg ? "📉" : "📈"}</span>
                <div className="li-body">
                  <div className="li-title">{it.articulo}</div>
                  <div className="li-sub">
                    {it.bodega} · ERP {it.cantidad_sistema} vs físico {it.cantidad_fisica} {it.unidad}
                  </div>
                  <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                    <span className={`li-badge ${estadoClass}`}>{it.estado}</span>
                    {it.alerta_prioridad !== "NINGUNA" && (
                      <span className={`li-badge ${it.alerta_prioridad.toLowerCase()}`}>
                        {it.alerta_prioridad}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`li-delta ${neg ? "neg" : "pos"}`}>
                  {neg ? "" : "+"}
                  {it.diferencia}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
