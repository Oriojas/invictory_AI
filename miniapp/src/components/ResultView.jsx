// Muestra el conteo capturado y, si aplica, la alerta de anomalía (CaptureResponse).
export default function ResultView({ conteo, anomaly, onReset }) {
  return (
    <>
      {anomaly?.is_anomaly && <AnomalyAlert anomaly={anomaly} />}
      <div className="result-card">
        <div className="result-header">
          <h3>✅ Conteo capturado</h3>
        </div>
        <div className="result-body">
          <Row label="Producto" value={conteo.producto_nombre || "-"} />
          <Row label="Cantidad" value={`${conteo.cantidad_contada} unidades`} highlight />
          <Row label="Bodega" value={conteo.bodega || "-"} />
          <Row label="Fuente" value={(conteo.fuente || "manual").toUpperCase()} chip />
          <div className="result-row">
            <span className="label">Observaciones:</span>
            <p className="value-obs">{conteo.observaciones || "Sin observaciones"}</p>
          </div>
        </div>
        <button className="action-btn secondary" onClick={onReset}>
          Hacer nuevo conteo
        </button>
      </div>
    </>
  );
}

function Row({ label, value, highlight, chip }) {
  return (
    <div className="result-row">
      <span className="label">{label}:</span>
      <span className={`value ${highlight ? "highlight" : ""} ${chip ? "chip" : ""}`}>{value}</span>
    </div>
  );
}

function AnomalyAlert({ anomaly }) {
  const critical = anomaly.severity === "CRITICA";
  const icon = critical ? "🚨" : anomaly.severity === "ALTA" ? "⚠️" : "ℹ️";
  return (
    <div className={`anomaly-alert ${critical ? "critical" : "warning"}`}>
      <div className="anomaly-head">
        <span className="anomaly-icon">{icon}</span>
        <strong>
          Anomalía {anomaly.severity} — Desviación del {anomaly.deviation_percent}%
        </strong>
      </div>
      <p className="anomaly-msg">{anomaly.message}</p>
      {anomaly.expected_quantity != null && (
        <div className="anomaly-meta">
          <span>📦 Stock ERP: {anomaly.expected_quantity}</span>
          <span>📊 Desviación: {anomaly.deviation_percent}%</span>
          <span>🔒 {anomaly.requires_confirmation ? "Requiere confirmación" : "Registrado con alerta"}</span>
        </div>
      )}
    </div>
  );
}
