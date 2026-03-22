# Page Title

Audit page title: existence, descriptiveness, length, and coherence with h1.

## WCAG Criteria

- 2.4.2

## What It Checks

- Missing or empty page title
- Generic title detection (Home, Untitled, Page, etc.)
- Title length (too short or too long)
- Title vs h1 coherence

## Details

Verifies <title> exists, is not empty, and is not generic. Checks length (ideal 30-60 chars), compares with <h1> for coherence using Jaccard similarity. Detects generic titles like 'Home', 'Untitled', 'Page'.

## Data Returned

Object with `{ title, isEmpty, isGeneric, length, h1Text, h1TitleMatch }`.

## Tags

meta, navigation, semantic

## How to Execute

1. Inject the bookmarklet — pass the entire content of `page-title.min.js` to `evaluate_script` (do NOT analyze the script code):
```
mcp_chrome-devtoo_evaluate_script({ expression: "<content of page-title.min.js>" })
```
2. Retrieve and analyze the result:
   ```
   mcp_chrome-devtoo_evaluate_script({
     expression: "JSON.stringify(window.__a11y.page-title.lastResult)"
   })
   ```

## Result Shape

```json
{
  "bookmarklet": "page-title",
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
