import type { Issue } from "../../types.js";
import {
  inaccessibleSheetsLine,
  renderOverlays,
  renderSummaryPanel,
} from "../shared/render-helpers.js";
import type { InvertedColorsData } from "./types.js";

const MAX_RENDERED = 30;

export function renderInvertedColors(data: InvertedColorsData, _issues: Issue[]): void {
  renderOverlays(
    data.vulnerableElements.slice(0, MAX_RENDERED).map((entry) => {
      let color: string;
      if (entry.hasCompensation) color = "#2ecc71";
      else if (data.hasMediaQuery) color = "#f39c12";
      else color = "#e74c3c";

      return {
        selector: entry.selector,
        color,
        label: entry.type.toUpperCase(),
      };
    }),
  );

  const uncompensated = data.vulnerableElements.filter((v) => !v.hasCompensation).length;
  const compensated = data.vulnerableElements.filter((v) => v.hasCompensation).length;

  const lines: string[] = [];
  if (data.hasMediaQuery) {
    lines.push(`✓ ${data.mediaRuleCount} inverted-colors rule(s) found`);
  } else {
    lines.push("✗ No inverted-colors rules");
  }
  lines.push(`${data.vulnerableElements.length} vulnerable element(s)`);
  if (compensated > 0) lines.push(`  ${compensated} with compensation`);
  if (uncompensated > 0) lines.push(`  ${uncompensated} without compensation`);

  const sheetsLine = inaccessibleSheetsLine(data.inaccessibleSheets);
  if (sheetsLine) lines.push(sheetsLine);

  renderSummaryPanel("Inverted Colors Audit", lines);
}
