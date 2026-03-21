---
name: a11y-bookmarklets
description: Use this skill when auditing web accessibility, running a11y checks, analyzing WCAG compliance, or when the user asks to check headings, landmarks, tab order, images, alt text, video captions, autoplay, audio description, viewport zoom, or semantic structure of a web page. Also use when the user says "audit accessibility", "check a11y", "WCAG audit", or "run bookmarklet".
---

# A11y Bookmarklets — Accessibility Audit Skill

You are an expert accessibility auditor. You use specialized bookmarklets that inject visual overlays AND return structured JSON data to perform thorough WCAG audits.

## Available Bookmarklets

### Structure & Content

| ID | What it checks | WCAG | Reference |
|----|---------------|------|----------|
| `headings` | Heading hierarchy (h1-h6), skipped levels, empty headings, multiple h1s | 1.3.1, 2.4.6 | [bookmarklets/headings.md](bookmarklets/headings.md) |
| `landmarks` | Semantic landmarks (main, nav, banner, contentinfo, complementary, search) | 1.3.1, 2.4.1 | [bookmarklets/landmarks.md](bookmarklets/landmarks.md) |
| `tab-order` | Keyboard tab sequence, positive tabindex, hidden focusables | 2.4.3, 2.1.1 | [bookmarklets/tab-order.md](bookmarklets/tab-order.md) |
| `images` | Alt text, decorative images, suspicious alt patterns | 1.1.1 | [bookmarklets/images.md](bookmarklets/images.md) |

### User Preferences (CSS Media Queries)

Bookmarklets that verify whether the page respects OS-level user preferences. These audit CSS media queries that most accessibility tools overlook.

| ID | What it checks | WCAG | Reference |
|----|---------------|------|----------|
| `dark-mode` | `prefers-color-scheme` support, color-scheme meta/CSS | 1.4.3, 1.4.6, 1.4.11 | [bookmarklets/dark-mode.md](bookmarklets/dark-mode.md) |
| `reduced-motion` | `prefers-reduced-motion` fallbacks, CSS animations/transitions | 2.3.3, 2.3.1 | [bookmarklets/reduced-motion.md](bookmarklets/reduced-motion.md) |
| `inverted-colors` | `inverted-colors` support, media elements needing compensation | 1.4.1, 1.4.3 | [bookmarklets/inverted-colors.md](bookmarklets/inverted-colors.md) |
| `reduced-transparency` | `prefers-reduced-transparency` support, semi-transparent elements | 1.4.11 | [bookmarklets/reduced-transparency.md](bookmarklets/reduced-transparency.md) |
| `forced-colors` | `forced-colors` and `prefers-contrast` support, High Contrast Mode | 1.4.11, 1.4.3 | [bookmarklets/forced-colors.md](bookmarklets/forced-colors.md) |

### Video & Media

| ID | What it checks | WCAG | Reference |
|----|---------------|------|----------|
| `video-controls` | Native and custom controls on video/audio elements, ARIA roles, keyboard | 1.2.1, 2.1.1, 4.1.2 | [bookmarklets/video-controls.md](bookmarklets/video-controls.md) |
| `autoplay` | Autoplay with audio, muted state, pause/volume controls | 1.4.2 | [bookmarklets/autoplay.md](bookmarklets/autoplay.md) |
| `captions` | Caption/subtitle tracks, src/srclang validation, embedded videos | 1.2.2, 1.2.4 | [bookmarklets/captions.md](bookmarklets/captions.md) |
| `audio-description` | Description tracks, alternative version links, heuristic detection | 1.2.3, 1.2.5 | [bookmarklets/audio-description.md](bookmarklets/audio-description.md) |

### Meta Tags & Page Configuration

| ID | What it checks | WCAG | Reference |
|----|---------------|------|----------|
| `viewport-zoom` | Viewport meta: user-scalable, maximum-scale, responsive reflow | 1.4.4, 1.4.10 | [bookmarklets/viewport-zoom.md](bookmarklets/viewport-zoom.md) |

## How to Audit a Page

### Prerequisites
You need access to the **Playwright MCP server** (`@playwright/mcp`) to control a browser.

### Step-by-step workflow

1. **Navigate** to the target URL using `browser_navigate`.
2. **Take a baseline screenshot** to see the initial page state.
3. **Inject and run a bookmarklet** via `browser_evaluate`. See each bookmarklet's reference file for the exact script.
4. **Take a screenshot** after injection — the page now shows visual overlays (colored labels, outlines, numbered tab stops, etc.).
5. **Analyze the JSON result** returned by `browser_evaluate`. All bookmarklets return the same shape:
   ```json
   {
     "bookmarklet": "<id>",
     "url": "https://example.com",
     "timestamp": "ISO 8601",
     "issues": [
       {
         "severity": "error|warning|info|pass",
         "message": "Human-readable description",
         "selector": "CSS selector",
         "html": "Truncated outerHTML",
         "wcag": "criterion number",
         "suggestion": "How to fix it",
         "data": {}
       }
     ],
     "summary": { "total": 0, "errors": 0, "warnings": 0, "passes": 0, "info": 0 }
   }
   ```
6. **Report findings** grouped by severity, with WCAG criterion, selector, and fix suggestion.
7. **Repeat** for each bookmarklet relevant to the audit scope.

## Recommended Audit Order

1. **Headings** — structural foundation
2. **Landmarks** — page regions
3. **Tab order** — keyboard navigation
4. **Images** — alt text
5. **Video controls** — media accessibility
6. **Autoplay** — audio control
7. **Captions** — subtitle tracks
8. **Audio description** — described video
9. **Viewport & Zoom** — zoom restrictions
10. **Dark mode** — color scheme adaptation
11. **Reduced motion** — animation fallbacks
12. **Inverted colors** — media compensation
13. **Reduced transparency** — opaque fallbacks
14. **Forced colors** — High Contrast Mode

## Severity Levels

| Level | Meaning |
|-------|---------|
| **error** | WCAG violation — must fix; screen reader or keyboard users are affected |
| **warning** | Likely issue or best-practice violation — should be fixed |
| **info** | Informational — describes what was found |
| **pass** | Element passed the check |

## Using the MCP Server (Alternative)

If the `a11y-bookmarklets` MCP server is configured, use its tools directly:

1. `list_bookmarklets` — See available audits
2. `get_audit_script` — Get the JS to inject for a specific bookmarklet
3. `interpret_results` — Get WCAG-based analysis of JSON results

MCP config:
```json
{
  "mcpServers": {
    "a11y-bookmarklets": {
      "command": "npx",
      "args": ["@bookmarklets-a11y/mcp-server"]
    }
  }
}
```

## Output Format for Audit Reports

```
## [Bookmarklet Name] Audit — [URL]

### ❌ Errors
1. **[Message]** — WCAG [criterion]
   Element: `[selector]`
   Fix: [suggestion]

### ⚠️ Warnings
1. **[Message]** — WCAG [criterion]
   Fix: [suggestion]

### ✅ Summary
- X errors, Y warnings, Z passes
- [Overall assessment]
```
