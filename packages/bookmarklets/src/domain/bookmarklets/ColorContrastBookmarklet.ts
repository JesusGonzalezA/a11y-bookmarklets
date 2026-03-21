/**
 * Color Contrast bookmarklet — checks WCAG text contrast ratios.
 *
 * WCAG: 1.4.3 Contrast (Minimum) · 1.4.6 Contrast (Enhanced)
 */

import { COLOR_CONTRAST_CATALOG } from "../../catalog/color-contrast.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditColorContrast } from "./color-contrast/ColorContrastAuditor.js";
import { renderColorContrast } from "./color-contrast/ColorContrastRenderer.js";
import type { ColorContrastData } from "./color-contrast/types.js";

export class ColorContrastBookmarklet extends Bookmarklet<ColorContrastData[]> {
  constructor() {
    super(COLOR_CONTRAST_CATALOG);
  }

  protected audit(): AuditOutput<ColorContrastData[]> {
    return auditColorContrast();
  }

  protected render(data: ColorContrastData[], issues: Issue[]): void {
    renderColorContrast(data, issues);
  }
}
