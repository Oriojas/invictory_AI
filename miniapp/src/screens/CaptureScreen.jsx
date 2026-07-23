import { useEffect, useState } from "react";
import VoiceCapture from "../capture/VoiceCapture.jsx";
import PhotoCapture from "../capture/PhotoCapture.jsx";
import ReconciliationView from "../capture/ReconciliationView.jsx";
import SuccessView from "../capture/SuccessView.jsx";

// Orquesta el flujo: capturar → conciliar → exito.
export default function CaptureScreen({ showBackButton, hideBackButton, haptic, onGoAlerts, onCounted }) {
  const [step, setStep] = useState("capturar"); // capturar | conciliar | exito
  const [mode, setMode] = useState("voice"); // voice | photo
  const [status, setStatus] = useState(null); // { message, error }
  const [result, setResult] = useState(null); // CaptureResponse

  // BackButton de Telegram para volver dentro del sub-flujo.
  useEffect(() => {
    if (step === "capturar") {
      hideBackButton?.();
    } else {
      showBackButton?.(() => setStep("capturar"));
    }
    return () => hideBackButton?.();
  }, [step, showBackButton, hideBackButton]);

  function handleProcessing(message) {
    setStatus({ message, error: false });
  }
  function handleResult(data) {
    setStatus(null);
    setResult(data);
    setStep("conciliar");
    haptic?.("notification", data?.anomaly?.is_anomaly ? "warning" : "success");
    onCounted?.(); // avisa a App para refrescar contadores/alertas
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

  return (
    <div className="screen">
      <div>
        <div className="screen-title">Captura multimodal</div>
        <div className="screen-subtitle">Registra el conteo físico por voz o foto</div>
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
        <VoiceCapture onProcessing={handleProcessing} onResult={handleResult} onError={handleError} />
      ) : (
        <PhotoCapture onProcessing={handleProcessing} onResult={handleResult} onError={handleError} />
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
