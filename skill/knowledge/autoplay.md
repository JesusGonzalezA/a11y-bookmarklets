# Autoplay

Detect media with autoplay: videos and audio that play automatically, muted state, and availability of pause/volume controls.

## WCAG Criteria

- 1.4.2

## What It Checks

- Autoplay attribute or property on <video> and <audio>
- Muted state (autoplay + muted is generally acceptable)
- Duration > 3 seconds with audio (WCAG 1.4.2 threshold)
- Nearby pause, stop, or mute controls
- Volume control availability

## Details

Finds all <video> and <audio> elements with autoplay. Checks if they are muted, if their duration exceeds 3 seconds, and if there is a visible pause/stop/mute control nearby. Reports violations where audio plays automatically for more than 3 seconds without a control mechanism.

## Data Returned

Array of `{ selector, tagName, hasAutoplay, isMuted, duration, hasPauseControl, hasVolumeControl, src }` for every media element.

## Tags

media, video, audio, animation

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/autoplay.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of autoplay.min.js>" })
   ```


2. Retrieve and analyze the JSON result:
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "JSON.stringify(window.__a11y)" })
   ```

## Result Shape

```json
{
  "bookmarklet": "autoplay",
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
