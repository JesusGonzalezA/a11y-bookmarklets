/**
 * Dark Mode bookmarklet — audits prefers-color-scheme support.
 *
 * WCAG: 1.4.3 Contrast (Minimum), 1.4.6 Contrast (Enhanced), 1.4.11 Non-text Contrast
 */

import { DARK_MODE_CATALOG } from "../../catalog/dark-mode.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditDarkMode } from "./dark-mode/DarkModeAuditor.js";
import { renderDarkMode } from "./dark-mode/DarkModeRenderer.js";
import type { DarkModeData } from "./dark-mode/types.js";

export class DarkModeBookmarklet extends Bookmarklet<DarkModeData> {
  constructor() {
    super(DARK_MODE_CATALOG);
  }

  protected audit(): AuditOutput<DarkModeData> {
    return auditDarkMode();
  }

  protected render(data: DarkModeData, issues: Issue[]): void {
    renderDarkMode(data, issues);
  }
}
