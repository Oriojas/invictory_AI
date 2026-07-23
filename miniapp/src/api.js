// Cliente del backend FastAPI. El backend es la fuente de la verdad (no se modifica).
// Endpoints: POST /api/v1/capture/audio y /api/v1/capture/image (multipart, campo "file").
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function postFile(path, formData) {
  const res = await fetch(`${API_BASE}${path}`, { method: "POST", body: formData });
  if (!res.ok) {
    let detail;
    try {
      detail = (await res.json())?.detail;
    } catch {
      /* respuesta sin JSON */
    }
    throw new Error(detail || `Error HTTP ${res.status}`);
  }
  return res.json();
}

export function captureAudio(blob, filename = "dictado_operario.mp3") {
  const fd = new FormData();
  fd.append("file", blob, filename);
  return postFile("/api/v1/capture/audio", fd);
}

export function captureImage(file) {
  const fd = new FormData();
  fd.append("file", file, file.name || "captura_foto.jpg");
  return postFile("/api/v1/capture/image", fd);
}
