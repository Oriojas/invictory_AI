import { useQueue } from "../offline/QueueProvider.jsx";

// Banner de estado de conexión / cola. Se oculta si hay red y no hay pendientes.
export default function OfflineBanner({ onGoPending }) {
  const { online, pendingCount, syncing } = useQueue();
  if (online && pendingCount === 0) return null;

  if (!online) {
    return (
      <div className="offline-banner warn" onClick={onGoPending} role="button">
        <span>📴</span>
        <span>Sin conexión — las capturas se guardarán en cola</span>
      </div>
    );
  }

  // Online con pendientes:
  return (
    <div className="offline-banner info" onClick={onGoPending} role="button">
      <span>🔄</span>
      <span>
        {syncing ? "Sincronizando…" : `${pendingCount} captura(s) pendiente(s) de sincronizar`}
      </span>
      <span className="offline-cta">Ver ›</span>
    </div>
  );
}
