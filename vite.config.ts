import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // tsconfigPaths reads the `paths` in tsconfig.app.json and wires them into
  // Vite's resolver, so `@/` works identically in VS Code, the dev server, and
  // the production build — no manual alias needed.
  plugins: [react(), tailwindcss(), tsconfigPaths()],
});
