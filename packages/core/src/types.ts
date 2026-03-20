/**
 * Core types for a11y bookmarklets.
 *
 * Every bookmarklet returns an {@link AuditResult} — this is the contract
 * between the visual overlays (human mode) and the JSON output (agent mode).
 */

// ---------------------------------------------------------------------------
// Audit result
// ---------------------------------------------------------------------------

export type Severity = "error" | "warning" | "info" | "pass";

export interface Issue {
  /** Severity of the finding */
  severity: Severity;
  /** Human-readable message describing the finding */
  message: string;
  /** CSS selector that uniquely identifies the element */
  selector: string;
  /** Truncated outerHTML of the element (max 200 chars) */
  html: string;
  /** Relevant WCAG success criterion (e.g. "1.3.1") */
  wcag?: string;
  /** Actionable suggestion to fix the issue */
  suggestion?: string;
  /** Arbitrary extra data specific to each bookmarklet */
  data?: Record<string, unknown>;
}

export interface AuditSummary {
  total: number;
  errors: number;
  warnings: number;
  passes: number;
  info: number;
}

export interface AuditResult {
  /** Identifier of the bookmarklet (e.g. "headings", "landmarks") */
  bookmarklet: string;
  /** URL of the audited page */
  url: string;
  /** ISO timestamp */
  timestamp: string;
  /** List of findings */
  issues: Issue[];
  /** Aggregated counts */
  summary: AuditSummary;
}

// ---------------------------------------------------------------------------
// Bookmarklet definition
// ---------------------------------------------------------------------------

export type BookmarkletMode = "visual" | "data" | "both";

export interface BookmarkletOptions {
  /** Which output to produce. Default: "both" */
  mode?: BookmarkletMode;
}

/**
 * Every bookmarklet module must export a function matching this signature.
 * It receives options and returns an AuditResult.
 * The visual overlays are injected as a side-effect when mode includes "visual".
 */
export type BookmarkletFn = (options?: BookmarkletOptions) => AuditResult;

// ---------------------------------------------------------------------------
// Registry — allows discovering bookmarklets at runtime
// ---------------------------------------------------------------------------

export interface BookmarkletMeta {
  id: string;
  name: string;
  description: string;
  wcag: string[];
}
