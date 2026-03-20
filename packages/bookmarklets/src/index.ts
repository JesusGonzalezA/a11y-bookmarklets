// Domain
export { Bookmarklet } from "./domain/Bookmarklet.js";
export type {
  AuditResult,
  AuditSummary,
  AuditOutput,
  BookmarkletCatalogEntry,
  BookmarkletMeta,
  BookmarkletMode,
  BookmarkletOptions,
  Issue,
  Severity,
} from "./domain/types.js";

// Catalog
export {
  BOOKMARKLET_CATALOG,
  HEADINGS_CATALOG,
  IMAGES_CATALOG,
  LANDMARKS_CATALOG,
  TAB_ORDER_CATALOG,
} from "./catalog/index.js";

// Bookmarklets
export { HeadingsBookmarklet } from "./domain/bookmarklets/HeadingsBookmarklet.js";
export { ImagesBookmarklet } from "./domain/bookmarklets/ImagesBookmarklet.js";
export { LandmarksBookmarklet } from "./domain/bookmarklets/LandmarksBookmarklet.js";
export { TabOrderBookmarklet } from "./domain/bookmarklets/TabOrderBookmarklet.js";

// Infrastructure
export { uniqueSelector, truncatedHtml, queryAll } from "./infrastructure/dom/DomUtils.js";
export {
  clearOverlays,
  addLabel,
  addOutline,
  showPanel,
} from "./infrastructure/overlay/OverlayManager.js";
export {
  buildResult,
  buildSummary,
  writeToConsole,
  registerInWindow,
} from "./infrastructure/reporter/AuditReporter.js";
