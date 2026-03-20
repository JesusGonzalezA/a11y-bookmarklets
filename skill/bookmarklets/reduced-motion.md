# Bookmarklet: Reduced Motion

## What it checks

Whether the page respects `prefers-reduced-motion` by providing CSS media query fallbacks for animations and transitions. Detects all active CSS animations, transitions, and Web Animations API usage, then checks if `@media (prefers-reduced-motion: reduce)` rules exist to disable or simplify them.

**WCAG:** 2.3.3 (Animation from Interactions), 2.3.1 (Three Flashes or Below Threshold)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/reduced-motion/dist/reduced-motion.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.['reduced-motion']?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y['reduced-motion'].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "reduced-motion",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": ".animated-hero",
      "html": "<div class='animated-hero'>...</div>",
      "wcag": "2.3.3",
      "suggestion": "How to fix it",
      "data": { "property": "animation", "value": "fadeIn 1s ease" }
    }
  ],
  "summary": { "total": 8, "errors": 0, "warnings": 5, "passes": 1, "info": 2 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Animated elements found but no prefers-reduced-motion fallback" | Add `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }` |
| "Element has animation: …" | Ensure this animation is disabled or simplified in a `prefers-reduced-motion` query |
| "Web Animations detected via getAnimations()" | Use `matchMedia('(prefers-reduced-motion: reduce)')` in JavaScript to skip or simplify animations |
| "No CSS animations or transitions found" | Page has no motion — no action needed |
