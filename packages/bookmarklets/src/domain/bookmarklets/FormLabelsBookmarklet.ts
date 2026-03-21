/**
 * Form Labels bookmarklet — audits accessible names of form controls.
 *
 * WCAG: 1.3.1 Info and Relationships, 3.3.2 Labels or Instructions, 4.1.2 Name, Role, Value
 */

import { FORM_LABELS_CATALOG } from "../../catalog/form-labels.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditFormLabels } from "./form-labels/FormLabelsAuditor.js";
import { renderFormLabels } from "./form-labels/FormLabelsRenderer.js";
import type { FormLabelData } from "./form-labels/types.js";

export class FormLabelsBookmarklet extends Bookmarklet<FormLabelData[]> {
  constructor() {
    super(FORM_LABELS_CATALOG);
  }

  protected audit(): AuditOutput<FormLabelData[]> {
    return auditFormLabels();
  }

  protected render(data: FormLabelData[], issues: Issue[]): void {
    renderFormLabels(data, issues);
  }
}
