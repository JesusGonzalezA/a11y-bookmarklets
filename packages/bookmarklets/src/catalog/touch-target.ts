import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const TOUCH_TARGET_CATALOG: BookmarkletCatalogEntry = {
  id: "touch-target",
  name: "Touch Targets",
  description: "Check interactive element sizes against WCAG touch target minimums.",
  wcag: ["2.5.8", "2.5.5"],
  details:
    "Measures the bounding box of every interactive element (links, buttons, inputs, custom controls) and compares against WCAG 2.5.8 minimum (24×24 CSS px) and 2.5.5 enhanced (44×44 CSS px) thresholds. Small targets are flagged and highlighted.",
  checks: [
    "Touch target below 24×24 CSS px (WCAG 2.5.8 AA failure)",
    "Touch target below 44×44 CSS px (WCAG 2.5.5 AAA)",
    "Zero-dimension interactive elements (likely hidden)",
  ],
  dataReturned:
    "Array of `{ selector, tagName, width, height, label, passesAA, passesAAA }` per interactive element, plus issues with severity and suggestions.",
  tags: ["touch", "target-size", "mobile"],
};
