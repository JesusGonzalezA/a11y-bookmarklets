/**
 * Headings bookmarklet — audits heading structure (h1–h6).
 *
 * WCAG: 1.3.1 Info and Relationships, 2.4.6 Headings and Labels
 */

import { HEADINGS_CATALOG } from "../../catalog/headings.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditHeadings } from "./headings/HeadingsAuditor.js";
import { renderHeadings } from "./headings/HeadingsRenderer.js";
import type { HeadingData } from "./headings/types.js";

export class HeadingsBookmarklet extends Bookmarklet<HeadingData[]> {
  constructor() {
    super(HEADINGS_CATALOG);
  }

  protected audit(): AuditOutput<HeadingData[]> {
    return auditHeadings();
  }

  protected render(data: HeadingData[], issues: Issue[]): void {
    renderHeadings(data, issues);
  }
}
