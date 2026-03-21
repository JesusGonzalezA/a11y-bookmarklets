# Video Controls

Audit video and audio elements for accessible controls: native controls attribute, custom player ARIA roles, and keyboard operability.

## WCAG Criteria

- 1.2.1
- 2.1.1
- 4.1.2

## What It Checks

- Native controls attribute on <video> and <audio>
- Custom player controls with proper ARIA roles (button, slider, progressbar)
- Accessible names on custom controls (aria-label, text content)
- Media elements with no controls (neither native nor custom)

## Details

Finds all <video> and <audio> elements and checks whether they have the native controls attribute or accessible custom controls. For custom players, inspects ARIA roles (button, slider), accessible names (aria-label), and keyboard support (tabindex). Detects media elements with no controls at all.

## Data Returned

Array of `{ selector, tagName, hasNativeControls, hasCustomControls, src, duration, customControlDetails }` for every media element.

## Tags

media, video, keyboard, controls

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/video-controls.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of video-controls.min.js>" })
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
  "bookmarklet": "video-controls",
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
