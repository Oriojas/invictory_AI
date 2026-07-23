// Telegram WebApp Integration & Audio/Image Capture Logic
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar Telegram WebApp SDK
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }

  // URL del Backend FastAPI (detecta dinámicamente el host)
  const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : `${window.location.protocol}//${window.location.hostname}:8080`;

  // UI Elements
  const tabVoice = document.getElementById("tab-voice");
  const tabPhoto = document.getElementById("tab-photo");
  const sectionVoice = document.getElementById("section-voice");
  const sectionPhoto = document.getElementById("section-photo");

  const recordBtn = document.getElementById("record-btn");
  const recordText = document.getElementById("record-text");
  const recordingIndicator = document.getElementById("recording-indicator");

  const cameraInput = document.getElementById("camera-input");
  const previewContainer = document.getElementById("image-preview-container");
  const imagePreview = document.getElementById("image-preview");
  const sendPhotoBtn = document.getElementById("send-photo-btn");

  const statusCard = document.getElementById("status-card");
  const statusMessage = document.getElementById("status-message");
  const resultCard = document.getElementById("result-card");

  const resProduct = document.getElementById("res-product");
  const resQuantity = document.getElementById("res-quantity");
  const resBodega = document.getElementById("res-bodega");
  const resFuente = document.getElementById("res-fuente");
  const resObs = document.getElementById("res-obs");
  const resetBtn = document.getElementById("reset-btn");

  let mediaRecorder = null;
  let audioChunks = [];
  let isRecording = false;
  let selectedPhotoFile = null;

  // Cambiar pestañas de modo
  tabVoice.addEventListener("click", () => {
    tabVoice.classList.add("active");
    tabPhoto.classList.remove("active");
    sectionVoice.classList.add("active");
    sectionPhoto.classList.remove("active");
  });

  tabPhoto.addEventListener("click", () => {
    tabPhoto.classList.add("active");
    tabVoice.classList.remove("active");
    sectionPhoto.classList.add("active");
    sectionVoice.classList.remove("active");
  });

  // --- LÓGICA DE GRABACIÓN DE AUDIO (STT) ---
  recordBtn.addEventListener("click", async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
          await sendAudioToBackend(audioBlob);
        };

        mediaRecorder.start();
        isRecording = true;
        recordBtn.classList.add("recording");
        recordText.textContent = "Detener y Procesar";
        recordingIndicator.classList.remove("hidden");
      } catch (err) {
        showStatus("⚠️ No se pudo acceder al micrófono. Verifica los permisos.", true);
        console.error(err);
      }
    } else {
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        recordBtn.classList.remove("recording");
        recordText.textContent = "Iniciar Grabación";
        recordingIndicator.classList.add("hidden");
      }
    }
  });

  async function sendAudioToBackend(blob) {
    showStatus("🎙️ Analizando voz con OpenAI Whisper & DeepSeek LLM...");
    const formData = new FormData();
    formData.append("file", blob, "dictado_operario.mp3");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/capture/audio`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error HTTP ${response.status}`);
      }

      const data = await response.json();
      handleCaptureResponse(data);
    } catch (error) {
      console.error(error);
      showStatus(`⚠️ Error al procesar audio: ${error.message}`, true);
    }
  }

  // --- LÓGICA DE CAPTURA DE FOTO (OCR) ---
  cameraInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      selectedPhotoFile = file;
      const reader = new FileReader();
      reader.onload = (event) => {
        imagePreview.src = event.target.result;
        previewContainer.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    }
  });

  sendPhotoBtn.addEventListener("click", async () => {
    if (!selectedPhotoFile) return;

    showStatus("📸 Procesando imagen con DeepSeek Vision OCR (detail=high)...");
    const formData = new FormData();
    formData.append("file", selectedPhotoFile, selectedPhotoFile.name);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/capture/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error HTTP ${response.status}`);
      }

      const data = await response.json();
      handleCaptureResponse(data);
    } catch (error) {
      console.error(error);
      showStatus(`⚠️ Error al procesar imagen: ${error.message}`, true);
    }
  });

  /**
   * Maneja la respuesta enriquecida CaptureResponse { conteo, anomaly }
   * Si hay anomalía, muestra alerta visual antes de mostrar el resultado.
   */
  function handleCaptureResponse(data) {
    const conteo = data.conteo || data;
    const anomaly = data.anomaly || null;

    // Siempre mostrar el resultado del conteo
    showResult(conteo);

    // Si hay anomalía, mostrar alerta visual prominente
    if (anomaly && anomaly.is_anomaly) {
      showAnomalyAlert(anomaly);
    } else {
      hideAnomalyAlert();
    }
  }

  function showAnomalyAlert(anomaly) {
    // Crear o reutilizar el contenedor de alerta
    let alertDiv = document.getElementById("anomaly-alert");
    if (!alertDiv) {
      alertDiv = document.createElement("div");
      alertDiv.id = "anomaly-alert";
      resultCard.parentNode.insertBefore(alertDiv, resultCard);
    }

    const isCritical = anomaly.severity === "CRITICA";
    const icon = isCritical ? "🚨" : anomaly.severity === "ALTA" ? "⚠️" : "ℹ️";
    const bgColor = isCritical ? "#FDE8E8" : "#FFF3CD";
    const borderColor = isCritical ? "#E30613" : "#FFC107";
    const textColor = isCritical ? "#E30613" : "#856404";

    alertDiv.innerHTML = `
      <div style="
        margin: 12px 0;
        padding: 14px 18px;
        background-color: ${bgColor};
        border: 2px solid ${borderColor};
        border-radius: 10px;
        animation: pulse 1.5s infinite;
      ">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 22px;">${icon}</span>
          <strong style="color: ${textColor}; font-size: 14px; text-transform: uppercase;">
            Anomalía ${anomaly.severity} — Desviación del ${anomaly.deviation_percent}%
          </strong>
        </div>
        <p style="font-size: 13px; color: #111827; line-height: 1.5; margin: 0;">
          ${anomaly.message}
        </p>
        ${anomaly.expected_quantity !== null ? `
          <div style="margin-top: 10px; display: flex; gap: 14px; font-size: 12px; font-weight: 700; color: #414751;">
            <span>📦 Stock ERP: ${anomaly.expected_quantity}</span>
            <span>📊 Desviación: ${anomaly.deviation_percent}%</span>
            <span>🔒 ${anomaly.requires_confirmation ? "Requiere confirmación" : "Registrado con alerta"}</span>
          </div>
        ` : ""}
      </div>
    `;
    alertDiv.classList.remove("hidden");
  }

  function hideAnomalyAlert() {
    const alertDiv = document.getElementById("anomaly-alert");
    if (alertDiv) {
      alertDiv.classList.add("hidden");
    }
  }

  // Auxiliares de UI
  function showStatus(msg, isError = false) {
    statusMessage.textContent = msg;
    statusCard.classList.remove("hidden");
    resultCard.classList.add("hidden");
    hideAnomalyAlert();
    if (isError) {
      statusCard.style.backgroundColor = "#FFDAD6";
      statusCard.style.borderColor = "#E30613";
    } else {
      statusCard.style.backgroundColor = "";
      statusCard.style.borderColor = "";
    }
  }

  function showResult(data) {
    statusCard.classList.add("hidden");
    resultCard.classList.remove("hidden");

    resProduct.textContent = data.producto_nombre || "-";
    resQuantity.textContent = `${data.cantidad_contada} unidades`;
    resBodega.textContent = data.bodega || "-";
    resFuente.textContent = (data.fuente || "manual").toUpperCase();
    resObs.textContent = data.observaciones || "Sin observaciones";
  }

  resetBtn.addEventListener("click", () => {
    resultCard.classList.add("hidden");
    previewContainer.classList.add("hidden");
    cameraInput.value = "";
    selectedPhotoFile = null;
    hideAnomalyAlert();
  });
});
