import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { TouchTargetData } from "./types.js";

export function renderTouchTargets(data: TouchTargetData[], issues: Issue[]): void {
  renderOverlays(
    data
      .filter((d) => !d.passesAA)
      .map((d) => ({
        selector: d.selector,
        color: "#e53e3e",
        label: `${d.width}×${d.height}`,
      })),
  );

  const failAA = data.filter((d) => !d.passesAA).length;
  const passAA = data.filter((d) => d.passesAA && !d.passesAAA).length;
  const passAAA = data.filter((d) => d.passesAAA).length;

  showResultPanel(`Touch Targets (${data.length})`, issues, {
    summaryHtml: `<p style="margin:4px 0 0;">Fail AA: ${failAA} · Pass AA only: ${passAA} · Pass AAA: ${passAAA}</p>`,
  });
}
