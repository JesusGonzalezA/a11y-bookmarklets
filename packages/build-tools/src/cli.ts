#!/usr/bin/env node

/**
 * CLI to build all bookmarklets in the monorepo.
 *
 * Usage:
 *   build-bookmarklets                  # build all
 *   build-bookmarklets headings         # build one
 *   build-bookmarklets --base-url URL   # loader mode
 */

import { readdirSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { compileBookmarklet, type CompileResult } from "./compiler.js";

interface ManifestEntry {
  id: string;
  bookmarkletUrl: string;
  jsFile: string;
  size: number;
}

async function main() {
  const args = process.argv.slice(2);
  const baseUrl = args.includes("--base-url")
    ? args[args.indexOf("--base-url") + 1]
    : undefined;
  const mode = baseUrl ? "loader" : ("inline" as const);
  const filterName = args.find((a) => !a.startsWith("--") && a !== baseUrl);

  const bookmarkletsDir = resolve(process.cwd(), "packages", "bookmarklets");
  const outDir = resolve(process.cwd(), "dist", "bookmarklets");
  mkdirSync(outDir, { recursive: true });

  const dirs = readdirSync(bookmarkletsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .filter((d) => !filterName || d.name === filterName)
    .map((d) => d.name);

  if (dirs.length === 0) {
    console.error("No bookmarklets found.");
    process.exit(1);
  }

  const manifest: ManifestEntry[] = [];

  for (const name of dirs) {
    const entryPoint = join(bookmarkletsDir, name, "src", "index.ts");
    if (!existsSync(entryPoint)) {
      console.warn(`⚠ Skipping ${name}: no src/index.ts found`);
      continue;
    }

    console.log(`📦 Building ${name}...`);

    const result: CompileResult = await compileBookmarklet({
      entryPoint,
      outDir,
      mode,
      baseUrl,
    });

    manifest.push({
      id: name,
      bookmarkletUrl: result.bookmarkletUrl,
      jsFile: `${name}.min.js`,
      size: result.code.length,
    });

    console.log(
      `   ✓ ${name}.min.js (${(result.code.length / 1024).toFixed(1)} KB)`,
    );
  }

  // Write manifest
  const manifestPath = join(outDir, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`\n✅ Built ${manifest.length} bookmarklet(s) → ${outDir}`);
  console.log(`📄 Manifest: ${manifestPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
