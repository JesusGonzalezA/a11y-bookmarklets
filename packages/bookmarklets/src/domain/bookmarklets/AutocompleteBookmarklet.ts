/**
 * Autocomplete bookmarklet — audits autocomplete attributes on form fields.
 *
 * WCAG: 1.3.5 Identify Input Purpose
 */

import { AUTOCOMPLETE_CATALOG } from "../../catalog/autocomplete.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditAutocomplete } from "./autocomplete/AutocompleteAuditor.js";
import { renderAutocomplete } from "./autocomplete/AutocompleteRenderer.js";
import type { AutocompleteData } from "./autocomplete/types.js";

export class AutocompleteBookmarklet extends Bookmarklet<AutocompleteData[]> {
  constructor() {
    super(AUTOCOMPLETE_CATALOG);
  }

  protected audit(): AuditOutput<AutocompleteData[]> {
    return auditAutocomplete();
  }

  protected render(data: AutocompleteData[], issues: Issue[]): void {
    renderAutocomplete(data, issues);
  }
}
