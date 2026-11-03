import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { writingsDocx } from "./vite-writings.ts";

// The preview tool assigns the port through PORT; run by hand it falls back to 5174.
export default defineConfig({
  plugins: [react(), tailwindcss(), writingsDocx()],
  server: { port: Number(process.env.PORT) || 5174 },
});
