import crypto from "node:crypto";

// Valida el initData de una Telegram Mini App (algoritmo oficial HMAC-SHA256).
// Solo Telegram, que conoce el bot token, puede firmar un initData válido.
// Devuelve { ok, reason?, user? }.
export function validateInitData(initData, botToken, maxAgeSeconds = 86400) {
  if (!initData) return { ok: false, reason: "initData ausente" };

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return { ok: false, reason: "sin hash" };

  // El hash y la signature (validación Ed25519 de terceros) no entran en el data_check_string.
  params.delete("hash");
  params.delete("signature");

  // Pares clave=valor (valores ya decodificados por URLSearchParams), ordenados por clave y unidos por \n.
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computed = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  // Comparar las CADENAS hex como bytes UTF-8 (tiempo constante).
  // No usamos Buffer.from(hash,"hex") porque ignora basura no-hex al final y podría
  // aceptar un hash malformado; comparar las cadenas exige longitud y contenido idénticos.
  const a = Buffer.from(computed, "utf8");
  const b = Buffer.from(hash, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, reason: "firma inválida" };
  }

  // Anti-replay básico: rechazar initData viejo.
  const authDate = Number(params.get("auth_date") || 0);
  if (maxAgeSeconds > 0 && authDate > 0) {
    const age = Math.floor(Date.now() / 1000) - authDate;
    if (age > maxAgeSeconds) return { ok: false, reason: "initData expirado" };
  }

  let user = null;
  try {
    user = JSON.parse(params.get("user") || "null");
  } catch {
    /* user opcional */
  }
  return { ok: true, user };
}
