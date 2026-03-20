import type { Issue } from "../../types.js";
import {
  inaccessibleSheetsLine,
  renderOverlays,
  renderSummaryPanel,
} from "../shared/render-helpers.js";
import type { ReducedTransparencyData } from "./types.js";

const MAX_RENDERED = 40;

export function renderReducedTransparency(data: ReducedTransparencyData, _issues: Issue[]): void {
  const hasQuery = data.hasMediaQuery;

  renderOverlays(
    data.transparentElements.slice(0, MAX_RENDERED).map((entry) => {
      let labelText = entry.property;
      if (entry.property === "opacity") labelText = `opacity: ${entry.value}`;
      if (entry.property === "backdrop-filter") labelText = "backdrop-filter";

      return {
        selector: entry.selector,
        color: hasQuery ? "#2ecc71" : "#e67e22",
        label: labelText,
      };
    }),
  );

  const lines: string[] = [];
  if (hasQuery) {
    lines.push(`✓ ${data.mediaRuleCount} reduced-transparency rule(s)`);
  } else {
    lines.push("✗ No prefers-reduced-transparency rules");
  }
  lines.push(`${data.transparentElements.length} transparent element(s)`);

  const byProperty: Record<string, number> = {};
  for (const el of data.transparentElements) {
    byProperty[el.property] = (byProperty[el.property] ?? 0) + 1;
  }
  for (const [prop, count] of Object.entries(byProperty)) {
    lines.push(`  ${count}× ${prop}`);
  }

  const sheetsLine = inaccessibleSheetsLine(data.inaccessibleSheets);
  if (sheetsLine) lines.push(sheetsLine);

  renderSummaryPanel("Reduced Transparency Audit", lines);
}
