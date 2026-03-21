/**
 * Captions bookmarklet — audits video elements for caption/subtitle tracks.
 *
 * WCAG: 1.2.2 Captions (Prerecorded), 1.2.4 Captions (Live)
 */

import { CAPTIONS_CATALOG } from "../../catalog/captions.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditCaptions } from "./captions/CaptionsAuditor.js";
import { renderCaptions } from "./captions/CaptionsRenderer.js";
import type { CaptionsData } from "./captions/types.js";

export class CaptionsBookmarklet extends Bookmarklet<CaptionsData[]> {
  constructor() {
    super(CAPTIONS_CATALOG);
  }

  protected audit(): AuditOutput<CaptionsData[]> {
    return auditCaptions();
  }

  protected render(data: CaptionsData[], issues: Issue[]): void {
    renderCaptions(data, issues);
  }
}
