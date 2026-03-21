import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const LANDMARKS_CATALOG: BookmarkletCatalogEntry = {
  id: "landmarks",
  name: "Landmarks",
  description:
    "Audit semantic landmark regions: main, nav, banner, complementary, contentinfo, search.",
  wcag: ["1.3.1", "2.4.1"],
  details:
    "Identifies all ARIA landmark regions including native HTML5 elements (main, nav, header, footer, aside, form, section) and custom roles. Color-coded outlines make each region clearly visible.",
  checks: [
    "Missing main landmark",
    "Multiple main landmarks",
    "Duplicate unnamed landmarks of the same type",
    "Regions without accessible labels",
  ],
  dataReturned:
    "Array of `{ role, label, selector, element }` for every landmark found, plus issues flagging missing or duplicate landmarks.",
  tags: ["structure", "semantic", "navigation"],
};
