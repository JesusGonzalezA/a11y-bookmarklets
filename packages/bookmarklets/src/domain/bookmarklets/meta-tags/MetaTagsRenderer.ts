import type { Issue } from "../../types.js";
import { showResultPanel } from "../shared/render-helpers.js";
import type { MetaTagsData } from "./types.js";

export function renderMetaTags(data: MetaTagsData, issues: Issue[]): void {
  const lines: string[] = [];

  lines.push(
    `Charset: ${data.charset ?? "not set"} ${data.charset?.toUpperCase() === "UTF-8" ? "✓" : "⚠"}`,
  );
  lines.push(`Description: ${data.description ? "✓ present" : "— missing"}`);
  lines.push(`Color scheme: ${data.colorScheme ?? "— not declared"}`);
  lines.push(`Theme color: ${data.themeColor ?? "— not set"}`);
  lines.push(`HTTP refresh: ${data.httpRefresh ? `✗ ${data.httpRefresh}` : "✓ none"}`);
  lines.push(`Total meta tags: ${data.allMetaTags.length}`);

  showResultPanel("Meta Tags Audit", issues, {
    summaryHtml: `<pre style="margin:4px 0 0; white-space:pre-wrap;">${lines.join("\n")}</pre>`,
  });
}
