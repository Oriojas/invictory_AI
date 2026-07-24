import { useQueue } from "../offline/QueueProvider.jsx";

const TIPO_ICON = { audio: "🎙️", imagen: "📷" };

function fmt(ts) {
  return new Date(ts).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
}

export default function PendingScreen() {
  const { items, online, syncing, sync, removeQueued } = useQueue();

  return (
    <div className="screen">
      <div>
        <div className="screen-title">Pendientes de sincronizar</div>
        <div className="screen-subtitle">
          {online ? "Con conexión" : "Sin conexión"} · {items.length} en cola
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">✅</span>
          No hay capturas pendientes.
        </div>
      ) : (
        <>
          <button className="action-btn cta" onClick={sync} disabled={!online || syncing}>
            {syncing ? "Sincronizando…" : online ? "🔄 Sincronizar ahora" : "Sin conexión"}
          </button>

          <div className="list">
            {items.map((it) => (
              <div className="list-item" key={it.id}>
                <span className="li-icon">{TIPO_ICON[it.tipo] || "✏️"}</span>
                <div className="li-body">
                  <div className="li-title">{it.tipo === "audio" ? "Dictado de voz" : "Foto de inventario"}</div>
                  <div className="li-sub">{fmt(it.createdAt)}</div>
                  {it.estado === "error" && it.lastError && (
                    <div className="li-sub" style={{ color: "var(--color-alert-red)" }}>
                      {it.lastError}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span className={`queue-badge ${it.estado}`}>
                    {it.estado === "enviando" ? "enviando…" : it.estado}
                  </span>
                  {it.estado !== "enviando" && (
                    <button className="link-btn" onClick={() => removeQueued(it.id)}>
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
