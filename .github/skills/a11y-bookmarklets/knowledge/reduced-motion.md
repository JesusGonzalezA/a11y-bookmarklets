# Reduced Motion

Audit prefers-reduced-motion support: CSS animations/transitions and media query fallbacks.

## WCAG Criteria

- 2.3.3
- 2.3.1

## What It Checks

- Presence of @media (prefers-reduced-motion: reduce) rules
- CSS animation properties on page elements
- CSS transition properties on page elements
- Web Animations API usage (document.getAnimations)
- Animated elements without reduced-motion fallback

## Details

Scans stylesheets for @media (prefers-reduced-motion: reduce) rules and detects all active CSS animations and transitions on the page via getComputedStyle. Also counts Web Animations API usage via document.getAnimations(). Reports animated elements that lack a reduced-motion fallback.

## Data Returned

Object with `{ hasMediaQuery, mediaRuleCount, animatedElements[], webAnimationsCount, inaccessibleSheets }` — each animated element includes selector, property type, and value.

## Tags

motion, animation, preference

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/reduced-motion.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of reduced-motion.min.js>" })
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
  "bookmarklet": "reduced-motion",
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
