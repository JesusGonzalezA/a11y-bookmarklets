/**
 * Skip Links bookmarklet — audits skip navigation links.
 *
 * WCAG: 2.4.1 Bypass Blocks
 */

import { SKIP_LINKS_CATALOG } from "../../catalog/skip-links.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditSkipLinks } from "./skip-links/SkipLinksAuditor.js";
import { renderSkipLinks } from "./skip-links/SkipLinksRenderer.js";
import type { SkipLinkData } from "./skip-links/types.js";

export class SkipLinksBookmarklet extends Bookmarklet<SkipLinkData[]> {
  constructor() {
    super(SKIP_LINKS_CATALOG);
  }

  protected audit(): AuditOutput<SkipLinkData[]> {
    return auditSkipLinks();
  }

  protected render(data: SkipLinkData[], issues: Issue[]): void {
    renderSkipLinks(data, issues);
  }
}
