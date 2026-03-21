import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { ButtonData } from "./types.js";

export function renderButtons(data: ButtonData[], issues: Issue[]): void {
  renderOverlays(
    data.map((item) => ({
      selector: item.selector,
      color:
        item.isEmpty || item.isFauxButton
          ? "#e74c3c"
          : item.labelInNameViolation
            ? "#e67e22"
            : "#2ecc71",
      label: item.isFauxButton ? "FAUX BTN" : item.isEmpty ? "NO NAME" : "BTN",
    })),
  );

  const empty = data.filter((d) => d.isEmpty).length;
  const faux = data.filter((d) => d.isFauxButton).length;
  const labelViolations = data.filter((d) => d.labelInNameViolation).length;

  const summary = [
    `${data.length} button(s) found`,
    empty > 0 ? `✗ ${empty} without accessible name` : null,
    faux > 0 ? `✗ ${faux} faux buttons (onclick without role)` : null,
    labelViolations > 0 ? `⚠ ${labelViolations} label-in-name violations` : null,
  ]
    .filter(Boolean)
    .join("\n");

  showResultPanel(`Buttons (${data.length})`, issues, {
    summaryHtml: `<pre style="margin:4px 0 0; white-space:pre-wrap;">${summary}</pre>`,
  });
}
