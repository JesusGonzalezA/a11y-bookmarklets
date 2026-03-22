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
