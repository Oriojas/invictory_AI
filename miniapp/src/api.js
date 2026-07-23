// Cliente del backend FastAPI. El backend es la fuente de la verdad (no se modifica).
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
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

// --- Captura multimodal (POST multipart, campo "file") ---
export function captureAudio(blob, filename = "dictado_operario.mp3") {
  const fd = new FormData();
  fd.append("file", blob, filename);
  return request("/api/v1/capture/audio", { method: "POST", body: fd });
}

export function captureImage(file) {
  const fd = new FormData();
  fd.append("file", file, file.name || "captura_foto.jpg");
  return request("/api/v1/capture/image", { method: "POST", body: fd });
}

// --- Datos para dashboard, alertas y actividad ---
export function getDiscrepancies() {
  // { total_skus, total_bodegas, total_conteos_ia, total_descuadres, porcentaje_precision, items_descuadrados[] }
  return request("/api/v1/dashboard/discrepancies");
}

export function getPhysicalCounts() {
  // ConteoFisicoResponse[] ordenado por fecha_conteo desc
  return request("/api/v1/inventory/physical");
}

// --- Utilidad de demo: repoblar datos ERP + conteos de ejemplo ---
export function reseedDemo() {
  return request("/api/v1/inventory/seed", { method: "POST" });
}

// --- Agente NL sobre inventario (feature real existente) ---
export function askAgent(query) {
  return request("/api/v1/agent/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
}
