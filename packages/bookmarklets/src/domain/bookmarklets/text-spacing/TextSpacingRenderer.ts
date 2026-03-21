import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { TextSpacingData } from "./types.js";

export function renderTextSpacing(data: TextSpacingData[], issues: Issue[]): void {
  const problematic = data.filter((d) => !d.overflowsBefore && d.overflowsAfter && d.clipsContent);

  renderOverlays(
    problematic.map((d) => ({
      selector: d.selector,
      color: "#e53e3e",
      label: "clips text",
    })),
  );

  const clipped = problematic.length;
  const alreadyOverflow = data.filter(
    (d) => d.overflowsBefore && d.overflowsAfter && d.clipsContent,
  ).length;

  showResultPanel(`Text Spacing (${data.length} containers)`, issues, {
    summaryHtml: `<p style="margin:4px 0 0;">Content clipped: ${clipped} · Pre-existing overflow: ${alreadyOverflow}</p>`,
  });
}
