import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "ToIngresso",
        short_name: "ToIngresso",
        description: "Compra segura e fácil com ToIngresso",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/maskable/maskable_icon_x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/maskable/maskable_icon_x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },          
          {
            src: "/maskable/maskable_icon_x192.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
