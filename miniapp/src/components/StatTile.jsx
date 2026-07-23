// Tile de métrica para el dashboard. `alert` lo pinta en rojo (alertas pendientes).
export default function StatTile({ icon, value, label, alert = false, pill = null }) {
  return (
    <div className={`stat-tile ${alert ? "alert" : ""}`}>
      <div className="stat-top">
        <span className="stat-icon">{icon}</span>
        {pill && <span className="stat-pill">{pill}</span>}
      </div>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
