import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { SkipLinkData } from "./types.js";

export function renderSkipLinks(data: SkipLinkData[], issues: Issue[]): void {
  renderOverlays(
    data.map((item) => ({
      selector: item.selector,
      color: item.targetExists ? "#2ecc71" : "#e74c3c",
      label: `SKIP → #${item.targetId}`,
    })),
  );

  const found = data.length;
  const valid = data.filter((d) => d.targetExists).length;

  const summary =
    found === 0
      ? "✗ No skip navigation links found"
      : [
          `${found} skip link(s) found`,
          `${valid} with valid targets`,
          data.some((d) => d.isFirstFocusable) ? "✓ First focusable" : "⚠ Not the first focusable",
        ].join("\n");

  showResultPanel("Skip Links Audit", issues, {
    summaryHtml: `<pre style="margin:4px 0 0; white-space:pre-wrap;">${summary}</pre>`,
  });
}
