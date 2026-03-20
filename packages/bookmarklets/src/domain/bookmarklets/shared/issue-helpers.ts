/**
 * Shared issue factory functions — eliminate repetitive Issue object creation.
 */

import type { Issue, Severity } from "../../types.js";

/** Shorthand for creating an Issue with all common fields. */
export function createIssue(
  severity: Severity,
  message: string,
  opts: {
    selector?: string;
    html?: string;
    wcag?: string;
    suggestion?: string;
    data?: Record<string, unknown>;
  } = {},
): Issue {
  return {
    severity,
    message,
    selector: opts.selector ?? "html",
    html: opts.html ?? "",
    wcag: opts.wcag,
    suggestion: opts.suggestion,
    data: opts.data,
  };
}

/** Cross-origin stylesheet warning — shared across all media query bookmarklets. */
export function inaccessibleSheetsIssue(count: number): Issue | null {
  if (count <= 0) return null;
  return createIssue("info", `${count} cross-origin stylesheet(s) could not be inspected.`, {
    data: { inaccessibleSheets: count },
  });
}

/** "Media query found" pass issue — parameterized for any query type. */
export function mediaQueryFoundIssue(queryName: string, ruleCount: number, wcag: string): Issue {
  return createIssue("pass", `Found ${ruleCount} @media (${queryName}) rule(s).`, {
    wcag,
    data: { mediaRuleCount: ruleCount },
  });
}

/** "Media query missing" warning — parameterized for any query type. */
export function mediaQueryMissingIssue(
  queryName: string,
  wcag: string,
  suggestion: string,
  extraContext?: string,
): Issue {
  return createIssue(
    "warning",
    `No @media (${queryName}) rules found.${extraContext ? ` ${extraContext}` : ""}`,
    { wcag, suggestion },
  );
}

/** "No elements found" info/warning issue. */
export function noElementsIssue(
  severity: Severity,
  elementType: string,
  wcag: string,
  suggestion?: string,
): Issue {
  return createIssue(severity, `No ${elementType} found on the page.`, {
    wcag,
    suggestion,
  });
}

/** Truncation notice when there are too many elements to report. */
export function truncationIssue(total: number, shown: number, elementType: string): Issue | null {
  if (total <= shown) return null;
  return createIssue(
    "info",
    `… and ${total - shown} more ${elementType}(s) (showing first ${shown}).`,
  );
}
