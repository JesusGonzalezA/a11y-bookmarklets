import type { BookmarkletCatalogEntry } from "../dist/domain/types.js";
import type { ManifestEntry } from "./manifest-generator.js";

export function generateBookmarkletDoc(
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
    "1. Inject the bookmarklet — pass the entire content of `" + entry.id + ".min.js` to `evaluate_script` (do NOT analyze the script code):",
   "```",
   "mcp_chrome-devtoo_evaluate_script({ expression: \"<content of " + entry.id + ".min.js>\" })",
   "```",
    "2. Retrieve and analyze the result:",
    "   " + fence,
    "   mcp_chrome-devtoo_evaluate_script({",
    "     expression: \"JSON.stringify(window.__a11y." + entry.id + ".lastResult)\"",
    "   })",
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
