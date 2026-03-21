/**
 * Touch Target bookmarklet — checks interactive element sizes against WCAG thresholds.
 *
 * WCAG: 2.5.8 Target Size (Minimum) · 2.5.5 Target Size (Enhanced)
 */

import { TOUCH_TARGET_CATALOG } from "../../catalog/touch-target.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditTouchTargets } from "./touch-target/TouchTargetAuditor.js";
import { renderTouchTargets } from "./touch-target/TouchTargetRenderer.js";
import type { TouchTargetData } from "./touch-target/types.js";

export class TouchTargetBookmarklet extends Bookmarklet<TouchTargetData[]> {
  constructor() {
    super(TOUCH_TARGET_CATALOG);
  }

  protected audit(): AuditOutput<TouchTargetData[]> {
    return auditTouchTargets();
  }

  protected render(data: TouchTargetData[], issues: Issue[]): void {
    renderTouchTargets(data, issues);
  }
}
