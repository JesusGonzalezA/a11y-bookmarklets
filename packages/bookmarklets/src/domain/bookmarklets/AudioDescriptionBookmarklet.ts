/**
 * Audio Description bookmarklet — audits videos for audio description tracks or alternatives.
 *
 * WCAG: 1.2.3 Audio Description or Media Alternative, 1.2.5 Audio Description (Prerecorded)
 */

import { AUDIO_DESCRIPTION_CATALOG } from "../../catalog/audio-description.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditAudioDescription } from "./audio-description/AudioDescriptionAuditor.js";
import { renderAudioDescription } from "./audio-description/AudioDescriptionRenderer.js";
import type { AudioDescriptionData } from "./audio-description/types.js";

export class AudioDescriptionBookmarklet extends Bookmarklet<AudioDescriptionData[]> {
  constructor() {
    super(AUDIO_DESCRIPTION_CATALOG);
  }

  protected audit(): AuditOutput<AudioDescriptionData[]> {
    return auditAudioDescription();
  }

  protected render(data: AudioDescriptionData[], issues: Issue[]): void {
    renderAudioDescription(data, issues);
  }
}
