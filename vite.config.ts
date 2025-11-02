import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  define: {
    ...Object.keys(process.env)
      .filter((key) => key.startsWith("VITE_"))
      .reduce<Record<string, string>>((acc, key) => {
        acc[`import.meta.env.${key}`] = JSON.stringify(process.env[key]);
        return acc;
      }, {}),
  },
});
