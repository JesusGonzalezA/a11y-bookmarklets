---
name: a11y-bookmarklets
description: Use this skill when auditing web accessibility, running a11y checks, analyzing WCAG compliance, or when the user asks to check headings, landmarks, tab order, images, alt text, video captions, autoplay, audio description, viewport zoom, language, page title, forms, links, buttons, ARIA, color contrast, touch targets, or semantic structure of a web page. Also use when the user says "audit accessibility", "check a11y", "WCAG audit", or "run bookmarklet".
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
| `language` | HTML lang attribute, BCP 47 validation, language of parts | 3.1.1, 3.1.2 | [bookmarklets/language.md](bookmarklets/language.md) |
| `page-title` | Document title presence, descriptiveness, length, similarity to h1 | 2.4.2 | [bookmarklets/page-title.md](bookmarklets/page-title.md) |
| `meta-tags` | Charset, description, color-scheme, theme-color, http-equiv refresh | 2.4.2, 3.2.5, 1.4.10 | [bookmarklets/meta-tags.md](bookmarklets/meta-tags.md) |

### Forms

| ID | What it checks | WCAG | Reference |
|----|---------------|------|----------|
| `form-labels` | Accessible names for form controls: label, aria-label, aria-labelledby, title, placeholder | 1.3.1, 3.3.2, 4.1.2 | [bookmarklets/form-labels.md](bookmarklets/form-labels.md) |
| `autocomplete` | Autocomplete attributes on identity/financial fields, WHATWG token validation | 1.3.5 | [bookmarklets/autocomplete.md](bookmarklets/autocomplete.md) |
| `form-errors` | Error handling: aria-invalid, aria-errormessage, aria-describedby, alert regions | 3.3.1, 3.3.3 | [bookmarklets/form-errors.md](bookmarklets/form-errors.md) |
| `grouped-fields` | Fieldset/legend usage, radio groups, checkbox groups | 1.3.1, 3.3.2 | [bookmarklets/grouped-fields.md](bookmarklets/grouped-fields.md) |

### Links, Buttons & Navigation

| ID | What it checks | WCAG | Reference |
|----|---------------|------|----------|
| `links` | Empty/generic links, faux links, accessible names, anchor validity | 2.4.4, 4.1.2 | [bookmarklets/links.md](bookmarklets/links.md) |
| `buttons` | Accessible names, faux buttons, label-in-name compliance | 4.1.2, 2.5.3 | [bookmarklets/buttons.md](bookmarklets/buttons.md) |
| `skip-links` | Skip navigation presence, target validity, first-focusable position | 2.4.1 | [bookmarklets/skip-links.md](bookmarklets/skip-links.md) |
| `new-window-links` | target=_blank detection, user warning, rel=noopener | 3.2.5 | [bookmarklets/new-window-links.md](bookmarklets/new-window-links.md) |

### Content & Semantics

| ID | What it checks | WCAG | Reference |
|----|---------------|------|----------|
| `aria` | ARIA role validity, required props, broken ID refs, redundant roles, aria-hidden misuse | 4.1.2, 1.3.1 | [bookmarklets/aria.md](bookmarklets/aria.md) |
| `hidden-content` | aria-hidden, display:none, visibility:hidden, sr-only, opacity:0 | 1.3.2, 4.1.2 | [bookmarklets/hidden-content.md](bookmarklets/hidden-content.md) |
| `live-regions` | aria-live, implicit live roles, aria-relevant, aria-atomic, output elements | 4.1.3 | [bookmarklets/live-regions.md](bookmarklets/live-regions.md) |
| `color-contrast` | Text contrast ratios, AA/AAA thresholds, large text detection | 1.4.3, 1.4.6 | [bookmarklets/color-contrast.md](bookmarklets/color-contrast.md) |
| `text-spacing` | WCAG 1.4.12 spacing resilience, overflow:hidden detection, line-height checks | 1.4.12 | [bookmarklets/text-spacing.md](bookmarklets/text-spacing.md) |
| `touch-target` | Interactive element sizes, 24×24 AA / 44×44 AAA thresholds | 2.5.8, 2.5.5 | [bookmarklets/touch-target.md](bookmarklets/touch-target.md) |

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
5. **Links** — link purpose and validity
6. **Buttons** — button accessibility
7. **Skip links** — bypass blocks
8. **Form labels** — form control names
9. **Autocomplete** — input purpose
10. **Form errors** — error identification
11. **Grouped fields** — fieldset/legend
12. **Language** — page and parts language
13. **Page title** — descriptive title
14. **Meta tags** — a11y meta configuration
15. **ARIA** — role validity and references
16. **Hidden content** — hidden content issues
17. **Live regions** — status messages
18. **Color contrast** — text contrast ratios
19. **Text spacing** — spacing resilience
20. **Touch targets** — target size
21. **Video controls** — media accessibility
22. **Autoplay** — audio control
23. **Captions** — subtitle tracks
24. **Audio description** — described video
25. **Viewport & Zoom** — zoom restrictions
26. **New window links** — target=_blank warnings
27. **Dark mode** — color scheme adaptation
28. **Reduced motion** — animation fallbacks
29. **Inverted colors** — media compensation
30. **Reduced transparency** — opaque fallbacks
31. **Forced colors** — High Contrast Mode

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
