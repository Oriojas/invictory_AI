// Alerta de anomalía reutilizable (captura y alertas). Recibe el objeto `anomaly` del backend.
export default function AnomalyAlert({ anomaly }) {
  if (!anomaly?.is_anomaly) return null;
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
