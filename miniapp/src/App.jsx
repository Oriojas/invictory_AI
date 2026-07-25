import { useCallback, useEffect, useState } from "react";
import { useTelegram } from "./useTelegram.js";
import { QueueProvider, useQueue } from "./offline/QueueProvider.jsx";
import BottomNav from "./nav/BottomNav.jsx";
import OfflineBanner from "./components/OfflineBanner.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import CaptureScreen from "./screens/CaptureScreen.jsx";
import AlertsScreen from "./screens/AlertsScreen.jsx";
import SettingsScreen from "./screens/SettingsScreen.jsx";
import PendingScreen from "./screens/PendingScreen.jsx";
import { getDiscrepancies } from "./api.js";

export default function App() {
  return (
    <QueueProvider>
      <AppInner />
    </QueueProvider>
  );
}

function AppInner() {
  const { user, isTelegram, showBackButton, hideBackButton, haptic } = useTelegram();
  const { syncedTick } = useQueue();
  const [tab, setTab] = useState("inicio");
  const [view, setView] = useState(null); // null | "pendientes" (overlay sobre los tabs)
  const [reloadToken, setReloadToken] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);

  const refresh = useCallback(() => setReloadToken((t) => t + 1), []);
  // syncedTick sube cuando la cola procesa con éxito → refresca Inicio/Alertas/contador.
  const combinedToken = reloadToken + syncedTick;

  useEffect(() => {
    let alive = true;
    getDiscrepancies()
      .then((d) => alive && setAlertsCount(d.total_descuadres || 0))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [combinedToken]);

  // BackButton de Telegram para la vista de pendientes (overlay).
  useEffect(() => {
    if (view !== "pendientes") return;
    showBackButton?.(() => setView(null));
    return () => hideBackButton?.();
  }, [view, showBackButton, hideBackButton]);

  function changeTab(next) {
    haptic?.("impact", "light");
    setView(null);
    setTab(next);
  }

  const goPending = () => setView("pendientes");

  return (
    <div className="app-shell">
      <OfflineBanner onGoPending={goPending} />

      {view === "pendientes" ? (
        <PendingScreen />
      ) : (
        <>
          {tab === "inicio" && (
            <HomeScreen
              user={user}
              onStartCapture={() => setTab("captura")}
              onGoPending={goPending}
              reloadToken={combinedToken}
            />
          )}
          {tab === "captura" && (
            <CaptureScreen
              showBackButton={showBackButton}
              hideBackButton={hideBackButton}
              haptic={haptic}
              onGoAlerts={() => setTab("alertas")}
              onGoPending={goPending}
              onCounted={refresh}
            />
          )}
          {tab === "alertas" && <AlertsScreen reloadToken={combinedToken} />}
          {tab === "ajustes" && (
            <SettingsScreen user={user} isTelegram={isTelegram} onReseeded={refresh} />
          )}
        </>
      )}

      <BottomNav active={tab} onChange={changeTab} alertsCount={alertsCount} />
    </div>
  );
}
