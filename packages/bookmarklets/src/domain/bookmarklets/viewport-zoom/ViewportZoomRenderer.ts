import type { Issue } from "../../types.js";
import { showResultPanel } from "../shared/render-helpers.js";
import type { ViewportZoomData } from "./types.js";

export function renderViewportZoom(data: ViewportZoomData, issues: Issue[]): void {
  const lines: string[] = [];

  if (!data.hasViewportMeta) {
    lines.push('ℹ No <meta name="viewport"> found');
    lines.push("  Browser allows zoom by default");
  } else {
    lines.push(`Viewport: ${data.content}`);

    // user-scalable
    if (data.userScalable === "no" || data.userScalable === "0") {
      lines.push("✗ user-scalable=no — zoom disabled!");
    } else {
      lines.push("✓ user-scalable not restricted");
    }

    // maximum-scale
    if (data.maximumScale !== null) {
      if (data.maximumScale < 2) {
        lines.push(`✗ maximum-scale=${data.maximumScale} (< 200%)`);
      } else if (data.maximumScale < 5) {
        lines.push(`⚠ maximum-scale=${data.maximumScale} (limited)`);
      } else {
        lines.push(`✓ maximum-scale=${data.maximumScale}`);
      }
    }

    // width
    if (data.width === "device-width") {
      lines.push("✓ width=device-width (responsive)");
    } else if (data.width) {
      lines.push(`⚠ fixed width=${data.width}`);
    }
  }

  showResultPanel("Viewport & Zoom Audit", issues, {
    summaryHtml: `<pre style="margin:4px 0 0; white-space:pre-wrap;">${lines.join("\n")}</pre>`,
  });
}
