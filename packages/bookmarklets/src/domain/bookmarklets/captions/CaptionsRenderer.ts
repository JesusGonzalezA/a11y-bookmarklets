import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { CaptionsData } from "./types.js";

const CAPTION_KINDS = new Set(["captions", "subtitles"]);

export function renderCaptions(data: CaptionsData[], issues: Issue[]): void {
  renderOverlays(
    data.map((item) => {
      if (item.isEmbedded) {
        return {
          selector: item.selector,
          color: "#3498db",
          label: `${item.embedType} (check captions)`,
        };
      }
      const hasCaptions = item.tracks.some((t) => CAPTION_KINDS.has(t.kind));
      if (hasCaptions) {
        const langs = item.tracks
          .filter((t) => CAPTION_KINDS.has(t.kind))
          .map((t) => t.label || t.srclang)
          .join(", ");
        return { selector: item.selector, color: "#2ecc71", label: `captions: ${langs}` };
      }
      return { selector: item.selector, color: "#e74c3c", label: "NO CAPTIONS" };
    }),
  );

  const withCaptions = data.filter(
    (d) => !d.isEmbedded && d.tracks.some((t) => CAPTION_KINDS.has(t.kind)),
  ).length;
  const withoutCaptions = data.filter(
    (d) => !d.isEmbedded && !d.tracks.some((t) => CAPTION_KINDS.has(t.kind)),
  ).length;
  const embedded = data.filter((d) => d.isEmbedded).length;

  showResultPanel(`Captions Audit (${data.length})`, issues, {
    summaryHtml: `<div>
        <div style="color:#2ecc71">✓ With captions: ${withCaptions}</div>
        <div style="color:#e74c3c">✗ Without captions: ${withoutCaptions}</div>
        ${embedded > 0 ? `<div style="color:#3498db">ℹ Embedded (manual check): ${embedded}</div>` : ""}
      </div>`,
  });
}
