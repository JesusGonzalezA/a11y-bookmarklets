---
name: a11y-bookmarklets
description: Use this skill when auditing web accessibility, running a11y checks, analyzing WCAG compliance, or when the user asks to check headings, landmarks, tab order, images, alt text, video captions, autoplay, audio description, viewport zoom, language, page title, forms, links, buttons, ARIA, color contrast, touch targets, or semantic structure of a web page. Also use when the user says "audit accessibility", "check a11y", "WCAG audit", or "run bookmarklet".
---

# A11y Bookmarklets — Accessibility Audit Skill

You are an expert accessibility auditor. You inject specialized bookmarklets into web pages via Chrome DevTools MCP, then analyze the structured JSON results they produce.

**IMPORTANT**: The bookmarklet scripts in `skill/scripts/` are opaque tools. Do NOT analyze or discuss script code — just read and inject them directly via Chrome DevTools Protocol (CDP).

## Available Bookmarklets

### Structure & Content

| ID | What it checks | WCAG |
|----|---------------|------|
| `headings` | Heading hierarchy (h1-h6), skipped levels, empty headings, multiple h1s | 1.3.1, 2.4.6 |
| `landmarks` | Semantic landmarks (main, nav, banner, contentinfo, complementary, search) | 1.3.1, 2.4.1 |
| `tab-order` | Keyboard tab sequence, positive tabindex, hidden focusables | 2.4.3, 2.1.1 |
| `images` | Alt text, decorative images, suspicious alt patterns | 1.1.1 |

### User Preferences (CSS Media Queries)

| ID | What it checks | WCAG |
|----|---------------|------|
| `dark-mode` | `prefers-color-scheme` support, color-scheme meta/CSS | 1.4.3, 1.4.6, 1.4.11 |
| `reduced-motion` | `prefers-reduced-motion` fallbacks, CSS animations/transitions | 2.3.3, 2.3.1 |
| `inverted-colors` | `inverted-colors` support, media elements needing compensation | 1.4.1, 1.4.3 |
| `reduced-transparency` | `prefers-reduced-transparency` support, semi-transparent elements | 1.4.11 |
| `forced-colors` | `forced-colors` and `prefers-contrast` support, High Contrast Mode | 1.4.11, 1.4.3 |

### Video & Media

| ID | What it checks | WCAG |
|----|---------------|------|
| `video-controls` | Native and custom controls on video/audio elements, ARIA roles, keyboard | 1.2.1, 2.1.1, 4.1.2 |
| `autoplay` | Autoplay with audio, muted state, pause/volume controls | 1.4.2 |
| `captions` | Caption/subtitle tracks, src/srclang validation, embedded videos | 1.2.2, 1.2.4 |
| `audio-description` | Description tracks, alternative version links, heuristic detection | 1.2.3, 1.2.5 |

### Meta Tags & Page Configuration

| ID | What it checks | WCAG |
|----|---------------|------|
| `viewport-zoom` | Viewport meta: user-scalable, maximum-scale, responsive reflow | 1.4.4, 1.4.10 |
| `language` | HTML lang attribute, BCP 47 validation, language of parts | 3.1.1, 3.1.2 |
| `page-title` | Document title presence, descriptiveness, length, similarity to h1 | 2.4.2 |
| `meta-tags` | Charset, description, color-scheme, theme-color, http-equiv refresh | 2.4.2, 3.2.5, 1.4.10 |

### Forms

| ID | What it checks | WCAG |
|----|---------------|------|
| `form-labels` | Accessible names for form controls: label, aria-label, aria-labelledby, title, placeholder | 1.3.1, 3.3.2, 4.1.2 |
| `autocomplete` | Autocomplete attributes on identity/financial fields, WHATWG token validation | 1.3.5 |
| `form-errors` | Error handling: aria-invalid, aria-errormessage, aria-describedby, alert regions | 3.3.1, 3.3.3 |
| `grouped-fields` | Fieldset/legend usage, radio groups, checkbox groups | 1.3.1, 3.3.2 |

### Links, Buttons & Navigation

| ID | What it checks | WCAG |
|----|---------------|------|
| `links` | Empty/generic links, faux links, accessible names, anchor validity | 2.4.4, 4.1.2 |
| `buttons` | Accessible names, faux buttons, label-in-name compliance | 4.1.2, 2.5.3 |
| `skip-links` | Skip navigation presence, target validity, first-focusable position | 2.4.1 |
| `new-window-links` | target=_blank detection, user warning, rel=noopener | 3.2.5 |

### Content & Semantics

| ID | What it checks | WCAG |
|----|---------------|------|
| `aria` | ARIA role validity, required props, broken ID refs, redundant roles, aria-hidden misuse | 4.1.2, 1.3.1 |
| `hidden-content` | aria-hidden, display:none, visibility:hidden, sr-only, opacity:0 | 1.3.2, 4.1.2 |
| `live-regions` | aria-live, implicit live roles, aria-relevant, aria-atomic, output elements | 4.1.3 |
| `color-contrast` | Text contrast ratios, AA/AAA thresholds, large text detection | 1.4.3, 1.4.6 |
| `text-spacing` | WCAG 1.4.12 spacing resilience, overflow:hidden detection, line-height checks | 1.4.12 |
| `touch-target` | Interactive element sizes, 24×24 AA / 44×44 AAA thresholds | 2.5.8, 2.5.5 |

## How to Audit a Page

### Prerequisites

Chrome DevTools MCP tools:
- `mcp_chrome-devtoo_navigate_page` — navigate to a URL
- `mcp_chrome-devtoo_evaluate_script` — inject and execute JavaScript

### Workflow

Scripts are injected directly via CDP (`evaluate_script`), which bypasses Content Security Policy (CSP) restrictions. This works on any site, including those with strict CSP like github.com. **No HTTP server is needed.**

For each bookmarklet `{id}` to audit:

1. **Navigate** to the target URL (only once per audit):
   ```
   mcp_chrome-devtoo_navigate_page({ url: "https://example.com" })
   ```

2. **Read the bookmarklet script** from the local file:
   ```
   read_file('skill/scripts/{id}.min.js')
   ```

3. **Inject the script via CDP** — Pass the file content directly as the `function` parameter. The scripts are already arrow function declarations `() => { ... }`. Append a `return` statement to retrieve the result in a single call:
   ```
   mcp_chrome-devtoo_evaluate_script({ function: "<content of {id}.min.js>\nreturn JSON.stringify(window.__a11y.{id}.lastResult);" })
   ```
   The function parameter must contain:
   - The **exact file content** from step 2 (the arrow function body)
   - A `return JSON.stringify(window.__a11y.{id}.lastResult);` appended **inside** the function body, before the closing `}`

   **Concrete example** — if `{id}.min.js` contains:
   ```js
   () => {
   "use strict";(()=>{ /* ... bookmarklet code ... */ })();
   return window.__a11y;
   }
   ```
   Then pass to evaluate_script:
   ```js
   () => {
   "use strict";(()=>{ /* ... bookmarklet code ... */ })();
   return JSON.stringify(window.__a11y.{id}.lastResult);
   }
   ```
   Replace the last `return window.__a11y;` line with `return JSON.stringify(window.__a11y.{id}.lastResult);`

4. **Read the knowledge file** for analysis context:
   ```
   read_file('skill/knowledge/{id}.md')
   ```
   The knowledge file explains what the bookmarklet checks, what the data means, and how to interpret issues.

5. **Analyze the JSON result** using the knowledge file as reference. Report findings grouped by severity with WCAG criteria, selectors, and fix suggestions.

### Result Shape

Each bookmarklet stores its results at `window.__a11y.{id}.lastResult`:
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

### Key Rules

- **Read scripts only to inject them** — Use `read_file` to get the `.min.js` content, then pass it directly to `evaluate_script`. Do not analyze or discuss the script code itself.
- **ALWAYS analyze the JSON result** — The `window.__a11y` JSON is the source of truth for the audit.
- **Use knowledge files** — Read `skill/knowledge/{id}.md` to understand what the bookmarklet checks and how to interpret results.
- **Direct CDP injection bypasses CSP** — This approach works on any website, including those with strict Content Security Policy (github.com, google.com, etc.). No HTTP server or fetch() is needed.

## Recommended Audit Order

1. `headings` — structural foundation
2. `landmarks` — page regions
3. `tab-order` — keyboard navigation
4. `images` — alt text
5. `links` — link purpose and validity
6. `buttons` — button accessibility
7. `skip-links` — bypass blocks
8. `form-labels` — form control names
9. `autocomplete` — input purpose
10. `form-errors` — error identification
11. `grouped-fields` — fieldset/legend
12. `language` — page and parts language
13. `page-title` — descriptive title
14. `meta-tags` — a11y meta configuration
15. `aria` — role validity and references
16. `hidden-content` — hidden content issues
17. `live-regions` — status messages
18. `color-contrast` — text contrast ratios
19. `text-spacing` — spacing resilience
20. `touch-target` — target size
21. `video-controls` — media accessibility
22. `autoplay` — audio control
23. `captions` — subtitle tracks
24. `audio-description` — described video
25. `viewport-zoom` — zoom restrictions
26. `new-window-links` — target=_blank warnings
27. `dark-mode` — color scheme adaptation
28. `reduced-motion` — animation fallbacks
29. `inverted-colors` — media compensation
30. `reduced-transparency` — opaque fallbacks
31. `forced-colors` — High Contrast Mode

## Severity Levels

| Level | Meaning |
|-------|---------|
| **error** | WCAG violation — must fix |
| **warning** | Likely issue or best-practice violation |
| **info** | Informational — describes what was found |
| **pass** | Element passed the check |

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
