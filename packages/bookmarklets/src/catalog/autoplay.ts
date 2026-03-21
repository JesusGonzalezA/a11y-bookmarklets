import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const AUTOPLAY_CATALOG: BookmarkletCatalogEntry = {
  id: "autoplay",
  name: "Autoplay",
  description:
    "Detect media with autoplay: videos and audio that play automatically, muted state, and availability of pause/volume controls.",
  wcag: ["1.4.2"],
  details:
    "Finds all <video> and <audio> elements with autoplay. Checks if they are muted, if their duration exceeds 3 seconds, and if there is a visible pause/stop/mute control nearby. Reports violations where audio plays automatically for more than 3 seconds without a control mechanism.",
  checks: [
    "Autoplay attribute or property on <video> and <audio>",
    "Muted state (autoplay + muted is generally acceptable)",
    "Duration > 3 seconds with audio (WCAG 1.4.2 threshold)",
    "Nearby pause, stop, or mute controls",
    "Volume control availability",
  ],
  dataReturned:
    "Array of `{ selector, tagName, hasAutoplay, isMuted, duration, hasPauseControl, hasVolumeControl, src }` for every media element.",
};
