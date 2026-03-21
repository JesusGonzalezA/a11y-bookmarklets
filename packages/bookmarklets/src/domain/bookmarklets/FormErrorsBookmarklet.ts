/**
 * Form Errors bookmarklet — audits error handling in forms.
 *
 * WCAG: 3.3.1 Error Identification, 3.3.3 Error Suggestion
 */

import { FORM_ERRORS_CATALOG } from "../../catalog/form-errors.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditFormErrors } from "./form-errors/FormErrorsAuditor.js";
import { renderFormErrors } from "./form-errors/FormErrorsRenderer.js";
import type { FormErrorData } from "./form-errors/types.js";

export class FormErrorsBookmarklet extends Bookmarklet<FormErrorData[]> {
  constructor() {
    super(FORM_ERRORS_CATALOG);
  }

  protected audit(): AuditOutput<FormErrorData[]> {
    return auditFormErrors();
  }

  protected render(data: FormErrorData[], issues: Issue[]): void {
    renderFormErrors(data, issues);
  }
}
