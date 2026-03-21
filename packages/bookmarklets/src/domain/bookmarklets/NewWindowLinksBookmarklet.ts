/**
 * New Window Links bookmarklet — audits links with target="_blank".
 *
 * WCAG: 3.2.5 Change on Request
 */

import { NEW_WINDOW_LINKS_CATALOG } from "../../catalog/new-window-links.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditNewWindowLinks } from "./new-window-links/NewWindowLinksAuditor.js";
import { renderNewWindowLinks } from "./new-window-links/NewWindowLinksRenderer.js";
import type { NewWindowLinkData } from "./new-window-links/types.js";

export class NewWindowLinksBookmarklet extends Bookmarklet<NewWindowLinkData[]> {
  constructor() {
    super(NEW_WINDOW_LINKS_CATALOG);
  }

  protected audit(): AuditOutput<NewWindowLinkData[]> {
    return auditNewWindowLinks();
  }

  protected render(data: NewWindowLinkData[], issues: Issue[]): void {
    renderNewWindowLinks(data, issues);
  }
}
