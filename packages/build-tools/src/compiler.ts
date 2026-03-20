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
import { basename, dirname, join, resolve } from "node:path";

export interface CompileOptions {
  /** Absolute path to the bookmarklet entry .ts file */
  entryPoint: string;
  /** Output directory (default: dist/ next to entry) */
  outDir?: string;
  /** Whether to produce a self-contained bookmarklet URL or a loader that fetches a hosted script */
  mode?: "inline" | "loader";
  /** Base URL for the hosted script (only used in "loader" mode) */
  baseUrl?: string;
}

export interface CompileResult {
  /** The minified JS code */
  code: string;
  /** The javascript:void(…) bookmarklet URL */
  bookmarkletUrl: string;
  /** Output paths */
  files: {
    js: string;
    bookmarklet: string;
  };
}

export async function compileBookmarklet(options: CompileOptions): Promise<CompileResult> {
  const { entryPoint, mode = "inline" } = options;
  const outDir = options.outDir ?? join(dirname(entryPoint), "..", "dist");

  mkdirSync(outDir, { recursive: true });

  // entryPoint is like .../bookmarklets/headings/src/index.ts → we want "headings"
  const entryDir = dirname(entryPoint);
  const name = basename(entryDir) === "src"
    ? basename(dirname(entryDir))
    : basename(entryDir);

  // Bundle with esbuild
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

  // Generate bookmarklet URL
  let bookmarkletUrl: string;

  if (mode === "loader" && options.baseUrl) {
    // Small loader that injects a script tag
    const scriptUrl = `${options.baseUrl}/${name}.min.js`;
    const loader = `(function(){var s=document.createElement('script');s.src='${scriptUrl}';document.body.appendChild(s);})()`;
    bookmarkletUrl = `javascript:void(${encodeURIComponent(loader)})`;
  } else {
    // Inline: wrap in IIFE to avoid CORB issues with bare var declarations
    const wrapped = `(function(){${code}})()`;
    bookmarkletUrl = `javascript:void(${encodeURIComponent(wrapped)})`;
  }

  // Write outputs
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

/**
 * Read source of a bookmarklet for injection via browser_evaluate.
 * Returns the raw JS code (not the javascript: URL).
 */
export function readBookmarkletCode(distDir: string, name: string): string {
  const jsPath = join(distDir, `${name}.min.js`);
  return readFileSync(jsPath, "utf-8");
}
