import type { BookmarkletCatalogEntry } from "../domain/types.js";

export { HEADINGS_CATALOG } from "./headings.js";
export { IMAGES_CATALOG } from "./images.js";
export { LANDMARKS_CATALOG } from "./landmarks.js";
export { TAB_ORDER_CATALOG } from "./tab-order.js";

import { HEADINGS_CATALOG } from "./headings.js";
import { IMAGES_CATALOG } from "./images.js";
import { LANDMARKS_CATALOG } from "./landmarks.js";
import { TAB_ORDER_CATALOG } from "./tab-order.js";

/** All bookmarklet catalog entries — single source of truth. */
export const BOOKMARKLET_CATALOG: BookmarkletCatalogEntry[] = [
  HEADINGS_CATALOG,
  IMAGES_CATALOG,
  LANDMARKS_CATALOG,
  TAB_ORDER_CATALOG,
];
