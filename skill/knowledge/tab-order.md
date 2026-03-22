# Tab Order

Visualize and audit keyboard tab order: positive tabindex, hidden focusable elements.

## WCAG Criteria

- 2.4.3
- 2.1.1

## What It Checks

- Positive tabindex values (alters natural tab order)
- Hidden elements that are still focusable
- Elements missing accessible names

## Details

Numbers every focusable element in DOM order so you can verify the keyboard navigation flow. Covers links, buttons, inputs, selects, textareas, elements with tabindex, contenteditable, and media controls.

## Data Returned

Array of `{ index, tabindex, selector, element, tag, role, label }` for every focusable element.

## Tags

keyboard, focus, navigation

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/tab-order.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of tab-order.min.js>" })
   ```


2. Retrieve and analyze the JSON result:
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "JSON.stringify(window.__a11y)" })
   ```

## Result Shape

```json
{
  "bookmarklet": "tab-order",
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
