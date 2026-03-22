# Links

Audit links: empty links, generic text, faux links (href=#), new window warnings, anchor without href.

## WCAG Criteria

- 2.4.4
- 2.4.9

## What It Checks

- Links without accessible text
- Generic link text (click here, read more, etc.)
- Faux links (href="#" or javascript:void(0))
- Anchor without href (not keyboard focusable)
- Opens new window without warning

## Details

Scans all <a> and [role=link] elements. Computes accessible name via AccName algorithm. Detects empty links, generic text (click here, read more, etc.), faux links (href=# or javascript:), anchors without href, and target=_blank without new window indication.

## Data Returned

Array of `{ selector, text, href, isGeneric, isEmpty, opensNewWindow, hasNewWindowWarning, isFauxLink }`.

## Tags

navigation, links, interactive

## Result Shape

```json
{
  "bookmarklet": "links",
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
