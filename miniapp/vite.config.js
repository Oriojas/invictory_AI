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
  },
});
