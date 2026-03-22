/**
 * Core types for a11y bookmarklets.
 *
 * Every bookmarklet returns an {@link AuditResult} — the contract between
 * visual overlays (human mode) and JSON output (agent mode).
 */

export type Severity = "error" | "warning" | "info" | "pass";

export interface Issue {
  severity: Severity;
  message: string;
  selector: string;
  html: string;
  wcag?: string;
  suggestion?: string;
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
  bookmarklet: string;
  url: string;
  timestamp: string;
  issues: Issue[];
  summary: AuditSummary;
}

/** Output returned by each bookmarklet's audit() method. */
export interface AuditOutput<T> {
  issues: Issue[];
  data: T;
}

export interface BookmarkletMeta {
  id: string;
  name: string;
  description: string;
  wcag: string[];
}

/** Extended metadata for discovery by website and skill. */
export interface BookmarkletCatalogEntry extends BookmarkletMeta {
  details: string;
  checks: string[];
  dataReturned: string;
  tags: string[];
}
