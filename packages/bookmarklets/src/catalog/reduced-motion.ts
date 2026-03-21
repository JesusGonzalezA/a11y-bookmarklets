import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const REDUCED_MOTION_CATALOG: BookmarkletCatalogEntry = {
  id: "reduced-motion",
  name: "Reduced Motion",
  description:
    "Audit prefers-reduced-motion support: CSS animations/transitions and media query fallbacks.",
  wcag: ["2.3.3", "2.3.1"],
  details:
    "Scans stylesheets for @media (prefers-reduced-motion: reduce) rules and detects all active CSS animations and transitions on the page via getComputedStyle. Also counts Web Animations API usage via document.getAnimations(). Reports animated elements that lack a reduced-motion fallback.",
  checks: [
    "Presence of @media (prefers-reduced-motion: reduce) rules",
    "CSS animation properties on page elements",
    "CSS transition properties on page elements",
    "Web Animations API usage (document.getAnimations)",
    "Animated elements without reduced-motion fallback",
  ],
  dataReturned:
    "Object with `{ hasMediaQuery, mediaRuleCount, animatedElements[], webAnimationsCount, inaccessibleSheets }` — each animated element includes selector, property type, and value.",
  tags: ["motion", "animation", "preference"],
};
