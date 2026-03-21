/**
 * Meta Tags bookmarklet — audits meta tags relevant to accessibility.
 *
 * WCAG: 2.2.1 Timing Adjustable, 3.2.5 Change on Request
 */

import { META_TAGS_CATALOG } from "../../catalog/meta-tags.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditMetaTags } from "./meta-tags/MetaTagsAuditor.js";
import { renderMetaTags } from "./meta-tags/MetaTagsRenderer.js";
import type { MetaTagsData } from "./meta-tags/types.js";

export class MetaTagsBookmarklet extends Bookmarklet<MetaTagsData> {
  constructor() {
    super(META_TAGS_CATALOG);
  }

  protected audit(): AuditOutput<MetaTagsData> {
    return auditMetaTags();
  }

  protected render(data: MetaTagsData, issues: Issue[]): void {
    renderMetaTags(data, issues);
  }
}
