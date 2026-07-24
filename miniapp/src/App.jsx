import { useCallback, useEffect, useState } from "react";
import { useTelegram } from "./useTelegram.js";
import BottomNav from "./nav/BottomNav.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import CaptureScreen from "./screens/CaptureScreen.jsx";
import AlertsScreen from "./screens/AlertsScreen.jsx";
import SettingsScreen from "./screens/SettingsScreen.jsx";
import { getDiscrepancies } from "./api.js";

export default function App() {
  const { user, isTelegram, showBackButton, hideBackButton, haptic } = useTelegram();
  const [tab, setTab] = useState("inicio");
  const [reloadToken, setReloadToken] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);

  // Refresca datos dependientes del backend (Inicio, Alertas, punto del nav).
  const refresh = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let alive = true;
    getDiscrepancies()
      .then((d) => alive && setAlertsCount(d.total_descuadres || 0))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [reloadToken]);

  function changeTab(next) {
    haptic?.("impact", "light");
    setTab(next);
  }

  return (
    <div className="app-shell">
      {tab === "inicio" && (
        <HomeScreen user={user} onStartCapture={() => setTab("captura")} reloadToken={reloadToken} />
      )}
      {tab === "captura" && (
        <CaptureScreen
          showBackButton={showBackButton}
          hideBackButton={hideBackButton}
          haptic={haptic}
          onGoAlerts={() => setTab("alertas")}
          onCounted={refresh}
        />
      )}
      {tab === "alertas" && <AlertsScreen reloadToken={reloadToken} />}
      {tab === "ajustes" && (
        <SettingsScreen user={user} isTelegram={isTelegram} onReseeded={refresh} />
      )}

      <BottomNav active={tab} onChange={changeTab} alertsCount={alertsCount} />
    </div>
  );
}
