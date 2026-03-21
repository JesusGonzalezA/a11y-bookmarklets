import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const GROUPED_FIELDS_CATALOG: BookmarkletCatalogEntry = {
  id: "grouped-fields",
  name: "Grouped Fields",
  description:
    "Audit grouped form controls: radio groups in fieldset/radiogroup, checkbox groups, fieldsets with legends.",
  wcag: ["1.3.1", "4.1.2"],
  details:
    "Finds radio buttons grouped by name and verifies they are inside <fieldset> with <legend> or role=radiogroup with accessible name. Checks checkbox groups similarly. Reports fieldsets without legends.",
  tags: ["forms", "grouping", "semantic"],
  checks: [
    "Radio groups not inside fieldset or role=radiogroup",
    "Fieldset without legend",
    "Checkbox groups without grouping",
    "Groups without accessible name",
  ],
  dataReturned: "Array of `{ selector, groupType, legend, controls, name }`.",
};
