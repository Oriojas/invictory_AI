const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function fetchDiscrepancies() {
  const res = await fetch(`${API_BASE}/api/v1/dashboard/discrepancies`);
  if (!res.ok) {
    throw new Error(`Error de servidor HTTP ${res.status}`);
  }
  return res.json();
}

export async function seedInventory() {
  const res = await fetch(`${API_BASE}/api/v1/inventory/seed`, { method: 'POST' });
  if (!res.ok) {
    throw new Error(`Error al restablecer inventario HTTP ${res.status}`);
  }
  return res.json();
}

export async function captureAudio(audioBlob, filename = 'simulacion_voz.mp3') {
  const formData = new FormData();
  formData.append('file', audioBlob, filename);
  const res = await fetch(`${API_BASE}/api/v1/capture/audio`, {
    method: 'POST',
    body: formData
  });
  return { ok: res.ok, status: res.status, data: await res.json().catch(() => null) };
}

export async function captureImage(imageBlob, filename = 'simulacion_ocr.jpg') {
  const formData = new FormData();
  formData.append('file', imageBlob, filename);
  const res = await fetch(`${API_BASE}/api/v1/capture/image`, {
    method: 'POST',
    body: formData
  });
  return { ok: res.ok, status: res.status, data: await res.json().catch(() => null) };
}
