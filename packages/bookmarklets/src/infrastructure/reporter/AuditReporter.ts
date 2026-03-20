/**
 * Reporter — builds AuditResult objects and manages output to console and window.
 */

import type { AuditResult, AuditSummary, Issue, Severity } from "../../domain/types.js";

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

export function writeToConsole(result: AuditResult): void {
  const { summary } = result;
  console.group(`[a11y] ${result.bookmarklet} audit`);
  console.log(`URL: ${result.url}`);
  console.log(
    `Summary: ${summary.errors} errors, ${summary.warnings} warnings, ${summary.passes} passes, ${summary.info} info`,
  );
  if (summary.errors > 0 || summary.warnings > 0) {
    console.table(
      result.issues
        .filter((i) => i.severity === "error" || i.severity === "warning")
        .map(({ severity, message, selector, wcag }) => ({ severity, message, selector, wcag })),
    );
  }
  console.groupEnd();
}

export function registerInWindow(
  id: string,
  result: AuditResult,
  rerunFn: () => AuditResult,
): void {
  (window as any).__a11y = (window as any).__a11y ?? {};
  (window as any).__a11y[id] = { audit: rerunFn, lastResult: result };
}
