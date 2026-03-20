/**
 * Inverted Colors bookmarklet — audits inverted-colors media query support.
 *
 * WCAG: 1.4.1 Use of Color, 1.4.3 Contrast (Minimum)
 */

import { INVERTED_COLORS_CATALOG } from "../../catalog/inverted-colors.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditInvertedColors } from "./inverted-colors/InvertedColorsAuditor.js";
import { renderInvertedColors } from "./inverted-colors/InvertedColorsRenderer.js";
import type { InvertedColorsData } from "./inverted-colors/types.js";

export class InvertedColorsBookmarklet extends Bookmarklet<InvertedColorsData> {
  constructor() {
    super(INVERTED_COLORS_CATALOG);
  }

  protected audit(): AuditOutput<InvertedColorsData> {
    return auditInvertedColors();
  }

  protected render(data: InvertedColorsData, issues: Issue[]): void {
    renderInvertedColors(data, issues);
  }
}
