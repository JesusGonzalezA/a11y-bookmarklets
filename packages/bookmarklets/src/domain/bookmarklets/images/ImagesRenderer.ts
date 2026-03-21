import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { ImageData } from "./types.js";

export function renderImages(images: ImageData[], issues: Issue[]): void {
  renderOverlays(
    images.map((img) => {
      if (img.alt === null && !img.ariaLabel) {
        return { selector: img.selector, color: "#e74c3c", label: "NO ALT" };
      }
      if (img.isDecorative) {
        return { selector: img.selector, color: "#95a5a6", label: "decorative" };
      }
      const alt = img.alt ?? img.ariaLabel ?? "";
      const display = alt.length > 30 ? `${alt.slice(0, 30)}…` : alt;
      return { selector: img.selector, color: "#2ecc71", label: `alt: "${display}"` };
    }),
  );

  const missing = images.filter((i) => i.alt === null && !i.ariaLabel).length;
  const decorative = images.filter((i) => i.isDecorative).length;
  const withAlt = images.length - missing - decorative;

  showResultPanel(`Images (${images.length})`, issues, {
    summaryHtml: `<div>
        <div style="color:#2ecc71">✓ With alt: ${withAlt}</div>
        <div style="color:#95a5a6">○ Decorative: ${decorative}</div>
        <div style="color:#e74c3c">✗ Missing alt: ${missing}</div>
      </div>`,
  });
}
