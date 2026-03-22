# Axe Core

Run a comprehensive automated accessibility scan using axe-core. Detects WCAG 2.1 A/AA violations, incomplete checks, and best-practice issues.

## WCAG Criteria

- 4.1.2
- 1.1.1
- 1.3.1
- 2.4.4
- 3.1.1
- 1.4.3

## What It Checks

- All axe-core WCAG 2.1 Level A rules
- All axe-core WCAG 2.1 Level AA rules
- Incomplete checks requiring manual review
- Best-practice rules beyond WCAG

## Details

Dynamically loads axe-core from CDN and executes axe.run() against the full page. Maps axe-core violations to errors, incomplete checks to warnings, and passes to pass severity. Each issue includes the axe rule ID, WCAG criteria, impact level, affected nodes with CSS selectors, and a link to the Deque help page for remediation guidance.

## Data Returned

Object with `violations` array (each with ruleId, description, impact, helpUrl, wcag, nodes), plus `passCount`, `incompleteCount`, and `inapplicableCount`.

## Tags

automated, axe-core, comprehensive, async

## Result Shape

```json
{
  "bookmarklet": "axe-core",
  "url": "...",
  "timestamp": "ISO 8601",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Description",
      "selector": "CSS selector",
      "html": "Truncated outerHTML",
      "wcag": "criterion",
      "suggestion": "Fix",
      "data": {}
    }
  ],
  "summary": { "total": 0, "errors": 0, "warnings": 0, "passes": 0, "info": 0 }
}
```
