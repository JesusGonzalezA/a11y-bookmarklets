/**
 * Links bookmarklet — audits all links for accessible text and behavior.
 *
 * WCAG: 2.4.4 Link Purpose (In Context), 2.4.9 Link Purpose (Link Only)
 */

import { LINKS_CATALOG } from "../../catalog/links.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditLinks } from "./links/LinksAuditor.js";
import { renderLinks } from "./links/LinksRenderer.js";
import type { LinkData } from "./links/types.js";

export class LinksBookmarklet extends Bookmarklet<LinkData[]> {
  constructor() {
    super(LINKS_CATALOG);
  }

  protected audit(): AuditOutput<LinkData[]> {
    return auditLinks();
  }

  protected render(data: LinkData[], issues: Issue[]): void {
    renderLinks(data, issues);
  }
}
