import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { GroupedFieldsData } from "./types.js";

const GROUP_COLORS: Record<string, string> = {
  fieldset: "#2ecc71",
  "role-group": "#3498db",
  "role-radiogroup": "#3498db",
  ungrouped: "#e74c3c",
};

export function renderGroupedFields(data: GroupedFieldsData[], issues: Issue[]): void {
  renderOverlays(
    data.map((item) => ({
      selector: item.selector,
      color: GROUP_COLORS[item.groupType] ?? "#999",
      label:
        item.groupType === "ungrouped"
          ? `UNGROUPED: ${item.name}`
          : `${item.groupType}: ${item.legend || item.name}`,
    })),
  );

  const grouped = data.filter((d) => d.groupType !== "ungrouped").length;
  const ungrouped = data.filter((d) => d.groupType === "ungrouped").length;

  const summary = [
    `${data.length} control group(s) found`,
    grouped > 0 ? `✓ ${grouped} properly grouped` : null,
    ungrouped > 0 ? `✗ ${ungrouped} ungrouped` : null,
  ]
    .filter(Boolean)
    .join("\n");

  showResultPanel("Grouped Fields Audit", issues, {
    summaryHtml: `<pre style="margin:4px 0 0; white-space:pre-wrap;">${summary}</pre>`,
  });
}
