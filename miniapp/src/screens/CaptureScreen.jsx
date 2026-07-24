import { useEffect, useState } from "react";
import VoiceCapture from "../capture/VoiceCapture.jsx";
import PhotoCapture from "../capture/PhotoCapture.jsx";
import ReconciliationView from "../capture/ReconciliationView.jsx";
import SuccessView from "../capture/SuccessView.jsx";
import { useQueue } from "../offline/QueueProvider.jsx";
import { captureAudio, captureImage, isNetworkError } from "../api.js";

// Orquesta el flujo: capturar → (online) conciliar → exito · (offline/fallo de red) encolado.
export default function CaptureScreen({ showBackButton, hideBackButton, haptic, onGoAlerts, onGoPending, onCounted }) {
  const { online, enqueue } = useQueue();
  const [step, setStep] = useState("capturar"); // capturar | conciliar | exito | encolado
  const [mode, setMode] = useState("voice"); // voice | photo
  const [status, setStatus] = useState(null); // { message, error }
  const [result, setResult] = useState(null); // CaptureResponse

  // BackButton de Telegram para volver dentro del sub-flujo.
  useEffect(() => {
    if (step === "capturar") {
      hideBackButton?.();
    } else {
      showBackButton?.(() => newCapture());
    }
    return () => hideBackButton?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, showBackButton, hideBackButton]);

  function sendMedia(media) {
    if (media.tipo === "audio") return captureAudio(media.blob, media.filename);
    const file = new File([media.blob], media.filename, { type: media.blob.type || "image/jpeg" });
    return captureImage(file);
  }

  async function handleCapture(media) {
    // Offline: encolar directo, sin intentar la red.
    if (!online) {
      await enqueue(media);
      setStep("encolado");
      haptic?.("notification", "warning");
      return;
    }
    setStatus({ message: media.tipo === "audio" ? "🎙️ Analizando voz…" : "📸 Procesando imagen…", error: false });
    try {
      const res = await sendMedia(media);
      setStatus(null);
      setResult(res);
      setStep("conciliar");
      haptic?.("notification", res?.anomaly?.is_anomaly ? "warning" : "success");
      onCounted?.();
    } catch (err) {
      // Se cayó la red durante el envío: encolar como fallback.
      if (isNetworkError(err)) {
        await enqueue(media);
        setStatus(null);
        setStep("encolado");
        haptic?.("notification", "warning");
      } else {
        setStatus({ message: `Error al procesar: ${err.message}`, error: true });
      }
    }
  }

  function handleError(message) {
    setStatus({ message, error: true });
  }

  function newCapture() {
    setResult(null);
    setStatus(null);
    setStep("capturar");
  }

  if (step === "conciliar" && result) {
    return (
      <div className="screen">
        <ReconciliationView
          conteo={result.conteo || result}
          anomaly={result.anomaly}
          onConfirm={() => setStep("exito")}
          onRecount={newCapture}
        />
      </div>
    );
  }

  if (step === "exito" && result) {
    return (
      <div className="screen">
        <SuccessView
          conteo={result.conteo || result}
          anomaly={result.anomaly}
          onNew={newCapture}
          onGoAlerts={onGoAlerts}
        />
      </div>
    );
  }

  if (step === "encolado") {
    return (
      <div className="screen">
        <div className="success-wrap">
          <div className="success-check queued">⏳</div>
          <h2>Guardado en cola</h2>
          <p>
            Sin conexión ahora mismo. La captura se guardó localmente y se procesará
            automáticamente apenas vuelva el Wi-Fi o los datos.
          </p>
        </div>
        <div className="btn-row">
          <button className="action-btn cta" onClick={newCapture}>
            + Nueva captura
          </button>
          <button className="action-btn secondary" onClick={onGoPending}>
            Ver pendientes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div>
        <div className="screen-title">Captura multimodal</div>
        <div className="screen-subtitle">
          Registra el conteo físico por voz o foto{!online ? " · sin conexión (se encolará)" : ""}
        </div>
      </div>

      <div className="mode-tabs">
        <button className={`tab-btn ${mode === "voice" ? "active" : ""}`} onClick={() => setMode("voice")}>
          🎙️ Dictado por voz
        </button>
        <button className={`tab-btn ${mode === "photo" ? "active" : ""}`} onClick={() => setMode("photo")}>
          📷 Captura OCR
        </button>
      </div>

      {mode === "voice" ? (
        <VoiceCapture onCapture={handleCapture} onError={handleError} />
      ) : (
        <PhotoCapture onCapture={handleCapture} onError={handleError} />
      )}

      {status && (
        <div className={`status-card ${status.error ? "error" : ""}`}>
          {!status.error && <div className="spinner" />}
          <p>{status.error ? `⚠️ ${status.message}` : status.message}</p>
        </div>
      )}
    </div>
  );
}
