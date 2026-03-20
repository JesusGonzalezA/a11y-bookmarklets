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
You need access to the **Playwright MCP server** (`@playwright/mcp`) to control a browser.

### Step-by-step workflow

1. **Navigate** to the target URL:
   ```
   Use browser_navigate to open the page
   ```

2. **Take a baseline screenshot** to see the initial state.

3. **Run a bookmarklet** by injecting its JavaScript via `browser_evaluate`:

   For headings:
   ```javascript
   (() => {
     // Inject and run the headings bookmarklet
     const script = document.createElement('script');
     script.src = 'https://unpkg.com/@bookmarklets-a11y/headings/dist/headings.min.js';
     document.body.appendChild(script);
     return new Promise(resolve => {
       script.onload = () => resolve(window.__a11y?.headings?.lastResult);
     });
   })()
   ```

   Or if the bookmarklet is already loaded:
   ```javascript
   window.__a11y.headings.audit()
   ```

4. **Take a screenshot** — the page now has visual overlays (colored labels on headings, outlines on landmarks, numbered tab stops, etc.). The user can see these.

5. **Analyze the JSON result** returned by `browser_evaluate`. The structure is:
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

6. **Report findings** with:
   - Severity (error > warning > info > pass)
   - WCAG success criterion number and name
   - The specific element (CSS selector)
   - A concrete fix suggestion
   - Which screenshot/visual overlay relates to this finding

7. **Repeat** for each bookmarklet relevant to the audit scope.

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
