/**
 * Video Controls bookmarklet — audits video/audio elements for accessible controls.
 *
 * WCAG: 1.2.1 Audio-only and Video-only, 2.1.1 Keyboard, 4.1.2 Name Role Value
 */

import { VIDEO_CONTROLS_CATALOG } from "../../catalog/video-controls.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import type { VideoControlData } from "./video-controls/types.js";
import { auditVideoControls } from "./video-controls/VideoControlsAuditor.js";
import { renderVideoControls } from "./video-controls/VideoControlsRenderer.js";

export class VideoControlsBookmarklet extends Bookmarklet<VideoControlData[]> {
  constructor() {
    super(VIDEO_CONTROLS_CATALOG);
  }

  protected audit(): AuditOutput<VideoControlData[]> {
    return auditVideoControls();
  }

  protected render(data: VideoControlData[], issues: Issue[]): void {
    renderVideoControls(data, issues);
  }
}
