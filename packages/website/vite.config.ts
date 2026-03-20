import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
  },
  // Serve compiled bookmarklets from /bookmarklets/ during dev
  server: {
    fs: {
      allow: ["../.."],
    },
  },
  plugins: [
    {
      name: "serve-bookmarklets",
      configureServer(server) {
        server.middlewares.use("/bookmarklets", (req, res, next) => {
          // Rewrite /bookmarklets/* to ../../dist/bookmarklets/*
          const filePath = resolve(__dirname, "../../dist/bookmarklets", req.url!.slice(1) || "");
          import("node:fs").then(({ existsSync, readFileSync }) => {
            if (existsSync(filePath)) {
              const ext = filePath.endsWith(".json") ? "application/json" : "application/javascript";
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
