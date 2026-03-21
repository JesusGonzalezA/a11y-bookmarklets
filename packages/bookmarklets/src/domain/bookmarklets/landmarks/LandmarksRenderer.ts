import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { LandmarkData } from "./types.js";
import { LANDMARK_COLORS } from "./types.js";

export function renderLandmarks(landmarks: LandmarkData[], issues: Issue[]): void {
  renderOverlays(
    landmarks.map((lm) => ({
      selector: lm.selector,
      color: LANDMARK_COLORS[lm.role] ?? "#666",
      label: lm.label ? `${lm.role} ("${lm.label}")` : lm.role,
    })),
  );

  const summary = landmarks.map((l) => `  ${l.role}${l.label ? ` — "${l.label}"` : ""}`).join("\n");

  showResultPanel(`Landmarks (${landmarks.length})`, issues, {
    summaryHtml: `<pre style="margin:4px 0 0; white-space:pre-wrap;">${summary}</pre>`,
  });
}
