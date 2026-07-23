// Ubicación de trabajo. Valor fijo de demo (no hay ubicación por usuario en el backend).
export default function LocationCard({ name = "Bodega Central – Hotel Peñalisa" }) {
  return (
    <div className="location-card">
      <span className="loc-icon">📍</span>
      <div className="loc-body">
        <div className="loc-label">Ubicación actual</div>
        <div className="loc-name">{name}</div>
      </div>
      <span className="loc-chevron">›</span>
    </div>
  );
}
