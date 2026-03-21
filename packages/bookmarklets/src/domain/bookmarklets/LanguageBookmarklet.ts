/**
 * Language bookmarklet — audits html lang attribute and language of parts.
 *
 * WCAG: 3.1.1 Language of Page, 3.1.2 Language of Parts
 */

import { LANGUAGE_CATALOG } from "../../catalog/language.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditLanguage } from "./language/LanguageAuditor.js";
import { renderLanguage } from "./language/LanguageRenderer.js";
import type { LanguageData } from "./language/types.js";

export class LanguageBookmarklet extends Bookmarklet<LanguageData> {
  constructor() {
    super(LANGUAGE_CATALOG);
  }

  protected audit(): AuditOutput<LanguageData> {
    return auditLanguage();
  }

  protected render(data: LanguageData, issues: Issue[]): void {
    renderLanguage(data, issues);
  }
}
