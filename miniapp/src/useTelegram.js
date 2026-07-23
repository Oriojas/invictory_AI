import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Envuelve window.Telegram.WebApp (inyectado por telegram-web-app.js).
 * Funciona también fuera de Telegram (navegador local) devolviendo tg=null.
 */
export function useTelegram() {
  const [tg, setTg] = useState(null);
  const [ready, setReady] = useState(false);
  const backCbRef = useRef(null);

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

  // Muestra el BackButton nativo de Telegram y registra su callback.
  const showBackButton = useCallback(
    (cb) => {
      if (!tg?.BackButton) return;
      if (backCbRef.current) tg.BackButton.offClick(backCbRef.current);
      backCbRef.current = cb;
      tg.BackButton.onClick(cb);
      tg.BackButton.show();
    },
    [tg]
  );

  const hideBackButton = useCallback(() => {
    if (!tg?.BackButton) return;
    if (backCbRef.current) tg.BackButton.offClick(backCbRef.current);
    backCbRef.current = null;
    tg.BackButton.hide();
  }, [tg]);

  const haptic = useCallback(
    (type = "impact", style = "light") => {
      const hf = tg?.HapticFeedback;
      if (!hf) return;
      if (type === "notification") hf.notificationOccurred?.(style);
      else hf.impactOccurred?.(style);
    },
    [tg]
  );

  // El script telegram-web-app.js SIEMPRE crea window.Telegram.WebApp (aun fuera de Telegram),
  // así que !!tg no basta: fuera de Telegram platform es "unknown" e initData es "".
  const inTelegram = !!tg && tg.platform !== "unknown" && !!tg.initData;

  return {
    tg,
    isTelegram: inTelegram, // false = corriendo en navegador normal
    ready, // el intento de init ya terminó (con o sin Telegram)
    user: tg?.initDataUnsafe?.user ?? null,
    // initData es el string firmado; el backend puede validarlo con el bot token (pendiente de coordinar).
    initData: tg?.initData ?? "",
    showBackButton,
    hideBackButton,
    haptic,
  };
}
