# Audio Description

Audit videos for audio description: <track kind="descriptions">, alternative links to described versions, and heuristic detection of videos that need audio description.

## WCAG Criteria

- 1.2.3
- 1.2.5

## What It Checks

- <track kind="descriptions"> presence on videos
- Nearby links to audio-described versions (text/aria-label pattern matching)
- Heuristic: non-muted videos > 5s without description track
- Muted/short videos flagged as likely decorative

## Details

Checks all <video> elements for <track kind="descriptions"> or nearby links to audio-described versions. Uses heuristics (non-muted, duration > 5s) to flag videos that likely need audio description. Detects common link patterns in English and Spanish ("audio described version", "audiodescripción").

## Data Returned

Array of `{ selector, src, hasDescriptionTrack, hasAlternativeLink, alternativeLinkText, duration, isMuted }` for every video.

## Tags

media, video, audio description

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/audio-description.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of audio-description.min.js>" })
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
  "bookmarklet": "audio-description",
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
