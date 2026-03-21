import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const TAB_ORDER_CATALOG: BookmarkletCatalogEntry = {
  id: "tab-order",
  name: "Tab Order",
  description:
    "Visualize and audit keyboard tab order: positive tabindex, hidden focusable elements.",
  wcag: ["2.4.3", "2.1.1"],
  details:
    "Numbers every focusable element in DOM order so you can verify the keyboard navigation flow. Covers links, buttons, inputs, selects, textareas, elements with tabindex, contenteditable, and media controls.",
  checks: [
    "Positive tabindex values (alters natural tab order)",
    "Hidden elements that are still focusable",
    "Elements missing accessible names",
  ],
  dataReturned:
    "Array of `{ index, tabindex, selector, element, tag, role, label }` for every focusable element.",
  tags: ["keyboard", "focus", "navigation"],
};
