import AnomalyAlert from "../components/AnomalyAlert.jsx";

// Muestra el mapeo semántico (entrada → SKU del ERP) + el conteo capturado real,
// y los CTA cosméticos de confirmación (el conteo ya quedó guardado por el backend).
export default function ReconciliationView({ conteo, anomaly, onConfirm, onRecount }) {
  const fuente = (conteo.fuente || "manual").toUpperCase();
  const confianzaPct = conteo.confianza != null ? `${Math.round(conteo.confianza * 100)}%` : "—";

  return (
    <>
      <div>
        <div className="screen-title">Conciliación ERP</div>
        <div className="screen-subtitle">Mapeo semántico de la captura contra el catálogo</div>
      </div>

      <div className="card">
        <div className="map-flow">
          <div className="map-box">
            <div className="map-kicker">Entrada reconocida ({fuente})</div>
            <div className="map-value">{conteo.producto_nombre || "SIN IDENTIFICAR"}</div>
          </div>
          <span className="map-arrow">↓</span>
          <div className="map-box sku">
            <div className="map-kicker">Conciliado con ERP · SKU {conteo.producto_id || "—"}</div>
            <div className="map-value">{conteo.producto_nombre || "SIN IDENTIFICAR"}</div>
            <div className="map-kicker" style={{ marginTop: 4 }}>
              {conteo.bodega || "Sin bodega"}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-label" style={{ margin: "0 0 8px" }}>
          Conteo capturado
        </div>
        <div className="result-row">
          <span className="label">Producto:</span>
          <span className="value">{conteo.producto_nombre || "-"}</span>
        </div>
        <div className="result-row">
          <span className="label">Cantidad:</span>
          <span className="value highlight">{conteo.cantidad_contada} und</span>
        </div>
        <div className="result-row">
          <span className="label">Bodega:</span>
          <span className="value">{conteo.bodega || "-"}</span>
        </div>
        <div className="result-row">
          <span className="label">Fuente:</span>
          <span className="value chip">{fuente}</span>
        </div>
        <div className="result-row">
          <span className="label">Confianza:</span>
          <span className="value">{confianzaPct}</span>
        </div>
        <div className="result-row">
          <span className="label">Observaciones:</span>
          <p className="value-obs">{conteo.observaciones || "Sin observaciones"}</p>
        </div>
      </div>

      <AnomalyAlert anomaly={anomaly} />

      <div className="btn-row">
        <button className="action-btn cta" onClick={onConfirm}>
          ✓ Registrar conteo
        </button>
        <button className="action-btn ghost" onClick={onRecount}>
          ↺ Re-contar
        </button>
      </div>
    </>
  );
}
