import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const READING_ORDER_CATALOG: BookmarkletCatalogEntry = {
  id: "reading-order",
  name: "Reading Order",
  description:
    "Compare DOM reading order vs visual layout order and detect discrepancies caused by CSS reordering.",
  wcag: ["1.3.2", "2.4.3"],
  details:
    "Compares the DOM source order (used by assistive technologies) with the visual layout order (perceived by sighted users). Uses getBoundingClientRect() to determine visual position and compares with document order. Detects discrepancies caused by CSS order property (flexbox/grid), position: absolute/fixed, CSS grid areas, float, and positive tabindex values. Highlights elements where DOM order differs significantly from visual order. Calculates a Kendall tau correlation coefficient as an overall measure of order consistency.",
  checks: [
    "DOM order vs visual order correlation (Kendall tau)",
    "CSS order property overriding natural DOM order",
    "Absolutely/fixed positioned elements displaced from DOM position",
    "Positive tabindex values altering focus order",
    "Flexbox/grid containers with reordered children",
  ],
  dataReturned:
    "Array of `{ selector, domIndex, visualIndex, tag, text, cssOrder, position, displaced }` for content elements where DOM and visual order differ, plus a `kendallTau` correlation score.",
  tags: ["structure", "navigation", "reading-order"],
};
