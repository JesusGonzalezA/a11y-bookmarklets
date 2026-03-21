import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { VideoControlData } from "./types.js";

export function renderVideoControls(data: VideoControlData[], issues: Issue[]): void {
  renderOverlays(
    data.map((item) => {
      if (!item.hasNativeControls && !item.hasCustomControls) {
        return {
          selector: item.selector,
          color: "#e74c3c",
          label: `<${item.tagName}> NO CONTROLS`,
        };
      }
      if (item.hasNativeControls) {
        return {
          selector: item.selector,
          color: "#2ecc71",
          label: `<${item.tagName}> native controls`,
        };
      }
      return {
        selector: item.selector,
        color: "#f39c12",
        label: `<${item.tagName}> custom controls`,
      };
    }),
  );

  const noControls = data.filter((d) => !d.hasNativeControls && !d.hasCustomControls).length;
  const native = data.filter((d) => d.hasNativeControls).length;
  const custom = data.filter((d) => !d.hasNativeControls && d.hasCustomControls).length;

  showResultPanel(`Video/Audio Controls (${data.length})`, issues, {
    summaryHtml: `<div>
        <div style="color:#2ecc71">✓ Native controls: ${native}</div>
        <div style="color:#f39c12">○ Custom controls: ${custom}</div>
        <div style="color:#e74c3c">✗ No controls: ${noControls}</div>
      </div>`,
  });
}
