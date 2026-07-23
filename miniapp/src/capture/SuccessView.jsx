import AnomalyAlert from "../components/AnomalyAlert.jsx";

// Confirmación de registro. Refleja el estado REAL: el conteo ya se guardó (id + fecha_conteo).
export default function SuccessView({ conteo, anomaly, onNew, onGoAlerts }) {
  const fecha = conteo.fecha_conteo
    ? new Date(conteo.fecha_conteo).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })
    : "";

  return (
    <>
      <div className="success-wrap">
        <div className="success-check">✓</div>
        <h2>¡Conteo registrado!</h2>
        <p>
          El conteo quedó guardado en el sistema
          {conteo.id != null ? ` (registro #${conteo.id})` : ""}.
        </p>
      </div>

      <div className="card">
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
        {fecha && (
          <div className="result-row">
            <span className="label">Registrado:</span>
            <span className="value">{fecha}</span>
          </div>
        )}
      </div>

      {anomaly?.is_anomaly && <AnomalyAlert anomaly={anomaly} />}

      <div className="btn-row">
        <button className="action-btn cta" onClick={onNew}>
          + Nueva captura
        </button>
        {anomaly?.is_anomaly && (
          <button className="action-btn secondary" onClick={onGoAlerts}>
            Ver en alertas
          </button>
        )}
      </div>
    </>
  );
}
