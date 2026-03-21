# Bookmarklet: Autoplay

## What it checks

Whether `<video>` and `<audio>` elements autoplay with audio, and if so, whether there's a mechanism to pause, stop, or mute them. WCAG 1.4.2 requires a control mechanism for audio that plays automatically for more than 3 seconds.

**WCAG:** 1.4.2 (Audio Control)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/autoplay/dist/autoplay.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.autoplay?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y.autoplay.audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "autoplay",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "video.hero",
      "html": "<video autoplay src='intro.mp4'>",
      "wcag": "1.4.2",
      "suggestion": "How to fix it",
      "data": { "tagName": "video", "hasAutoplay": true, "isMuted": false }
    }
  ],
  "summary": { "total": 3, "errors": 1, "warnings": 0, "passes": 2, "info": 0 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "autoplays with audio and has no visible pause/stop/mute control" | Add `muted` attribute or provide a visible pause/stop/mute button |
| "autoplays with audio. Pause control detected nearby" | Verify the pause control is keyboard accessible and announced by screen readers |
| "autoplays but is muted" | Acceptable — no WCAG violation |
| "does not autoplay" | No action needed |
