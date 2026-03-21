# Dark Mode

Audit prefers-color-scheme support: dark/light media queries, color-scheme meta tag and CSS property.

## WCAG Criteria

- 1.4.3
- 1.4.6
- 1.4.11

## What It Checks

- Presence of @media (prefers-color-scheme: dark) rules
- Presence of @media (prefers-color-scheme: light) rules
- <meta name="color-scheme"> tag for browser UI adaptation
- CSS color-scheme property on :root for form controls and scrollbars
- Cross-origin stylesheets that cannot be inspected

## Details

Parses all stylesheets looking for @media (prefers-color-scheme: dark) and @media (prefers-color-scheme: light) rules. Checks for <meta name="color-scheme"> and the CSS color-scheme property on :root. Reports whether the page adapts to the user's dark mode preference.

## Data Returned

Object with `{ darkRules, lightRules, hasColorSchemeMeta, hasColorSchemeCSS, inaccessibleSheets }` plus issues with severity, WCAG references, and suggestions.

## Tags

color, contrast, preference, color scheme

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/dark-mode.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of dark-mode.min.js>" })
   ```

2. Take a screenshot to see the visual overlays:
   ```
   mcp_chrome-devtoo_take_screenshot()
   ```

3. Retrieve and analyze the JSON result:
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "JSON.stringify(window.__a11y)" })
   ```

## Result Shape

```json
{
  "bookmarklet": "dark-mode",
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
