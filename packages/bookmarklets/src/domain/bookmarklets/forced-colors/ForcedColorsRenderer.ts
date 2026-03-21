import type { Issue } from "../../types.js";
import {
  inaccessibleSheetsLine,
  renderOverlays,
  showResultPanel,
} from "../shared/render-helpers.js";
import type { ForcedColorsData } from "./types.js";

const MAX_RENDERED = 30;

export function renderForcedColors(data: ForcedColorsData, issues: Issue[]): void {
  const hasQuery = data.hasForcedColorsQuery;
  const significant = data.affectedElements.filter((e) => e.properties.length >= 2);

  renderOverlays(
    significant.slice(0, MAX_RENDERED).map((entry) => {
      let color: string;
      if (entry.hasForcedColorAdjust) color = "#f39c12";
      else if (hasQuery) color = "#2ecc71";
      else color = "#e74c3c";

      return {
        selector: entry.selector,
        color,
        label:
          entry.properties.length > 2
            ? `${entry.properties.length} custom props`
            : entry.properties.join(", "),
      };
    }),
  );

  const lines: string[] = [];
  if (hasQuery) {
    lines.push(`✓ ${data.forcedColorsRuleCount} forced-colors rule(s)`);
  } else {
    lines.push("✗ No forced-colors rules");
  }
  if (data.hasPrefersContrastQuery) {
    lines.push(`✓ ${data.prefersContrastRuleCount} prefers-contrast rule(s)`);
  } else {
    lines.push("✗ No prefers-contrast rules");
  }
  if (data.isForcedColorsActive) {
    lines.push("⚡ Forced colors mode is ACTIVE");
  }
  lines.push(`${significant.length} element(s) with custom colors that would be reset`);
  if (data.forcedColorAdjustElements > 0) {
    lines.push(`${data.forcedColorAdjustElements} with forced-color-adjust: none`);
  }

  const sheetsLine = inaccessibleSheetsLine(data.inaccessibleSheets);
  if (sheetsLine) lines.push(sheetsLine);

  showResultPanel("Forced Colors Audit", issues, {
    summaryHtml: `<pre style="margin:4px 0 0; white-space:pre-wrap;">${lines.join("\n")}</pre>`,
  });
}
