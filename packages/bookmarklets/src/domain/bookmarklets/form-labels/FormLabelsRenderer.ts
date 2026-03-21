import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { FormLabelData } from "./types.js";

const SOURCE_COLORS: Record<string, string> = {
  "aria-labelledby": "#2ecc71",
  "aria-label": "#2ecc71",
  "label-for": "#2ecc71",
  "label-wrap": "#2ecc71",
  title: "#f39c12",
  placeholder: "#e67e22",
  none: "#e74c3c",
};

export function renderFormLabels(data: FormLabelData[], issues: Issue[]): void {
  renderOverlays(
    data.map((item) => ({
      selector: item.selector,
      color: SOURCE_COLORS[item.nameSource] ?? "#999",
      label: item.nameSource === "none" ? "NO LABEL" : item.nameSource,
    })),
  );

  const noLabel = data.filter((d) => d.nameSource === "none").length;
  const placeholderOnly = data.filter((d) => d.hasPlaceholderOnly).length;
  const labeled = data.length - noLabel - placeholderOnly;

  const summary = [
    `${data.length} form control(s) found`,
    `✓ ${labeled} labeled`,
    placeholderOnly > 0 ? `⚠ ${placeholderOnly} placeholder-only` : null,
    noLabel > 0 ? `✗ ${noLabel} without label` : null,
  ]
    .filter(Boolean)
    .join("\n");

  showResultPanel(`Form Labels (${data.length})`, issues, {
    summaryHtml: `<pre style="margin:4px 0 0; white-space:pre-wrap;">${summary}</pre>`,
  });
}
