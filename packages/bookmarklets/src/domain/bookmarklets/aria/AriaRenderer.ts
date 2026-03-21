import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { AriaData } from "./types.js";

const COLORS: Record<string, string> = {
  "invalid-role": "#e53e3e",
  "redundant-role": "#ecc94b",
  "aria-hidden-focusable": "#e53e3e",
  "missing-required-prop": "#dd6b20",
  "broken-reference": "#e53e3e",
  valid: "#38a169",
};

export function renderAria(data: AriaData[], issues: Issue[]): void {
  renderOverlays(
    data
      .filter((d) => d.issueType !== "valid")
      .map((d) => ({
        selector: d.selector,
        color: COLORS[d.issueType] ?? "#999",
        label: d.issueType,
      })),
  );

  const errorCount = data.filter((d) =>
    ["invalid-role", "aria-hidden-focusable", "missing-required-prop", "broken-reference"].includes(
      d.issueType,
    ),
  ).length;
  const warningCount = data.filter((d) => d.issueType === "redundant-role").length;
  const validCount = data.filter((d) => d.issueType === "valid").length;

  showResultPanel("ARIA Validation", issues, {
    summaryHtml: `<p style="margin:4px 0 0;">Errors: ${errorCount} · Warnings: ${warningCount} · Valid: ${validCount}</p>`,
  });
}
