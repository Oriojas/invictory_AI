import { useEffect, useState } from "react";
import { API_BASE, reseedDemo } from "../api.js";

export default function SettingsScreen({ user, isTelegram, onReseeded }) {
  const [online, setOnline] = useState(null); // null | true | false
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(`${API_BASE}/`)
      .then((r) => alive && setOnline(r.ok))
      .catch(() => alive && setOnline(false));
    return () => {
      alive = false;
    };
  }, []);

  async function handleReseed() {
    setSeeding(true);
    setSeedMsg(null);
    try {
      await reseedDemo();
      setSeedMsg({ ok: true, text: "Datos de demo repoblados." });
      onReseeded?.();
    } catch (e) {
      setSeedMsg({ ok: false, text: e.message });
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="screen">
      <div>
        <div className="screen-title">Ajustes</div>
        <div className="screen-subtitle">Configuración y utilidades de demo</div>
      </div>

      <div className="card">
        <div className="section-label" style={{ margin: "0 0 4px" }}>
          Cuenta
        </div>
        <div className="settings-row">
          <span className="sr-label">Operario</span>
          <span className="sr-value">
            {user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "Modo navegador"}
          </span>
        </div>
        <div className="settings-row">
          <span className="sr-label">Entorno</span>
          <span className="sr-value">{isTelegram ? "Telegram" : "Navegador"}</span>
        </div>
      </div>

      <div className="card">
        <div className="section-label" style={{ margin: "0 0 4px" }}>
          Conexión
        </div>
        <div className="settings-row">
          <span className="sr-label">Backend</span>
          <span className="sr-value">{API_BASE}</span>
        </div>
        <div className="settings-row">
          <span className="sr-label">Estado</span>
          <span className="sr-value">
            <span className={`dot-status ${online ? "ok" : "off"}`} />
            {online == null ? "Verificando…" : online ? "En línea" : "Sin conexión"}
          </span>
        </div>
      </div>

      <div className="card">
        <div className="section-label" style={{ margin: "0 0 8px" }}>
          Datos de demo
        </div>
        <p className="description" style={{ marginBottom: 12 }}>
          Repuebla el catálogo ERP y los conteos de ejemplo (útil para reiniciar la demostración).
        </p>
        <button className="action-btn secondary" onClick={handleReseed} disabled={seeding}>
          {seeding ? "Repoblando…" : "↻ Re-sembrar datos demo"}
        </button>
        {seedMsg && (
          <p
            style={{
              marginTop: 10,
              fontSize: 13,
              color: seedMsg.ok ? "var(--color-success)" : "var(--color-alert-red)",
            }}
          >
            {seedMsg.ok ? "✓ " : "⚠️ "}
            {seedMsg.text}
          </p>
        )}
      </div>

      <div className="card">
        <div className="settings-row">
          <span className="sr-label">Versión</span>
          <span className="sr-value">Invictory_AI · 0.1.0</span>
        </div>
        <div className="settings-row">
          <span className="sr-label">Reto</span>
          <span className="sr-value">Colsubsidio x 30X · Hotelería</span>
        </div>
      </div>
    </div>
  );
}
