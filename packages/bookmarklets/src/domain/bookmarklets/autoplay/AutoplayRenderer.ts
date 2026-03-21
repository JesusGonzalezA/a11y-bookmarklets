import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { AutoplayData } from "./types.js";

export function renderAutoplay(data: AutoplayData[], issues: Issue[]): void {
  renderOverlays(
    data.map((item) => {
      if (!item.hasAutoplay) {
        return {
          selector: item.selector,
          color: "#2ecc71",
          label: `<${item.tagName}> no autoplay`,
        };
      }
      if (item.isMuted) {
        return {
          selector: item.selector,
          color: "#f39c12",
          label: `<${item.tagName}> autoplay (muted)`,
        };
      }
      return {
        selector: item.selector,
        color: "#e74c3c",
        label: `<${item.tagName}> AUTOPLAY + AUDIO`,
      };
    }),
  );

  const autoplayWithAudio = data.filter((d) => d.hasAutoplay && !d.isMuted).length;
  const autoplayMuted = data.filter((d) => d.hasAutoplay && d.isMuted).length;
  const noAutoplay = data.filter((d) => !d.hasAutoplay).length;

  showResultPanel(`Autoplay Audit (${data.length})`, issues, {
    summaryHtml: `<div>
        <div style="color:#2ecc71">✓ No autoplay: ${noAutoplay}</div>
        <div style="color:#f39c12">○ Autoplay (muted): ${autoplayMuted}</div>
        <div style="color:#e74c3c">✗ Autoplay + audio: ${autoplayWithAudio}</div>
      </div>`,
  });
}
