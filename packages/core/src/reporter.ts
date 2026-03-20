/**
 * Reporter — builds AuditResult objects from raw findings.
 */

import type { AuditResult, AuditSummary, Issue, Severity } from "./types.js";

export function buildSummary(issues: Issue[]): AuditSummary {
  const summary: AuditSummary = { total: 0, errors: 0, warnings: 0, passes: 0, info: 0 };

  for (const issue of issues) {
    summary.total++;
    const key: Record<Severity, keyof AuditSummary> = {
      error: "errors",
      warning: "warnings",
      pass: "passes",
      info: "info",
    };
    summary[key[issue.severity]]++;
  }

  return summary;
}

export function buildResult(bookmarkletId: string, issues: Issue[]): AuditResult {
  return {
    bookmarklet: bookmarkletId,
    url: typeof location !== "undefined" ? location.href : "",
    timestamp: new Date().toISOString(),
    issues,
    summary: buildSummary(issues),
  };
}
