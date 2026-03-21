/**
 * Grouped Fields bookmarklet — audits related form controls grouping.
 *
 * WCAG: 1.3.1 Info and Relationships, 4.1.2 Name, Role, Value
 */

import { GROUPED_FIELDS_CATALOG } from "../../catalog/grouped-fields.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditGroupedFields } from "./grouped-fields/GroupedFieldsAuditor.js";
import { renderGroupedFields } from "./grouped-fields/GroupedFieldsRenderer.js";
import type { GroupedFieldsData } from "./grouped-fields/types.js";

export class GroupedFieldsBookmarklet extends Bookmarklet<GroupedFieldsData[]> {
  constructor() {
    super(GROUPED_FIELDS_CATALOG);
  }

  protected audit(): AuditOutput<GroupedFieldsData[]> {
    return auditGroupedFields();
  }

  protected render(data: GroupedFieldsData[], issues: Issue[]): void {
    renderGroupedFields(data, issues);
  }
}
