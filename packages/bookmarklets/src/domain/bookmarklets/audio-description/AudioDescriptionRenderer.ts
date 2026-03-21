import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { AudioDescriptionData } from "./types.js";

export function renderAudioDescription(data: AudioDescriptionData[], issues: Issue[]): void {
  renderOverlays(
    data.map((item) => {
      if (item.hasDescriptionTrack) {
        return { selector: item.selector, color: "#2ecc71", label: "audio description track" };
      }
      if (item.hasAlternativeLink) {
        return { selector: item.selector, color: "#2ecc71", label: "AD link found" };
      }
      if (item.isMuted) {
        return { selector: item.selector, color: "#95a5a6", label: "muted (AD n/a)" };
      }
      return { selector: item.selector, color: "#e74c3c", label: "NO AUDIO DESCRIPTION" };
    }),
  );

  const withAD = data.filter((d) => d.hasDescriptionTrack || d.hasAlternativeLink).length;
  const withoutAD = data.filter(
    (d) => !d.hasDescriptionTrack && !d.hasAlternativeLink && !d.isMuted,
  ).length;
  const muted = data.filter(
    (d) => !d.hasDescriptionTrack && !d.hasAlternativeLink && d.isMuted,
  ).length;

  showResultPanel(`Audio Description (${data.length})`, issues, {
    summaryHtml: `<div>
        <div style="color:#2ecc71">✓ With audio description: ${withAD}</div>
        <div style="color:#e74c3c">✗ Without audio description: ${withoutAD}</div>
        ${muted > 0 ? `<div style="color:#95a5a6">○ Muted (likely decorative): ${muted}</div>` : ""}
      </div>`,
  });
}
