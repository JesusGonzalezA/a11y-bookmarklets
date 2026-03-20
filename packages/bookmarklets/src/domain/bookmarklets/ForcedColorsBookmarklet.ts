/**
 * Forced Colors bookmarklet — audits forced-colors and prefers-contrast support.
 *
 * WCAG: 1.4.11 Non-text Contrast, 1.4.3 Contrast (Minimum)
 */

import { FORCED_COLORS_CATALOG } from "../../catalog/forced-colors.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditForcedColors } from "./forced-colors/ForcedColorsAuditor.js";
import { renderForcedColors } from "./forced-colors/ForcedColorsRenderer.js";
import type { ForcedColorsData } from "./forced-colors/types.js";

export class ForcedColorsBookmarklet extends Bookmarklet<ForcedColorsData> {
  constructor() {
    super(FORCED_COLORS_CATALOG);
  }

  protected audit(): AuditOutput<ForcedColorsData> {
    return auditForcedColors();
  }

  protected render(data: ForcedColorsData, issues: Issue[]): void {
    renderForcedColors(data, issues);
  }
}
