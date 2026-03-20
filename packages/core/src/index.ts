export type {
  AuditResult,
  AuditSummary,
  BookmarkletFn,
  BookmarkletMeta,
  BookmarkletMode,
  BookmarkletOptions,
  Issue,
  Severity,
} from "./types.js";

export { uniqueSelector, truncatedHtml, queryAll } from "./dom-utils.js";
export { clearOverlays, addLabel, addOutline, showPanel, injectBaseStyles } from "./overlay.js";
export { buildResult, buildSummary } from "./reporter.js";
