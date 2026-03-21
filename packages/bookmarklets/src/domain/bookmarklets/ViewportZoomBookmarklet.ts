/**
 * Viewport Zoom bookmarklet — audits viewport meta tag for zoom restrictions.
 *
 * WCAG: 1.4.4 Resize Text, 1.4.10 Reflow
 */

import { VIEWPORT_ZOOM_CATALOG } from "../../catalog/viewport-zoom.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import type { ViewportZoomData } from "./viewport-zoom/types.js";
import { auditViewportZoom } from "./viewport-zoom/ViewportZoomAuditor.js";
import { renderViewportZoom } from "./viewport-zoom/ViewportZoomRenderer.js";

export class ViewportZoomBookmarklet extends Bookmarklet<ViewportZoomData> {
  constructor() {
    super(VIEWPORT_ZOOM_CATALOG);
  }

  protected audit(): AuditOutput<ViewportZoomData> {
    return auditViewportZoom();
  }

  protected render(data: ViewportZoomData, issues: Issue[]): void {
    renderViewportZoom(data, issues);
  }
}
