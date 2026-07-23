import { useState } from "react";
import { useTelegram } from "./useTelegram.js";
import VoiceCapture from "./components/VoiceCapture.jsx";
import PhotoCapture from "./components/PhotoCapture.jsx";
import ResultView from "./components/ResultView.jsx";

export default function App() {
  const { user, haptic } = useTelegram();
  const [mode, setMode] = useState("voice"); // "voice" | "photo"
  const [status, setStatus] = useState(null); // { message, error }
  const [result, setResult] = useState(null); // CaptureResponse

  function handleProcessing(message) {
    setResult(null);
    setStatus({ message, error: false });
  }
  function handleResult(data) {
    setStatus(null);
    setResult(data);
    haptic?.notificationOccurred?.(data?.anomaly?.is_anomaly ? "warning" : "success");
  }
  function handleError(message) {
    setStatus({ message, error: true });
  }
  function reset() {
    setResult(null);
    setStatus(null);
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <span className="badge">Colsubsidio x 30X</span>
        <h1>Invictory_AI</h1>
        <p>Captura inteligente de inventario hotelero</p>
        {user && <p className="greeting">Hola, {user.first_name} 👋</p>}
      </header>

      <main className="main-content">
        <div className="mode-tabs">
          <button
            className={`tab-btn ${mode === "voice" ? "active" : ""}`}
            onClick={() => setMode("voice")}
          >
            🎙️ Dictado por voz
          </button>
          <button
            className={`tab-btn ${mode === "photo" ? "active" : ""}`}
            onClick={() => setMode("photo")}
          >
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

        {result && (
          <ResultView conteo={result.conteo || result} anomaly={result.anomaly} onReset={reset} />
        )}
      </main>
    </div>
  );
}
