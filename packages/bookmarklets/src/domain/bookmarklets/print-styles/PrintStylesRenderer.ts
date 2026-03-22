import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { PrintStylesData } from "./types.js";

const TYPE_COLORS: Record<string, string> = {
  "hidden-in-print": "#95a5a6",
  "background-image": "#e67e22",
  "nav-visible-in-print": "#3498db",
};

export function renderPrintStyles(data: PrintStylesData, issues: Issue[]): void {
  renderOverlays(
    data.elements.map((el) => ({
      selector: el.selector,
      color: TYPE_COLORS[el.type] ?? "#e74c3c",
      label: el.type,
    })),
  );

  showResultPanel(`Print Styles (${data.printRuleCount} rules)`, issues, {
    summaryHtml: `<div>
      <div>${data.hasPrintRules ? "✓" : "✗"} @media print rules: ${data.printRuleCount}</div>
      <div>${data.elements.filter((e) => e.type === "hidden-in-print").length} element(s) hidden in print</div>
      <div>${data.elements.filter((e) => e.type === "background-image").length} background image(s) at risk</div>
      ${data.inaccessibleSheets > 0 ? `<div>⚠ ${data.inaccessibleSheets} cross-origin sheet(s) skipped</div>` : ""}
    </div>`,
  });
}
