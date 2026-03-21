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
import { compileBookmarklet, compileSkillScript, type CompileResult } from "./compiler.js";
import { BookmarkletCatalogEntry } from "../dist/domain/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface ManifestEntry {
  id: string;
  name: string;
  description: string;
  wcag: string[];
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

  // Import catalog from the compiled dist/ (built by tsc before this script runs)
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

    const catalogEntry = BOOKMARKLET_CATALOG.find((b) => b.id === name);

    const result: CompileResult = await compileBookmarklet({
      entryPoint,
      outDir,
      mode,
      baseUrl,
    });

    manifest.push({
      id: name,
      name: catalogEntry?.name ?? name,
      description: catalogEntry?.description ?? "",
      wcag: catalogEntry?.wcag ?? [],
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

  // ── Compile skill scripts (arrow-function format for tool injection) ──
  const repoRoot = resolve(packageDir, "..", "..");
  const skillScriptsDir = resolve(repoRoot, "skill", "scripts");
  const skillBookmarkletsDir = resolve(repoRoot, "skill", "bookmarklets");
  mkdirSync(skillScriptsDir, { recursive: true });
  mkdirSync(skillBookmarkletsDir, { recursive: true });

  for (const entry of manifest) {
    const entryPoint = join(entryDir, `${entry.id}.ts`);
    console.log(`🔧 Skill script ${entry.id}...`);
    await compileSkillScript({ entryPoint, outDir: skillScriptsDir });
  }
  copyFileSync(manifestPath, join(skillScriptsDir, "manifest.json"));
  console.log(`📁 Built ${manifest.length} skill scripts → ${skillScriptsDir}`);

  // ── Generate per-bookmarklet reference docs ──
  for (const entry of manifest) {
    const catalogEntry = BOOKMARKLET_CATALOG.find(
      (b: BookmarkletCatalogEntry) => b.id === entry.id,
    );
    const doc = generateBookmarkletDoc(entry, catalogEntry);
    writeFileSync(join(skillBookmarkletsDir, `${entry.id}.md`), doc, "utf-8");
  }
  console.log(`📝 Generated ${manifest.length} reference docs → ${skillBookmarkletsDir}`);
}

function generateBookmarkletDoc(
  entry: ManifestEntry,
  catalog?: BookmarkletCatalogEntry,
): string {
  const wcag = entry.wcag.map((w) => "- " + w).join("\n");
  const checks = catalog?.checks?.map((c) => "- " + c).join("\n") || "- See source code";
  const tags = catalog?.tags?.join(", ") || "";
  const fence = "```";

  const lines: string[] = [
    "# " + entry.name,
    "",
    entry.description,
    "",
    "## WCAG Criteria",
    "",
    wcag,
    "",
    "## What It Checks",
    "",
    checks,
    "",
    "## Details",
    "",
    catalog?.details || entry.description,
    "",
    "## Data Returned",
    "",
    catalog?.dataReturned || "Standard AuditResult JSON with issues array and summary.",
    "",
  ];

  if (tags) {
    lines.push("## Tags", "", tags, "");
  }

  lines.push(
    "## How to Execute",
    "",
    "1. Read the script file:",
    "   " + fence,
    "   read_file('skill/scripts/" + entry.id + ".min.js')",
    "   " + fence,
    "",
    "2. Inject via Chrome DevTools MCP:",
    "   " + fence,
    "   mcp_chrome-devtoo_evaluate_script({",
    '     expression: "<contents of ' + entry.id + '.min.js>"',
    "   })",
    "   " + fence,
    "",
    "3. Retrieve the result:",
    "   " + fence,
    "   mcp_chrome-devtoo_evaluate_script({",
    "     expression: \"JSON.stringify(window.__a11y)\"",
    "   })",
    "   " + fence,
    "",
    "4. Take a screenshot to see the visual overlays:",
    "   " + fence,
    "   mcp_chrome-devtoo_take_screenshot()",
    "   " + fence,
    "",
    "## Result Shape",
    "",
    fence + "json",
    "{",
    '  "bookmarklet": "' + entry.id + '",',
    '  "url": "...",',
    '  "timestamp": "ISO 8601",',
    '  "issues": [',
    "    {",
    '      "severity": "error|warning|info|pass",',
    '      "message": "Description",',
    '      "selector": "CSS selector",',
    '      "html": "Truncated outerHTML",',
    '      "wcag": "criterion",',
    '      "suggestion": "Fix",',
    '      "data": {}',
    "    }",
    "  ],",
    '  "summary": { "total": 0, "errors": 0, "warnings": 0, "passes": 0, "info": 0 }',
    "}",
    fence,
    "",
  );

  return lines.join("\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
