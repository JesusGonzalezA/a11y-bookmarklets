# Cognitive Load

Estimate cognitive overload by detecting simultaneous animations, autoplay media, popups, and information density.

## WCAG Criteria

- 2.2.2
- 2.3.1

## What It Checks

- Infinite CSS animations (+10 each)
- Autoplay media with audio (+15 each)
- Visible modals/popups (+10 each)
- Automatic carousels/sliders (+10 each)
- Competing CTAs above fold (+5 each over 3)
- High text density above fold (+10 if >800 words)
- Flash-rate concerns via rapid animations

## Details

Estimates the cognitive burden of a page by counting and scoring: infinite CSS animations, autoplay media, visible modals/popups, cookie banners, infinite-loop animations, automatic carousels, competing calls-to-action, and text density above the fold. Produces a composite cognitive load score (0–100, lower is better) with per-factor breakdowns.

## Data Returned

`{ score, breakdown: { animations, autoplayMedia, modals, carousels, ctaCount, wordCount, ... }, elements[] }` — cognitive load score with per-factor details.

## Tags

cognitive, ux, animations, media

## Result Shape

```json
{
  "bookmarklet": "cognitive-load",
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
