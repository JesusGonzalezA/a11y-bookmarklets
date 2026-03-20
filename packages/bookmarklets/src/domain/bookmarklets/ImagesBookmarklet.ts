/**
 * Images bookmarklet — audits images for alt text, decorative markers, and figcaption usage.
 *
 * WCAG: 1.1.1 Non-text Content
 */

import { IMAGES_CATALOG } from "../../catalog/images.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditImages } from "./images/ImagesAuditor.js";
import { renderImages } from "./images/ImagesRenderer.js";
import type { ImageData } from "./images/types.js";

export class ImagesBookmarklet extends Bookmarklet<ImageData[]> {
  constructor() {
    super(IMAGES_CATALOG);
  }

  protected audit(): AuditOutput<ImageData[]> {
    return auditImages();
  }

  protected render(data: ImageData[], issues: Issue[]): void {
    renderImages(data, issues);
  }
}
