/**
 * Axe Core bookmarklet — runs a comprehensive axe-core scan via CDN injection.
 *
 * WCAG: Broad coverage (4.1.2, 1.1.1, 1.3.1, 2.4.4, 3.1.1, 1.4.3, …)
 */

import { AXE_CORE_CATALOG } from "../../catalog/axe-core.js";
import { AsyncBookmarklet } from "../AsyncBookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditAxeCore } from "./axe-core/AxeCoreAuditor.js";
import { renderAxeCore } from "./axe-core/AxeCoreRenderer.js";
import type { AxeCoreData } from "./axe-core/types.js";

export class AxeCoreBookmarklet extends AsyncBookmarklet<AxeCoreData> {
  constructor() {
    super(AXE_CORE_CATALOG);
  }

  protected async audit(): Promise<AuditOutput<AxeCoreData>> {
    return auditAxeCore();
  }

  protected render(data: AxeCoreData, issues: Issue[]): void {
    renderAxeCore(data, issues);
  }
}
