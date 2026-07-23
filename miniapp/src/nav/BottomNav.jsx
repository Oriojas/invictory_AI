// Navegación inferior fija de 4 tabs. `alertsCount` pinta un punto rojo sobre Alertas.
const TABS = [
  { id: "inicio", label: "Inicio", icon: "🏠" },
  { id: "captura", label: "Captura", icon: "🎙️" },
  { id: "alertas", label: "Alertas", icon: "🔔" },
  { id: "ajustes", label: "Ajustes", icon: "⚙️" },
];

export default function BottomNav({ active, onChange, alertsCount = 0 }) {
  return (
    <nav className="bottom-nav">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`nav-btn ${active === t.id ? "active" : ""}`}
          onClick={() => onChange(t.id)}
        >
          <span className="nav-icon">{t.icon}</span>
          {t.id === "alertas" && alertsCount > 0 && <span className="nav-dot" />}
          {t.label}
        </button>
      ))}
    </nav>
  );
}
