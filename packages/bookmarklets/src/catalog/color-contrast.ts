import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const COLOR_CONTRAST_CATALOG: BookmarkletCatalogEntry = {
  id: "color-contrast",
  name: "Color Contrast",
  description: "Check text color contrast ratios against WCAG AA and AAA thresholds.",
  wcag: ["1.4.3", "1.4.6"],
  details:
    "Computes the contrast ratio between foreground text color and the resolved background color for text-bearing elements. Uses the WCAG 2.x relative luminance formula. Distinguishes between normal and large text for appropriate AA/AAA thresholds.",
  checks: [
    "Contrast ratio below AA minimum (4.5:1 normal, 3:1 large text)",
    "Contrast ratio below AAA enhanced (7:1 normal, 4.5:1 large text)",
    "Background color resolution through parent elements",
    "Large text detection (18pt+ or 14pt+ bold)",
  ],
  dataReturned:
    "Array of `{ selector, tagName, text, fontSize, fontWeight, foreground, background, ratio, passesAA, passesAAA, isLargeText }` per element, plus issues with severity and WCAG references.",
  tags: ["color", "contrast", "visual"],
};
