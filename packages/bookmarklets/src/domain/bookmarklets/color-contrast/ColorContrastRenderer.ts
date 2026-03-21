import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { ColorContrastData } from "./types.js";

export function renderColorContrast(data: ColorContrastData[], issues: Issue[]): void {
  renderOverlays(
    data
      .filter((d) => !d.passesAA)
      .map((d) => ({
        selector: d.selector,
        color: "#e53e3e",
        label: `${d.ratio}:1`,
      })),
  );

  const failAA = data.filter((d) => !d.passesAA).length;
  const passAA = data.filter((d) => d.passesAA && !d.passesAAA).length;
  const passAAA = data.filter((d) => d.passesAAA).length;

  showResultPanel(`Color Contrast (${data.length})`, issues, {
    summaryHtml: `<p style="margin:4px 0 0;">Fail AA: ${failAA} · Pass AA: ${passAA} · Pass AAA: ${passAAA}</p>`,
  });
}
