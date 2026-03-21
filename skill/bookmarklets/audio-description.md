# Bookmarklet: Audio Description

## What it checks

Whether `<video>` elements have `<track kind="descriptions">` for audio description, or nearby links to audio-described versions of the video. Uses heuristics (non-muted, duration > 5s) to flag videos that likely need audio description.

**WCAG:** 1.2.3 (Audio Description or Media Alternative), 1.2.5 (Audio Description — Prerecorded)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/audio-description/dist/audio-description.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.['audio-description']?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y['audio-description'].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "audio-description",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "video.product-demo",
      "html": "<video src='demo.mp4'>",
      "wcag": "1.2.5",
      "suggestion": "How to fix it",
      "data": { "src": "demo.mp4", "duration": 120, "isMuted": false }
    }
  ],
  "summary": { "total": 3, "errors": 0, "warnings": 2, "passes": 1, "info": 0 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Video has no audio description track or alternative link" | Add `<track kind="descriptions" src="desc.vtt" srclang="en">` or provide a link to an audio-described version |
| "Video has <track kind='descriptions'>" | Audio description track found — pass |
| "Video has a nearby link to an audio-described version" | Alternative link detected — pass |
| "Video without audio description (muted)" | Likely decorative — verify content doesn't need description |
