import type { BookmarkletCatalogEntry } from "../domain/types.js";

export { DARK_MODE_CATALOG } from "./dark-mode.js";
export { FORCED_COLORS_CATALOG } from "./forced-colors.js";
export { HEADINGS_CATALOG } from "./headings.js";
export { IMAGES_CATALOG } from "./images.js";
export { INVERTED_COLORS_CATALOG } from "./inverted-colors.js";
export { LANDMARKS_CATALOG } from "./landmarks.js";
export { REDUCED_MOTION_CATALOG } from "./reduced-motion.js";
export { REDUCED_TRANSPARENCY_CATALOG } from "./reduced-transparency.js";
export { TAB_ORDER_CATALOG } from "./tab-order.js";

import { DARK_MODE_CATALOG } from "./dark-mode.js";
import { FORCED_COLORS_CATALOG } from "./forced-colors.js";
import { HEADINGS_CATALOG } from "./headings.js";
import { IMAGES_CATALOG } from "./images.js";
import { INVERTED_COLORS_CATALOG } from "./inverted-colors.js";
import { LANDMARKS_CATALOG } from "./landmarks.js";
import { REDUCED_MOTION_CATALOG } from "./reduced-motion.js";
import { REDUCED_TRANSPARENCY_CATALOG } from "./reduced-transparency.js";
import { TAB_ORDER_CATALOG } from "./tab-order.js";

/** All bookmarklet catalog entries — single source of truth. */
export const BOOKMARKLET_CATALOG: BookmarkletCatalogEntry[] = [
  HEADINGS_CATALOG,
  IMAGES_CATALOG,
  LANDMARKS_CATALOG,
  TAB_ORDER_CATALOG,
  DARK_MODE_CATALOG,
  REDUCED_MOTION_CATALOG,
  INVERTED_COLORS_CATALOG,
  REDUCED_TRANSPARENCY_CATALOG,
  FORCED_COLORS_CATALOG,
];
