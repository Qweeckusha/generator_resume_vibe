import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // Двухстраничная сборка: index.html — сайт, print.html — чистая
      // печатная страница (её грузит скрытый iframe, см. src/printBridge.ts).
      input: {
        main: "index.html",
        print: "print.html",
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
