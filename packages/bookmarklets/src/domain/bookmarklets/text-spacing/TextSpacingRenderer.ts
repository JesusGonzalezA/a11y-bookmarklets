import type { Issue } from "../../types.js";
import { onClearOverlays } from "../../../infrastructure/overlay/OverlayManager.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { TextSpacingData } from "./types.js";

const SPACING_STYLE_ID = "__a11y_text_spacing_test__";

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

  // Remove the injected spacing stylesheet when overlays are cleared
  onClearOverlays(() => {
    document.getElementById(SPACING_STYLE_ID)?.remove();
  });
}
