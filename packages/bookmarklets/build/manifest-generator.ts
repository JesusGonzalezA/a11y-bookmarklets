import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { CompileResult } from "./compiler.js";
import type { BookmarkletCatalogEntry } from "../dist/domain/types.js";

export interface ManifestEntry {
  id: string;
  name: string;
  description: string;
  wcag: string[];
  bookmarkletUrl: string;
  jsFile: string;
  size: number;
}

export function buildManifestEntry(
  name: string,
  result: CompileResult,
  catalogEntry?: BookmarkletCatalogEntry,
): ManifestEntry {
  return {
    id: name,
    name: catalogEntry?.name ?? name,
    description: catalogEntry?.description ?? "",
    wcag: catalogEntry?.wcag ?? [],
    bookmarkletUrl: result.bookmarkletUrl,
    jsFile: `${name}.min.js`,
    size: result.code.length,
  };
}

export function writeManifest(manifest: ManifestEntry[], outDir: string): string {
  const manifestPath = join(outDir, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  return manifestPath;
}
