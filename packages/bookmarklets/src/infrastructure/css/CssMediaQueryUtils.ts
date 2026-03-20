/**
 * CSS media query parsing utilities shared across user-preference bookmarklets.
 *
 * Handles cross-origin stylesheet SecurityErrors gracefully.
 */

export interface MediaRuleMatch {
  conditionText: string;
  ruleCount: number;
  stylesheetHref: string | null;
}

/**
 * Scan all stylesheets for `@media` rules whose condition text contains the
 * given query substring (case-insensitive).
 */
export function findMediaRules(query: string): MediaRuleMatch[] {
  const matches: MediaRuleMatch[] = [];
  const lowerQuery = query.toLowerCase();

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      // Cross-origin stylesheet — skip silently
      continue;
    }

    scanRules(rules, sheet.href, lowerQuery, matches);
  }

  return matches;
}

function scanRules(
  rules: CSSRuleList,
  href: string | null,
  query: string,
  out: MediaRuleMatch[],
): void {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSMediaRule) {
      if (rule.conditionText.toLowerCase().includes(query)) {
        out.push({
          conditionText: rule.conditionText,
          ruleCount: rule.cssRules.length,
          stylesheetHref: href,
        });
      }
      // Also recurse into nested rules
      scanRules(rule.cssRules, href, query, out);
    } else if (rule instanceof CSSSupportsRule) {
      scanRules(rule.cssRules, href, query, out);
    }
  }
}

/** Returns true if any stylesheet contains a matching `@media` rule. */
export function hasMediaQuery(query: string): boolean {
  return findMediaRules(query).length > 0;
}

/** Count cross-origin stylesheets that could not be inspected. */
export function countInaccessibleStylesheets(): number {
  let count = 0;
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      sheet.cssRules;
    } catch {
      count++;
    }
  }
  return count;
}
