import type { BookmarkletCatalogEntry } from "../domain/types.js";

export { ARIA_CATALOG } from "./aria.js";
export { AUDIO_DESCRIPTION_CATALOG } from "./audio-description.js";
export { AUTOCOMPLETE_CATALOG } from "./autocomplete.js";
export { AUTOPLAY_CATALOG } from "./autoplay.js";
export { BUTTONS_CATALOG } from "./buttons.js";
export { CAPTIONS_CATALOG } from "./captions.js";
export { COLOR_CONTRAST_CATALOG } from "./color-contrast.js";
export { DARK_MODE_CATALOG } from "./dark-mode.js";
export { FORCED_COLORS_CATALOG } from "./forced-colors.js";
export { FORM_ERRORS_CATALOG } from "./form-errors.js";
export { FORM_LABELS_CATALOG } from "./form-labels.js";
export { GROUPED_FIELDS_CATALOG } from "./grouped-fields.js";
export { HEADINGS_CATALOG } from "./headings.js";
export { HIDDEN_CONTENT_CATALOG } from "./hidden-content.js";
export { IMAGES_CATALOG } from "./images.js";
export { INVERTED_COLORS_CATALOG } from "./inverted-colors.js";
export { LANDMARKS_CATALOG } from "./landmarks.js";
export { LANGUAGE_CATALOG } from "./language.js";
export { LINKS_CATALOG } from "./links.js";
export { LIVE_REGIONS_CATALOG } from "./live-regions.js";
export { META_TAGS_CATALOG } from "./meta-tags.js";
export { NEW_WINDOW_LINKS_CATALOG } from "./new-window-links.js";
export { PAGE_TITLE_CATALOG } from "./page-title.js";
export { REDUCED_MOTION_CATALOG } from "./reduced-motion.js";
export { REDUCED_TRANSPARENCY_CATALOG } from "./reduced-transparency.js";
export { SKIP_LINKS_CATALOG } from "./skip-links.js";
export { TAB_ORDER_CATALOG } from "./tab-order.js";
export { TEXT_SPACING_CATALOG } from "./text-spacing.js";
export { TOUCH_TARGET_CATALOG } from "./touch-target.js";
export { VIDEO_CONTROLS_CATALOG } from "./video-controls.js";
export { VIEWPORT_ZOOM_CATALOG } from "./viewport-zoom.js";

import { ARIA_CATALOG } from "./aria.js";
import { AUDIO_DESCRIPTION_CATALOG } from "./audio-description.js";
import { AUTOCOMPLETE_CATALOG } from "./autocomplete.js";
import { AUTOPLAY_CATALOG } from "./autoplay.js";
import { BUTTONS_CATALOG } from "./buttons.js";
import { CAPTIONS_CATALOG } from "./captions.js";
import { COLOR_CONTRAST_CATALOG } from "./color-contrast.js";
import { DARK_MODE_CATALOG } from "./dark-mode.js";
import { FORCED_COLORS_CATALOG } from "./forced-colors.js";
import { FORM_ERRORS_CATALOG } from "./form-errors.js";
import { FORM_LABELS_CATALOG } from "./form-labels.js";
import { GROUPED_FIELDS_CATALOG } from "./grouped-fields.js";
import { HEADINGS_CATALOG } from "./headings.js";
import { HIDDEN_CONTENT_CATALOG } from "./hidden-content.js";
import { IMAGES_CATALOG } from "./images.js";
import { INVERTED_COLORS_CATALOG } from "./inverted-colors.js";
import { LANDMARKS_CATALOG } from "./landmarks.js";
import { LANGUAGE_CATALOG } from "./language.js";
import { LINKS_CATALOG } from "./links.js";
import { LIVE_REGIONS_CATALOG } from "./live-regions.js";
import { META_TAGS_CATALOG } from "./meta-tags.js";
import { NEW_WINDOW_LINKS_CATALOG } from "./new-window-links.js";
import { PAGE_TITLE_CATALOG } from "./page-title.js";
import { REDUCED_MOTION_CATALOG } from "./reduced-motion.js";
import { REDUCED_TRANSPARENCY_CATALOG } from "./reduced-transparency.js";
import { SKIP_LINKS_CATALOG } from "./skip-links.js";
import { TAB_ORDER_CATALOG } from "./tab-order.js";
import { TEXT_SPACING_CATALOG } from "./text-spacing.js";
import { TOUCH_TARGET_CATALOG } from "./touch-target.js";
import { VIDEO_CONTROLS_CATALOG } from "./video-controls.js";
import { VIEWPORT_ZOOM_CATALOG } from "./viewport-zoom.js";

/** All bookmarklet catalog entries — single source of truth. */
export const BOOKMARKLET_CATALOG: BookmarkletCatalogEntry[] = [
  // Category 1: Structure & Navigation
  HEADINGS_CATALOG,
  IMAGES_CATALOG,
  LANDMARKS_CATALOG,
  TAB_ORDER_CATALOG,
  // Category 2: Video & Media
  DARK_MODE_CATALOG,
  REDUCED_MOTION_CATALOG,
  INVERTED_COLORS_CATALOG,
  REDUCED_TRANSPARENCY_CATALOG,
  FORCED_COLORS_CATALOG,
  VIDEO_CONTROLS_CATALOG,
  AUTOPLAY_CATALOG,
  CAPTIONS_CATALOG,
  AUDIO_DESCRIPTION_CATALOG,
  VIEWPORT_ZOOM_CATALOG,
  // Category 3: Language & Meta
  LANGUAGE_CATALOG,
  PAGE_TITLE_CATALOG,
  META_TAGS_CATALOG,
  // Category 4: Forms
  FORM_LABELS_CATALOG,
  AUTOCOMPLETE_CATALOG,
  FORM_ERRORS_CATALOG,
  GROUPED_FIELDS_CATALOG,
  // Category 5: Links, Buttons & Navigation
  LINKS_CATALOG,
  BUTTONS_CATALOG,
  SKIP_LINKS_CATALOG,
  NEW_WINDOW_LINKS_CATALOG,
  // Category 6: Content & Semantics
  ARIA_CATALOG,
  HIDDEN_CONTENT_CATALOG,
  LIVE_REGIONS_CATALOG,
  COLOR_CONTRAST_CATALOG,
  TEXT_SPACING_CATALOG,
  TOUCH_TARGET_CATALOG,
];
