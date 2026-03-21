/**
 * Hidden Content bookmarklet — reveals content hidden from users or assistive technology.
 *
 * WCAG: 1.3.2 Meaningful Sequence · 4.1.2 Name, Role, Value
 */

import { HIDDEN_CONTENT_CATALOG } from "../../catalog/hidden-content.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditHiddenContent } from "./hidden-content/HiddenContentAuditor.js";
import { renderHiddenContent } from "./hidden-content/HiddenContentRenderer.js";
import type { HiddenContentData } from "./hidden-content/types.js";

export class HiddenContentBookmarklet extends Bookmarklet<HiddenContentData[]> {
  constructor() {
    super(HIDDEN_CONTENT_CATALOG);
  }

  protected audit(): AuditOutput<HiddenContentData[]> {
    return auditHiddenContent();
  }

  protected render(data: HiddenContentData[], issues: Issue[]): void {
    renderHiddenContent(data, issues);
  }
}
