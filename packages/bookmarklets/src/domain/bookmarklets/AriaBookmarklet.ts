/**
 * ARIA bookmarklet — validates WAI-ARIA role usage and references.
 *
 * WCAG: 4.1.2 Name, Role, Value · 1.3.1 Info and Relationships
 */

import { ARIA_CATALOG } from "../../catalog/aria.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditAria } from "./aria/AriaAuditor.js";
import { renderAria } from "./aria/AriaRenderer.js";
import type { AriaData } from "./aria/types.js";

export class AriaBookmarklet extends Bookmarklet<AriaData[]> {
  constructor() {
    super(ARIA_CATALOG);
  }

  protected audit(): AuditOutput<AriaData[]> {
    return auditAria();
  }

  protected render(data: AriaData[], issues: Issue[]): void {
    renderAria(data, issues);
  }
}
