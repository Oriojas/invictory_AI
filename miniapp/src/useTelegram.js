import { useEffect, useState } from "react";

/**
 * Envuelve window.Telegram.WebApp (inyectado por telegram-web-app.js).
 * Funciona también fuera de Telegram (navegador local) devolviendo tg=null.
 */
export function useTelegram() {
  const [tg, setTg] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (!wa) {
      // El script telegram-web-app.js no cargó (demo sin red o abierto fuera de Telegram).
      // Degradamos de forma intencional a "modo navegador" en vez de fallar en silencio.
      console.warn(
        "[useTelegram] window.Telegram.WebApp no disponible — modo navegador, sin funciones de Telegram."
      );
      setReady(true);
      return;
    }
    wa.ready();
    wa.expand();
    setTg(wa);
    setReady(true);
  }, []);

  return {
    tg,
    isTelegram: !!tg, // false = corriendo en navegador normal
    ready, // el intento de init ya terminó (con o sin Telegram)
    user: tg?.initDataUnsafe?.user ?? null,
    // initData es el string firmado; el backend puede validarlo con el bot token (pendiente de coordinar).
    initData: tg?.initData ?? "",
    haptic: tg?.HapticFeedback ?? null,
  };
}
