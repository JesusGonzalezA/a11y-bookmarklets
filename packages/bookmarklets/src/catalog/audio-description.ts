import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const AUDIO_DESCRIPTION_CATALOG: BookmarkletCatalogEntry = {
  id: "audio-description",
  name: "Audio Description",
  description:
    'Audit videos for audio description: <track kind="descriptions">, alternative links to described versions, and heuristic detection of videos that need audio description.',
  wcag: ["1.2.3", "1.2.5"],
  details:
    'Checks all <video> elements for <track kind="descriptions"> or nearby links to audio-described versions. Uses heuristics (non-muted, duration > 5s) to flag videos that likely need audio description. Detects common link patterns in English and Spanish ("audio described version", "audiodescripción").',
  checks: [
    '<track kind="descriptions"> presence on videos',
    "Nearby links to audio-described versions (text/aria-label pattern matching)",
    "Heuristic: non-muted videos > 5s without description track",
    "Muted/short videos flagged as likely decorative",
  ],
  dataReturned:
    "Array of `{ selector, src, hasDescriptionTrack, hasAlternativeLink, alternativeLinkText, duration, isMuted }` for every video.",
};
