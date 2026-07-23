import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Mini App servida vía túnel HTTPS (cloudflared/ngrok) para probar dentro de Telegram.
// host:true expone en la red; allowedHosts:true permite el dominio dinámico del túnel.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5180,
    allowedHosts: true,
    // Mismo origen en dev: /api se reenvía al backend FastAPI local (evita CORS y unifica con prod).
    // 127.0.0.1 (no "localhost") para evitar que Node resuelva a IPv6 ::1 y el backend escuche en IPv4.
    proxy: {
      "/api": "http://127.0.0.1:8080",
    },
  },
});
