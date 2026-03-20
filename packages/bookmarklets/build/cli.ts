#!/usr/bin/env node

/**
 * CLI to build all bookmarklets.
 *
 * Usage:
 *   node build/cli.js                   # build all
 *   node build/cli.js headings          # build one
 *   node build/cli.js --base-url URL    # loader mode
 */

import { readdirSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compileBookmarklet, type CompileResult } from "./compiler.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface ManifestEntry {
  id: string;
  bookmarkletUrl: string;
  jsFile: string;
  size: number;
}

async function main() {
  const args = process.argv.slice(2);
  const baseUrl = args.includes("--base-url") ? args[args.indexOf("--base-url") + 1] : undefined;
  const mode = baseUrl ? "loader" : ("inline" as const);
  const filterName = args.find((a) => !a.startsWith("--") && a !== baseUrl);

  // Entry points are in packages/bookmarklets/src/entry/
  // __dirname is dist-build/ at runtime, so go up to packages/bookmarklets/
  const packageDir = resolve(__dirname, "..");
  const entryDir = resolve(packageDir, "src", "entry");
  const outDir = resolve(packageDir, "..", "..", "dist", "bookmarklets");
  mkdirSync(outDir, { recursive: true });

  const entries = readdirSync(entryDir)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => f.replace(".ts", ""))
    .filter((name) => !filterName || name === filterName);

  if (entries.length === 0) {
    console.error("No bookmarklets found.");
    process.exit(1);
  }

  const manifest: ManifestEntry[] = [];

  for (const name of entries) {
    const entryPoint = join(entryDir, `${name}.ts`);
    if (!existsSync(entryPoint)) {
      console.warn(`⚠ Skipping ${name}: entry file not found`);
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

    console.log(`   ✓ ${name}.min.js (${(result.code.length / 1024).toFixed(1)} KB)`);
  }

  const manifestPath = join(outDir, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`\n✅ Built ${manifest.length} bookmarklet(s) → ${outDir}`);
  console.log(`📄 Manifest: ${manifestPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
