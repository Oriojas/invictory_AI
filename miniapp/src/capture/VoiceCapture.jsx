import { useRef, useState } from "react";
import { captureAudio } from "../api.js";

// Graba el dictado del operario con MediaRecorder y lo envía al backend (STT).
export default function VoiceCapture({ onProcessing, onResult, onError }) {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // MediaRecorder no produce mp3: Chrome graba webm/opus y Safari mp4.
      // Usamos el formato real (Whisper acepta webm/ogg/mp4) para no mislabelar el archivo.
      const preferred = ["audio/webm", "audio/ogg", "audio/mp4"].find(
        (m) => typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported(m)
      );
      const recorder = new MediaRecorder(stream, preferred ? { mimeType: preferred } : undefined);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const mimeType = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const ext = mimeType.includes("ogg") ? "ogg" : mimeType.includes("mp4") ? "mp4" : "webm";
        onProcessing("🎙️ Analizando voz con Whisper + DeepSeek…");
        try {
          onResult(await captureAudio(blob, `dictado_operario.${ext}`));
        } catch (err) {
          onError(`Error al procesar audio: ${err.message}`);
        }
      };

      recorder.start();
      recorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      onError("No se pudo acceder al micrófono. Verifica los permisos.");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setIsRecording(false);
  }

  return (
    <section className="card capture-card">
      <h2>Dictar inventario por audio</h2>
      <p className="description">
        Presiona y dicta el conteo físico. Ej: "Encontré 15 cazuelas en la bodega del restaurante".
      </p>
      <button
        className={`action-btn record ${isRecording ? "recording" : ""}`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        <span className="btn-icon">🎙️</span>
        {isRecording ? "Detener y procesar" : "Iniciar grabación"}
      </button>
      {isRecording && (
        <div className="recording-wave">
          <span className="dot" /> Grabando audio…
        </div>
      )}
    </section>
  );
}
