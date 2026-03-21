import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const CAPTIONS_CATALOG: BookmarkletCatalogEntry = {
  id: "captions",
  name: "Captions",
  description:
    "Audit video elements for caption and subtitle tracks: presence, validity (src, srclang), and embedded video detection.",
  wcag: ["1.2.2", "1.2.4"],
  details:
    'Finds all <video> elements and checks for <track kind="captions"> or <track kind="subtitles">. Validates that each track has a valid src and srclang attribute. Detects embedded videos (YouTube, Vimeo) where captions cannot be verified programmatically and flags them for manual review.',
  checks: [
    'Presence of <track kind="captions"> or <track kind="subtitles"> on videos',
    "Valid src attribute on caption tracks",
    "srclang attribute for language identification",
    "Embedded video detection (YouTube, Vimeo, Dailymotion, Wistia)",
    "Non-caption tracks (descriptions, chapters, metadata)",
  ],
  dataReturned:
    "Array of `{ selector, src, tracks: [{ kind, src, srclang, label, isValid }], isEmbedded, embedType }` for every video element.",
  tags: ["media", "video", "audio", "captions"],
};
