import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const COGNITIVE_LOAD_CATALOG: BookmarkletCatalogEntry = {
  id: "cognitive-load",
  name: "Cognitive Load",
  description:
    "Estimate cognitive overload by detecting simultaneous animations, autoplay media, popups, and information density.",
  wcag: ["2.2.2", "2.3.1"],
  details:
    "Estimates the cognitive burden of a page by counting and scoring: infinite CSS animations, autoplay media, visible modals/popups, cookie banners, infinite-loop animations, automatic carousels, competing calls-to-action, and text density above the fold. Produces a composite cognitive load score (0–100, lower is better) with per-factor breakdowns.",
  checks: [
    "Infinite CSS animations (+10 each)",
    "Autoplay media with audio (+15 each)",
    "Visible modals/popups (+10 each)",
    "Automatic carousels/sliders (+10 each)",
    "Competing CTAs above fold (+5 each over 3)",
    "High text density above fold (+10 if >800 words)",
    "Flash-rate concerns via rapid animations",
  ],
  dataReturned:
    "`{ score, breakdown: { animations, autoplayMedia, modals, carousels, ctaCount, wordCount, ... }, elements[] }` — cognitive load score with per-factor details.",
  tags: ["cognitive", "ux", "animations", "media"],
};
