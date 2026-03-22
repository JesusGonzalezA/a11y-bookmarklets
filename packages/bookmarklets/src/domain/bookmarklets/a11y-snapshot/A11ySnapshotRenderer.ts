import type { Issue } from "../../types.js";
import { showResultPanel } from "../shared/render-helpers.js";
import type { A11ySnapshotData } from "./types.js";

export function renderA11ySnapshot(data: A11ySnapshotData, issues: Issue[]): void {
  // No visual overlays — this is a data-only bookmarklet
  const s = data.stats;

  showResultPanel("A11y Snapshot", issues, {
    summaryHtml: `<div>
      <div><strong>${data.title || "(no title)"}</strong></div>
      <div>Lang: ${data.lang || "none"} | Elements: ${s.totalElements}</div>
      <div>Headings: ${s.headingsTotal} | Landmarks: ${s.landmarksTotal}</div>
      <div>Images: ${s.imagesTotal} (${s.imagesWithAlt} with alt, ${s.imagesWithoutAlt} missing)</div>
      <div>Links: ${s.linksTotal} | Buttons: ${s.buttonsTotal} | Forms: ${s.formControlsTotal}</div>
      <div>Interactive: ${s.interactiveElements} | Hidden: ${s.hiddenElements} | aria-hidden: ${s.ariaHiddenElements}</div>
    </div>`,
  });
}
