import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type PluginOption } from "vite";

export default defineConfig({
  base: process.env.VITE_BASE_URL || "/",
  root: ".",
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    fs: {
      allow: ["../.."],
    },
  },
  plugins: [
    react() as unknown as PluginOption,
    tailwindcss() as unknown as PluginOption,
    {
      name: "serve-bookmarklets",
      configureServer(server) {
        server.middlewares.use("/bookmarklets", (req, res, next) => {
          const requestPath = (req.url ?? "").slice(1);
          const filePath = resolve(__dirname, "../../dist/bookmarklets", requestPath || "");
          import("node:fs").then(({ existsSync, readFileSync }) => {
            if (existsSync(filePath)) {
              const ext = filePath.endsWith(".json")
                ? "application/json"
                : "application/javascript";
              res.setHeader("Content-Type", ext);
              res.end(readFileSync(filePath));
            } else {
              next();
            }
          });
        });
      },
    },
  ],
});
