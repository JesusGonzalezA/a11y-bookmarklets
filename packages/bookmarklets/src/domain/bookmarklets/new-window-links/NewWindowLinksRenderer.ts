import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { NewWindowLinkData } from "./types.js";

export function renderNewWindowLinks(data: NewWindowLinkData[], issues: Issue[]): void {
  renderOverlays(
    data.map((item) => ({
      selector: item.selector,
      color: item.hasWarning ? "#2ecc71" : "#e67e22",
      label: item.hasWarning ? "NEW TAB ✓" : "NEW TAB ⚠",
    })),
  );

  const withWarning = data.filter((d) => d.hasWarning).length;
  const withoutWarning = data.length - withWarning;
  const missingNoopener = data.filter((d) => !d.hasNoopener).length;

  const summary = [
    `${data.length} link(s) open in new window/tab`,
    withWarning > 0 ? `✓ ${withWarning} with warning` : null,
    withoutWarning > 0 ? `⚠ ${withoutWarning} without warning` : null,
    missingNoopener > 0 ? `ℹ ${missingNoopener} missing rel="noopener"` : null,
  ]
    .filter(Boolean)
    .join("\n");

  showResultPanel("New Window Links Audit", issues, {
    summaryHtml: `<pre style="margin:4px 0 0; white-space:pre-wrap;">${summary}</pre>`,
  });
}
