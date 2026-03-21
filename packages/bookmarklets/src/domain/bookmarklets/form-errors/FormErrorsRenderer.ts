import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { FormErrorData } from "./types.js";

export function renderFormErrors(data: FormErrorData[], issues: Issue[]): void {
  renderOverlays(
    data
      .filter((d) => d.isInvalid)
      .map((item) => ({
        selector: item.selector,
        color: item.hasErrorMessage ? "#2ecc71" : "#e74c3c",
        label: item.hasErrorMessage ? "ERROR MSG ✓" : "NO ERROR MSG",
      })),
  );

  const invalid = data.filter((d) => d.isInvalid).length;
  const withMsg = data.filter((d) => d.isInvalid && d.hasErrorMessage).length;
  const withoutMsg = invalid - withMsg;

  const summary = [
    `${invalid} field(s) marked invalid`,
    withMsg > 0 ? `✓ ${withMsg} with error message` : null,
    withoutMsg > 0 ? `✗ ${withoutMsg} without error message` : null,
  ]
    .filter(Boolean)
    .join("\n");

  showResultPanel("Form Errors Audit", issues, {
    summaryHtml: `<pre style="margin:4px 0 0; white-space:pre-wrap;">${summary}</pre>`,
  });
}
