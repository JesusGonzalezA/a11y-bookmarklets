import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const VIDEO_CONTROLS_CATALOG: BookmarkletCatalogEntry = {
  id: "video-controls",
  name: "Video Controls",
  description:
    "Audit video and audio elements for accessible controls: native controls attribute, custom player ARIA roles, and keyboard operability.",
  wcag: ["1.2.1", "2.1.1", "4.1.2"],
  details:
    "Finds all <video> and <audio> elements and checks whether they have the native controls attribute or accessible custom controls. For custom players, inspects ARIA roles (button, slider), accessible names (aria-label), and keyboard support (tabindex). Detects media elements with no controls at all.",
  checks: [
    "Native controls attribute on <video> and <audio>",
    "Custom player controls with proper ARIA roles (button, slider, progressbar)",
    "Accessible names on custom controls (aria-label, text content)",
    "Media elements with no controls (neither native nor custom)",
  ],
  dataReturned:
    "Array of `{ selector, tagName, hasNativeControls, hasCustomControls, src, duration, customControlDetails }` for every media element.",
  tags: ["media", "video", "keyboard", "controls"],
};
