# Bookmarklet: Captions

## What it checks

Whether `<video>` elements have `<track kind="captions">` or `<track kind="subtitles">` for prerecorded content. Validates track `src` and `srclang` attributes. Detects embedded videos from YouTube, Vimeo, etc. where captions cannot be verified programmatically.

**WCAG:** 1.2.2 (Captions — Prerecorded), 1.2.4 (Captions — Live)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/captions/dist/captions.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.captions?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y.captions.audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "captions",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "video.tutorial",
      "html": "<video src='tutorial.mp4'>",
      "wcag": "1.2.2",
      "suggestion": "How to fix it",
      "data": { "src": "tutorial.mp4", "trackCount": 0 }
    }
  ],
  "summary": { "total": 5, "errors": 2, "warnings": 1, "passes": 1, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Video has no caption or subtitle tracks" | Add `<track kind="captions" src="captions.vtt" srclang="en" label="English">` |
| "Caption track has no srclang attribute" | Add `srclang="en"` (or appropriate language code) to the track element |
| "Embedded YouTube/Vimeo video — captions cannot be verified" | Manually check caption settings on the platform |
| "Track has no src attribute" | Add a valid `src` pointing to a WebVTT caption file |
