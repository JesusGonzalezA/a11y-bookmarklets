/**
 * Text Spacing bookmarklet — tests WCAG 1.4.12 Text Spacing resilience.
 *
 * WCAG: 1.4.12 Text Spacing
 */

import { TEXT_SPACING_CATALOG } from "../../catalog/text-spacing.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditTextSpacing } from "./text-spacing/TextSpacingAuditor.js";
import { renderTextSpacing } from "./text-spacing/TextSpacingRenderer.js";
import type { TextSpacingData } from "./text-spacing/types.js";

export class TextSpacingBookmarklet extends Bookmarklet<TextSpacingData[]> {
  constructor() {
    super(TEXT_SPACING_CATALOG);
  }

  protected audit(): AuditOutput<TextSpacingData[]> {
    return auditTextSpacing();
  }

  protected render(data: TextSpacingData[], issues: Issue[]): void {
    renderTextSpacing(data, issues);
  }
}
