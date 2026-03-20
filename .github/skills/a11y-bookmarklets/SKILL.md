---
name: a11y-bookmarklets
description: Use this skill when auditing web accessibility, running a11y checks, analyzing WCAG compliance, or when the user asks to check headings, landmarks, tab order, images, alt text, or semantic structure of a web page. Also use when the user says "audit accessibility", "check a11y", "WCAG audit", or "run bookmarklet".
---

# A11y Bookmarklets — Accessibility Audit Skill

You are an expert accessibility auditor. You use specialized bookmarklets that inject visual overlays AND return structured JSON data to perform thorough WCAG audits.

## Available Bookmarklets

| ID | What it checks | WCAG |
|----|---------------|------|
| `headings` | Heading hierarchy (h1-h6), skipped levels, empty headings, multiple h1s | 1.3.1, 2.4.6 |
| `landmarks` | Semantic landmarks (main, nav, banner, contentinfo, complementary, search) | 1.3.1, 2.4.1 |
| `tab-order` | Keyboard tab sequence, positive tabindex, hidden focusables | 2.4.3, 2.1.1 |
| `images` | Alt text, decorative images, suspicious alt patterns | 1.1.1 |

## How to Audit a Page

### Prerequisites
- Access to the **Playwright MCP server** (`@playwright/mcp`) to control a browser.
- The `a11y-bookmarklets` MCP server configured (see §Using the MCP Server below).

> **Important — CSP & script injection**: Never use `<script src>` to load bookmarklets from a CDN inside `browser_evaluate`. Most real pages have a Content-Security-Policy that blocks external scripts. The MCP `get_audit_script` tool returns **inline code** (when bookmarklets are built locally) that runs via CDP and bypasses CSP entirely.

### Step-by-step workflow

1. **Navigate** to the target URL using `browser_navigate`.

2. **Get the audit script** from the MCP server:
   ```
   get_audit_script({ bookmarklet: "headings" })
   ```
   The response contains a `script` field. That value is a **function expression** ready to pass directly to `browser_evaluate`.

3. **Execute the script** via `browser_evaluate`, passing `script` as the `function` parameter:
   ```
   browser_evaluate({ function: "<value of script field>" })
   ```
   The function:
   - Inlines the bookmarklet code (CSP-safe, runs via CDP)
   - Adds visual overlays to the page
   - Returns an `AuditResult` JSON object directly

4. **If the result is `null` or `undefined`** (the bookmarklet ran but the function didn't return), read the result from `window.__a11y` in a second call:
   ```javascript
   // Fallback second call:
   browser_evaluate({ function: "() => window.__a11y?.['headings']?.lastResult ?? null" })
   ```
   This happens when the `get_audit_script` fell back to the CDN mode (bookmarklets not built locally). In that case the CDN load will fail with a CSP error — you must build locally: `npm run build:bookmarklets`.

5. **Take a screenshot** — the page now has visual overlays (colored labels on headings, outlines on landmarks, numbered tab stops, etc.).

6. **Analyze the JSON result**. The structure is:
   ```json
   {
     "bookmarklet": "headings",
     "url": "https://example.com",
     "timestamp": "2025-01-15T10:30:00Z",
     "issues": [
       {
         "severity": "error|warning|info|pass",
         "message": "Human-readable description",
         "selector": "CSS selector",
         "html": "Truncated outerHTML",
         "wcag": "1.3.1",
         "suggestion": "How to fix it",
         "data": {}
       }
     ],
     "summary": {
       "total": 10,
       "errors": 2,
       "warnings": 3,
       "passes": 4,
       "info": 1
     }
   }
   ```

7. **Report findings** with:
   - Severity (error > warning > info > pass)
   - WCAG success criterion number and name
   - The specific element (CSS selector)
   - A concrete fix suggestion

8. **Repeat** for each bookmarklet relevant to the audit scope.

### Troubleshooting browser_evaluate

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Failed to load bookmarklet script` | CDN blocked by CSP | Build locally: `npm run build:bookmarklets` |
| Result is `null` / `undefined` | Function body ran but didn't return | Run fallback: `() => window.__a11y?.['<id>']?.lastResult` |
| Script starts with `// WARNING: CDN fallback` | Bookmarklets not built | `npm run build:bookmarklets` then rebuild MCP server |
| `window.__a11y` is undefined after execution | Bookmarklet threw an error | Check console errors in browser; verify the minified JS is valid |

## Recommended Audit Order

1. **Headings** — structural foundation
2. **Landmarks** — page regions
3. **Tab order** — keyboard navigation
4. **Images** — alt text

## Interpreting Results

### Severity Levels
- **error**: WCAG violation, must fix. Screen reader users or keyboard users WILL be affected.
- **warning**: Likely issue or best practice violation. Should be fixed.
- **info**: Informational — describes what was found (e.g., listing each heading).
- **pass**: Element passed the check.

### Common Findings and Fixes

#### Headings
- "Heading level skipped: h2 → h4" → Add the missing h3
- "Empty heading" → Add text or remove the heading
- "Multiple h1 elements" → Keep one h1 as the main page title
- "No h1 found" → Add an h1 heading

#### Landmarks
- "No main landmark" → Wrap primary content in `<main>`
- "Multiple nav without labels" → Add `aria-label` to each nav
- "No navigation landmark" → Use `<nav>` for navigation menus

#### Tab Order
- "Positive tabindex" → Remove tabindex, use DOM order
- "Hidden element in tab order" → Add `tabindex="-1"`

#### Images
- "No alt attribute" → Add `alt="description"` or `alt=""` if decorative
- "Suspicious alt text" → Write a meaningful description
- "Very long alt text" → Shorten, consider longdesc

## Using the MCP Server

The `a11y-bookmarklets` MCP server is the **primary** way to run audits. Use these tools:

1. `list_bookmarklets` — See available audits and their WCAG coverage
2. `get_audit_script` — Get the function expression to inject for a specific bookmarklet
3. `interpret_results` — Get a formatted WCAG-based analysis of audit JSON results

### How `get_audit_script` works

- **Inline mode** (preferred, CSP-safe): When bookmarklets are built (`dist/bookmarklets/*.min.js` exist), the tool returns a function expression with the compiled JS inlined. The function returns the `AuditResult` directly.

The `script` field in the response is always a **function expression** (`() => { ... }`). Use it as:
```
browser_evaluate({ function: result.script })
```

Workspace config (`.vscode/mcp.json`):
```json
{
  "servers": {
    "bookmarklets": {
      "type": "stdio",
      "command": "node",
      "args": ["packages/mcp-server/dist/index.js"]
    }
  }
}
```

## Output Format for Audit Reports

When presenting findings to the user, format them as:

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
