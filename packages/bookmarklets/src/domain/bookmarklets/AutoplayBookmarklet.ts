/**
 * Autoplay bookmarklet — detects media with autoplay and checks for user controls.
 *
 * WCAG: 1.4.2 Audio Control
 */

import { AUTOPLAY_CATALOG } from "../../catalog/autoplay.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditAutoplay } from "./autoplay/AutoplayAuditor.js";
import { renderAutoplay } from "./autoplay/AutoplayRenderer.js";
import type { AutoplayData } from "./autoplay/types.js";

export class AutoplayBookmarklet extends Bookmarklet<AutoplayData[]> {
  constructor() {
    super(AUTOPLAY_CATALOG);
  }

  protected audit(): AuditOutput<AutoplayData[]> {
    return auditAutoplay();
  }

  protected render(data: AutoplayData[], issues: Issue[]): void {
    renderAutoplay(data, issues);
  }
}
