import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import process from "node:process";
import { handleNearbyRequest } from "./server/nearby";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // tsconfigPaths reads the `paths` in tsconfig.app.json and wires them into
    // Vite's resolver, so `@/` works identically in the editor and build.
    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths(),
      {
        name: "nearby-api-dev",
        configureServer(server) {
          server.middlewares.use(async (request, response, next) => {
            if (
              new URL(request.url ?? "/", "http://localhost").pathname !==
              "/api/nearby"
            ) {
              return next();
            }

            try {
              const apiResponse = await handleNearbyRequest(
                new Request(
                  new URL(request.url ?? "/", "http://localhost"),
                  { method: request.method ?? "GET" },
                ),
                env.GEOAPIFY_API_KEY ?? process.env.GEOAPIFY_API_KEY ?? "",
              );
              response.statusCode = apiResponse.status;
              apiResponse.headers.forEach((value, key) =>
                response.setHeader(key, value),
              );
              response.end(await apiResponse.text());
            } catch (error) {
              next(
                error instanceof Error
                  ? error
                  : new Error("The nearby API request failed."),
              );
            }
          });
        },
      },
    ],
  };
});
