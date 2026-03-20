/**
 * Bookmarklet compiler.
 *
 * Takes a TypeScript entry point, bundles it with esbuild into a single IIFE,
 * and outputs:
 *   1. A minified `.js` file (for hosting / script-tag injection)
 *   2. A `.bookmarklet.js` file containing the `javascript:void(…)` URL
 *   3. A `manifest.json` with metadata for the website and MCP server
 */

import { build, type BuildOptions } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";

export interface CompileOptions {
  entryPoint: string;
  outDir?: string;
  mode?: "inline" | "loader";
  baseUrl?: string;
}

export interface CompileResult {
  code: string;
  bookmarkletUrl: string;
  files: {
    js: string;
    bookmarklet: string;
  };
}

export async function compileBookmarklet(options: CompileOptions): Promise<CompileResult> {
  const { entryPoint, mode = "inline" } = options;
  const outDir = options.outDir ?? join(dirname(entryPoint), "..", "dist");

  mkdirSync(outDir, { recursive: true });

  // Entry is like .../entry/headings.ts → name = "headings"
  const name = basename(entryPoint, ".ts");

  const esbuildOptions: BuildOptions = {
    entryPoints: [entryPoint],
    bundle: true,
    format: "iife",
    minify: true,
    write: false,
    target: "es2020",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  };

  const result = await build(esbuildOptions);
  const code = result.outputFiles![0].text;

  let bookmarkletUrl: string;

  if (mode === "loader" && options.baseUrl) {
    const scriptUrl = `${options.baseUrl}/${name}.min.js`;
    const loader = `(function(){var s=document.createElement('script');s.src='${scriptUrl}';document.body.appendChild(s);})()`;
    bookmarkletUrl = `javascript:void(${encodeURIComponent(loader)})`;
  } else {
    const wrapped = `(function(){${code}})()`;
    bookmarkletUrl = `javascript:void(${encodeURIComponent(wrapped)})`;
  }

  const jsPath = join(outDir, `${name}.min.js`);
  const bookmarkletPath = join(outDir, `${name}.bookmarklet.js`);

  writeFileSync(jsPath, code, "utf-8");
  writeFileSync(bookmarkletPath, bookmarkletUrl, "utf-8");

  return {
    code,
    bookmarkletUrl,
    files: { js: jsPath, bookmarklet: bookmarkletPath },
  };
}

export function readBookmarkletCode(distDir: string, name: string): string {
  const jsPath = join(distDir, `${name}.min.js`);
  return readFileSync(jsPath, "utf-8");
}
