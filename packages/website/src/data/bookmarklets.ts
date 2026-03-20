export interface BookmarkletInfo {
  id: string;
  name: string;
  description: string;
  wcag: string[];
  details: string;
  checks: string[];
  dataReturned: string;
}

export const bookmarklets: BookmarkletInfo[] = [
  {
    id: "headings",
    name: "Headings",
    description:
      "Audit heading structure (h1–h6): hierarchy, skipped levels, empty headings, multiple h1s.",
    wcag: ["1.3.1", "2.4.6"],
    details:
      "Scans every heading element on the page and verifies the hierarchy is correct. Each heading gets a color-coded label overlay (h1=red, h2=orange, h3=yellow, h4=green, h5=blue, h6=purple) so you immediately spot structural issues.",
    checks: [
      "Empty headings (no text content)",
      "Skipped heading levels (e.g. h2 → h4)",
      "Multiple h1 elements (only one per page recommended)",
      "No h1 found on the page",
    ],
    dataReturned:
      "Array of `{ level, text, selector }` for every heading, plus issues with severity, WCAG references, and suggestions.",
  },
  {
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
  },
  {
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
  },
  {
    id: "images",
    name: "Images",
    description:
      "Audit image alt text: missing alt, decorative images, suspicious alt text patterns.",
    wcag: ["1.1.1"],
    details:
      "Checks every image on the page for proper alternative text. Visual indicators show the status of each image: red for missing alt, gray for decorative, green for valid alt text. Alt text is shown directly on the overlay.",
    checks: [
      "Missing alt attribute entirely",
      'Decorative images (alt="" or aria-hidden="true")',
      'Suspicious alt text patterns (e.g. "image", "photo", "DSC_")',
      "Very long alt text (> 150 characters)",
    ],
    dataReturned:
      "Array of `{ selector, alt, isDecorative, hasFigcaption, src, role }` for every image.",
  },
];
