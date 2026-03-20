import type { Issue } from "../../types.js";
import {
  inaccessibleSheetsLine,
  renderOverlays,
  renderSummaryPanel,
} from "../shared/render-helpers.js";
import type { ReducedMotionData } from "./types.js";

const MAX_RENDERED = 50;

export function renderReducedMotion(data: ReducedMotionData, _issues: Issue[]): void {
  const hasQuery = data.hasMediaQuery;

  renderOverlays(
    data.animatedElements.slice(0, MAX_RENDERED).map((entry) => ({
      selector: entry.selector,
      color: hasQuery ? "#2ecc71" : "#e74c3c",
      label: entry.property === "animation" ? "ANIM" : "TRANS",
    })),
  );

  const lines: string[] = [];
  if (hasQuery) {
    lines.push(`✓ ${data.mediaRuleCount} reduced-motion rule(s) found`);
  } else {
    lines.push("✗ No prefers-reduced-motion rules");
  }
  lines.push(`${data.animatedElements.length} animated element(s)`);
  if (data.webAnimationsCount > 0) {
    lines.push(`${data.webAnimationsCount} Web Animation(s)`);
  }

  const sheetsLine = inaccessibleSheetsLine(data.inaccessibleSheets);
  if (sheetsLine) lines.push(sheetsLine);

  renderSummaryPanel("Reduced Motion Audit", lines);
}
