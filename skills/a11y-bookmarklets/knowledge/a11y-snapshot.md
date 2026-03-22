# A11y Snapshot

Generate a comprehensive JSON snapshot of the page's accessibility state for holistic AI analysis.

## WCAG Criteria

- 1.1.1
- 1.3.1
- 2.4.1
- 2.4.2
- 2.4.4
- 3.1.1
- 4.1.2

## What It Checks

- Heading hierarchy summary
- Landmark structure
- Image alt text inventory
- Form control label coverage
- Link and button accessible names
- Live region presence
- ARIA role usage
- Language declarations
- Meta tag configuration
- Media element inventory
- Page statistics (total elements, interactive, hidden)

## Details

Meta-bookmarklet that collects a complete accessibility snapshot including: heading tree, landmark map, images with alt text, form controls with labels, links and buttons with accessible names, live regions, ARIA roles, lang attributes, meta tags, media elements, and general statistics. Produces no visual overlay — purely data-oriented for AI consumption.

## Data Returned

`{ url, timestamp, lang, title, headings[], landmarks[], images[], forms[], links[], buttons[], liveRegions[], ariaRoles[], media[], metaTags[], stats{} }` — complete page accessibility snapshot.

## Tags

meta, snapshot, ai, data

## Result Shape

```json
{
  "bookmarklet": "a11y-snapshot",
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
