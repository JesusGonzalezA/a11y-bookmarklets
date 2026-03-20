import type { Issue } from "../../types.js";
import { renderHtmlPanel, renderOverlays } from "../shared/render-helpers.js";
import type { FocusableData } from "./types.js";

export function renderTabOrder(elements: FocusableData[], _issues: Issue[]): void {
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
    .slice(0, 20)
    .map((f) => `<div>#${f.index} ${f.tag} — ${f.label || "(no label)"}</div>`)
    .join("");

  const moreHtml = elements.length > 20 ? `<div>…and ${elements.length - 20} more</div>` : "";

  renderHtmlPanel(
    `Tab Order (${elements.length} elements)`,
    `<div style="font-size:11px; margin-top:8px;">${listHtml}${moreHtml}</div>`,
  );
}
