#!/usr/bin/env node

/**
 * CLI to build all bookmarklets.
 *
 * Usage:
 *   node build/cli.js                   # build all
 *   node build/cli.js headings          # build one
 *   node build/cli.js --base-url URL    # loader mode
 */

import { readdirSync, existsSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compileBookmarklet, compileSkillScript } from "./compiler.js";
import { buildManifestEntry, writeManifest, type ManifestEntry } from "./manifest-generator.js";
import { generateBookmarkletDoc } from "./knowledge-generator.js";
import type { BookmarkletCatalogEntry } from "../dist/domain/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const args = process.argv.slice(2);
  const baseUrl = args.includes("--base-url") ? args[args.indexOf("--base-url") + 1] : undefined;
  const mode = baseUrl ? "loader" : ("inline" as const);
  const filterName = args.find((a) => !a.startsWith("--") && a !== baseUrl);

  const packageDir = resolve(__dirname, "..");
  const entryDir = resolve(packageDir, "src", "entry");
  const outDir = resolve(packageDir, "..", "..", "dist", "bookmarklets");
  mkdirSync(outDir, { recursive: true });

  const { BOOKMARKLET_CATALOG } = await import("../dist/catalog/index.js");

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

    const catalogEntry = BOOKMARKLET_CATALOG.find((b: BookmarkletCatalogEntry) => b.id === name);
    const result = await compileBookmarklet({ entryPoint, outDir, mode, baseUrl });
    manifest.push(buildManifestEntry(name, result, catalogEntry));

    console.log(`   ✓ ${name}.min.js (${(result.code.length / 1024).toFixed(1)} KB)`);
  }

  const manifestPath = writeManifest(manifest, outDir);
  console.log(`\n✅ Built ${manifest.length} bookmarklet(s) → ${outDir}`);
  console.log(`📄 Manifest: ${manifestPath}`);

  // ── Compile skill scripts ──
  const repoRoot = resolve(packageDir, "..", "..");
  const skillScriptsDir = resolve(repoRoot, "skills", "a11y-bookmarklets", "scripts");
  const skillKnowledgeDir = resolve(repoRoot, "skills", "a11y-bookmarklets", "knowledge");
  mkdirSync(skillScriptsDir, { recursive: true });
  mkdirSync(skillKnowledgeDir, { recursive: true });

  for (const entry of manifest) {
    const entryPoint = join(entryDir, `${entry.id}.ts`);
    const catalogEntry = BOOKMARKLET_CATALOG.find(
      (b: BookmarkletCatalogEntry) => b.id === entry.id,
    );
    const isAsync = catalogEntry?.tags?.includes("async") ?? false;
    console.log(`🔧 Skill script ${entry.id}${isAsync ? " (async)" : ""}...`);
    await compileSkillScript({ entryPoint, outDir: skillScriptsDir, async: isAsync });
  }
  copyFileSync(manifestPath, join(skillScriptsDir, "manifest.json"));
  console.log(`📁 Built ${manifest.length} skill scripts → ${skillScriptsDir}`);

  // ── Generate per-bookmarklet reference docs ──
  for (const entry of manifest) {
    const catalogEntry = BOOKMARKLET_CATALOG.find(
      (b: BookmarkletCatalogEntry) => b.id === entry.id,
    );
    const doc = generateBookmarkletDoc(entry, catalogEntry);
    writeFileSync(join(skillKnowledgeDir, `${entry.id}.md`), doc, "utf-8");
  }
  console.log(`📝 Generated ${manifest.length} reference docs → ${skillKnowledgeDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
