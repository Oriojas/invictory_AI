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
        alert("No se pudo acceder al micrófono. Verifica los permisos.");
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
    showStatus("Analizando voz con OpenAI Whisper & DeepSeek LLM...");
    const formData = new FormData();
    formData.append("file", blob, "dictado_operario.mp3");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/capture/audio`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error en la respuesta del backend");

      const data = await response.json();
      showResult(data);
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al enviar el audio. Se mostrará un resultado de demostración.");
      showResult({
        producto_nombre: "Cazuela 16 Onz",
        cantidad_contada: 15.0,
        bodega: "Stock Almacén Suministros",
        fuente: "audio",
        observaciones: "Demo: 15 cazuelas contadas por voz (Descuadre voluntario vs ERP)."
      });
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

    showStatus("Procesando imagen con DeepSeek Vision OCR (detail=high)...");
    const formData = new FormData();
    formData.append("file", selectedPhotoFile, selectedPhotoFile.name);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/capture/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error en la respuesta del backend OCR");

      const data = await response.json();
      showResult(data);
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error en el OCR. Se mostrará un resultado de demostración.");
      showResult({
        producto_nombre: "Cinta Sellamiento 48 mm x 50 mts",
        cantidad_contada: 18.0,
        bodega: "Stock Almacén Suministros",
        fuente: "imagen",
        observaciones: "Demo OCR high-detail: 18 cintas detectadas (Sobrante vs ERP)."
      });
    }
  });

  // Auxiliares de UI
  function showStatus(msg) {
    statusMessage.textContent = msg;
    statusCard.classList.remove("hidden");
    resultCard.classList.add("hidden");
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
  });
});
