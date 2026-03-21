import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { HiddenContentData } from "./types.js";

const COLORS: Record<string, string> = {
  "aria-hidden": "#e53e3e",
  "display-none": "#a0aec0",
  "visibility-hidden": "#a0aec0",
  "hidden-attr": "#a0aec0",
  "sr-only": "#38a169",
  "clip-rect": "#38a169",
  offscreen: "#38a169",
  "opacity-0": "#ecc94b",
};

export function renderHiddenContent(data: HiddenContentData[], issues: Issue[]): void {
  // Only render overlays for elements that are somehow visible or partially visible
  const visible = data.filter((d) => !["display-none", "hidden-attr"].includes(d.method));

  renderOverlays(
    visible.map((d) => ({
      selector: d.selector,
      color: COLORS[d.method] ?? "#999",
      label: d.method,
    })),
  );

  const byMethod = new Map<string, number>();
  for (const d of data) {
    byMethod.set(d.method, (byMethod.get(d.method) ?? 0) + 1);
  }

  const summary = Array.from(byMethod.entries())
    .map(([m, c]) => `${m}: ${c}`)
    .join(" · ");

  showResultPanel(`Hidden Content (${data.length})`, issues, {
    summaryHtml: `<p style="margin:4px 0 0;">${summary}</p>`,
  });
}
