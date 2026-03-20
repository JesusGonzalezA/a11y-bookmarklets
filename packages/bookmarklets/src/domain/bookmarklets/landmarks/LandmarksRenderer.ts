import type { Issue } from "../../types.js";
import { renderOverlays, renderSummaryPanel } from "../shared/render-helpers.js";
import type { LandmarkData } from "./types.js";
import { LANDMARK_COLORS } from "./types.js";

export function renderLandmarks(landmarks: LandmarkData[], _issues: Issue[]): void {
  renderOverlays(
    landmarks.map((lm) => ({
      selector: lm.selector,
      color: LANDMARK_COLORS[lm.role] ?? "#666",
      label: lm.label ? `${lm.role} ("${lm.label}")` : lm.role,
    })),
  );

  const summary = landmarks.map((l) => `  ${l.role}${l.label ? ` — "${l.label}"` : ""}`).join("\n");

  renderSummaryPanel(`Landmarks (${landmarks.length})`, [summary]);
}
