import { PRINT_STYLES_CATALOG } from "../../catalog/print-styles.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditPrintStyles } from "./print-styles/PrintStylesAuditor.js";
import { renderPrintStyles } from "./print-styles/PrintStylesRenderer.js";
import type { PrintStylesData } from "./print-styles/types.js";

export class PrintStylesBookmarklet extends Bookmarklet<PrintStylesData> {
  constructor() {
    super(PRINT_STYLES_CATALOG);
  }

  protected audit(): AuditOutput<PrintStylesData> {
    return auditPrintStyles();
  }

  protected render(data: PrintStylesData, issues: Issue[]): void {
    renderPrintStyles(data, issues);
  }
}
