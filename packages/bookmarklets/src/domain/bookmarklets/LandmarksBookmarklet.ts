/**
 * Landmarks bookmarklet — audits semantic landmark regions.
 *
 * WCAG: 1.3.1 Info and Relationships, 2.4.1 Bypass Blocks
 */

import { LANDMARKS_CATALOG } from "../../catalog/landmarks.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditLandmarks } from "./landmarks/LandmarksAuditor.js";
import { renderLandmarks } from "./landmarks/LandmarksRenderer.js";
import type { LandmarkData } from "./landmarks/types.js";

export class LandmarksBookmarklet extends Bookmarklet<LandmarkData[]> {
  constructor() {
    super(LANDMARKS_CATALOG);
  }

  protected audit(): AuditOutput<LandmarkData[]> {
    return auditLandmarks();
  }

  protected render(data: LandmarkData[], issues: Issue[]): void {
    renderLandmarks(data, issues);
  }
}
