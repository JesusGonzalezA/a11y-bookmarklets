import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { FocusableData } from "./types.js";

export function renderTabOrder(elements: FocusableData[], issues: Issue[]): void {
  renderOverlays(
    elements
      .filter((f) => f.visible)
      .map((f) => {
        const hasIssue = f.tabindex !== null && f.tabindex > 0;
        return {
          selector: f.selector,
          color: hasIssue ? "#e74c3c" : "#3498db",
          label: `${f.index}`,
        };
      }),
  );

  const listHtml = elements
    .map((f) => `<div>#${f.index} ${f.tag} — ${f.label || "(no label)"}</div>`)
    .join("");

  showResultPanel(`Tab Order (${elements.length} elements)`, issues, {
    summaryHtml: `<div>${listHtml}</div>`,
  });
}
