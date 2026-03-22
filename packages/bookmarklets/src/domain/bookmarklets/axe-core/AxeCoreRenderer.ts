import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { AxeCoreData } from "./types.js";

export function renderAxeCore(data: AxeCoreData, issues: Issue[]): void {
  const overlayEntries = data.violations.flatMap((v) => {
    const color = v.impact === "critical" || v.impact === "serious" ? "#e74c3c" : "#e67e22";
    return v.nodes.map((n) => ({
      selector: n.selector,
      color,
      label: `${v.ruleId} (${v.impact})`,
    }));
  });

  renderOverlays(overlayEntries);

  const totalViolationNodes = data.violations.reduce((sum, v) => sum + v.nodes.length, 0);

  showResultPanel(`Axe Core (${data.violations.length} rules failed)`, issues, {
    summaryHtml: `<div>
        <div style="color:#e74c3c">✗ Violations: ${totalViolationNodes} element(s) in ${data.violations.length} rule(s)</div>
        <div style="color:#e67e22">⚠ Incomplete: ${data.incompleteCount} rule(s) need review</div>
        <div style="color:#2ecc71">✓ Passed: ${data.passCount} rule(s)</div>
        <div style="color:#3498db">ℹ Inapplicable: ${data.inapplicableCount} rule(s)</div>
      </div>`,
  });
}
