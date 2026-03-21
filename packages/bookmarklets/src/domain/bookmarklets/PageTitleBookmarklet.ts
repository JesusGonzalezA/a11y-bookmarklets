/**
 * Page Title bookmarklet — audits <title> element.
 *
 * WCAG: 2.4.2 Page Titled
 */

import { PAGE_TITLE_CATALOG } from "../../catalog/page-title.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditPageTitle } from "./page-title/PageTitleAuditor.js";
import { renderPageTitle } from "./page-title/PageTitleRenderer.js";
import type { PageTitleData } from "./page-title/types.js";

export class PageTitleBookmarklet extends Bookmarklet<PageTitleData> {
  constructor() {
    super(PAGE_TITLE_CATALOG);
  }

  protected audit(): AuditOutput<PageTitleData> {
    return auditPageTitle();
  }

  protected render(data: PageTitleData, issues: Issue[]): void {
    renderPageTitle(data, issues);
  }
}
