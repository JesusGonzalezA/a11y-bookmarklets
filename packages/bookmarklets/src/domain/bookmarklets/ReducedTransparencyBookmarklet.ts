/**
 * Reduced Transparency bookmarklet — audits prefers-reduced-transparency support.
 *
 * WCAG: 1.4.11 Non-text Contrast
 */

import { REDUCED_TRANSPARENCY_CATALOG } from "../../catalog/reduced-transparency.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditReducedTransparency } from "./reduced-transparency/ReducedTransparencyAuditor.js";
import { renderReducedTransparency } from "./reduced-transparency/ReducedTransparencyRenderer.js";
import type { ReducedTransparencyData } from "./reduced-transparency/types.js";

export class ReducedTransparencyBookmarklet extends Bookmarklet<ReducedTransparencyData> {
  constructor() {
    super(REDUCED_TRANSPARENCY_CATALOG);
  }

  protected audit(): AuditOutput<ReducedTransparencyData> {
    return auditReducedTransparency();
  }

  protected render(data: ReducedTransparencyData, issues: Issue[]): void {
    renderReducedTransparency(data, issues);
  }
}
