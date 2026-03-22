import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { ReadingOrderResult } from "./types.js";

export function renderReadingOrder(result: ReadingOrderResult, issues: Issue[]): void {
  renderOverlays(
    result.items.map((item) => ({
      selector: item.selector,
      color: item.cssOrder ? "#e67e22" : "#e74c3c",
      label: `DOM #${item.domIndex + 1} → Visual #${item.visualIndex + 1}`,
    })),
  );

  const tauColor =
    result.kendallTau >= 0.7 ? "#2ecc71" : result.kendallTau >= 0.3 ? "#e67e22" : "#e74c3c";

  showResultPanel(`Reading Order (${result.totalElements} elements)`, issues, {
    summaryHtml: `<div>
      <div style="color:${tauColor}">Kendall τ = ${result.kendallTau.toFixed(2)}</div>
      <div>${result.items.length} displaced element(s)</div>
      <div>${result.totalElements} total content elements analyzed</div>
    </div>`,
  });
}
