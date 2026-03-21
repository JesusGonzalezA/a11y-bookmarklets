/**
 * Live Regions bookmarklet — audits ARIA live regions and status messages.
 *
 * WCAG: 4.1.3 Status Messages
 */

import { LIVE_REGIONS_CATALOG } from "../../catalog/live-regions.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditLiveRegions } from "./live-regions/LiveRegionsAuditor.js";
import { renderLiveRegions } from "./live-regions/LiveRegionsRenderer.js";
import type { LiveRegionData } from "./live-regions/types.js";

export class LiveRegionsBookmarklet extends Bookmarklet<LiveRegionData[]> {
  constructor() {
    super(LIVE_REGIONS_CATALOG);
  }

  protected audit(): AuditOutput<LiveRegionData[]> {
    return auditLiveRegions();
  }

  protected render(data: LiveRegionData[], issues: Issue[]): void {
    renderLiveRegions(data, issues);
  }
}
