# Captions

Audit video elements for caption and subtitle tracks: presence, validity (src, srclang), and embedded video detection.

## WCAG Criteria

- 1.2.2
- 1.2.4

## What It Checks

- Presence of <track kind="captions"> or <track kind="subtitles"> on videos
- Valid src attribute on caption tracks
- srclang attribute for language identification
- Embedded video detection (YouTube, Vimeo, Dailymotion, Wistia)
- Non-caption tracks (descriptions, chapters, metadata)

## Details

Finds all <video> elements and checks for <track kind="captions"> or <track kind="subtitles">. Validates that each track has a valid src and srclang attribute. Detects embedded videos (YouTube, Vimeo) where captions cannot be verified programmatically and flags them for manual review.

## Data Returned

Array of `{ selector, src, tracks: [{ kind, src, srclang, label, isValid }], isEmbedded, embedType }` for every video element.

## Tags

media, video, audio, captions

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/captions.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of captions.min.js>" })
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
  "bookmarklet": "captions",
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
