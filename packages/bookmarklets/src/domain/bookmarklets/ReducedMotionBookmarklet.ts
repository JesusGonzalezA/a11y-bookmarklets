/**
 * Reduced Motion bookmarklet — audits prefers-reduced-motion support.
 *
 * WCAG: 2.3.3 Animation from Interactions, 2.3.1 Three Flashes or Below Threshold
 */

import { REDUCED_MOTION_CATALOG } from "../../catalog/reduced-motion.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditReducedMotion } from "./reduced-motion/ReducedMotionAuditor.js";
import { renderReducedMotion } from "./reduced-motion/ReducedMotionRenderer.js";
import type { ReducedMotionData } from "./reduced-motion/types.js";

export class ReducedMotionBookmarklet extends Bookmarklet<ReducedMotionData> {
  constructor() {
    super(REDUCED_MOTION_CATALOG);
  }

  protected audit(): AuditOutput<ReducedMotionData> {
    return auditReducedMotion();
  }

  protected render(data: ReducedMotionData, issues: Issue[]): void {
    renderReducedMotion(data, issues);
  }
}
