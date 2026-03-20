import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const IMAGES_CATALOG: BookmarkletCatalogEntry = {
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
};
