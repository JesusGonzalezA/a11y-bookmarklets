import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { LiveRegionData } from "./types.js";

const COLORS: Record<string, string> = {
  assertive: "#e53e3e",
  polite: "#3182ce",
  off: "#a0aec0",
};

export function renderLiveRegions(data: LiveRegionData[], issues: Issue[]): void {
  renderOverlays(
    data.map((d) => ({
      selector: d.selector,
      color: COLORS[d.liveValue] ?? "#999",
      label: `live=${d.liveValue}${d.role ? ` (${d.role})` : ""}`,
    })),
  );

  const assertive = data.filter((d) => d.liveValue === "assertive").length;
  const polite = data.filter((d) => d.liveValue === "polite").length;
  const off = data.filter((d) => d.liveValue === "off").length;

  showResultPanel(`Live Regions (${data.length})`, issues, {
    summaryHtml: `<p style="margin:4px 0 0;">assertive: ${assertive} · polite: ${polite} · off: ${off}</p>`,
  });
}
