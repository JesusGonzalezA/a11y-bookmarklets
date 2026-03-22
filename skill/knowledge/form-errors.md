# Form Errors

Audit form error handling: aria-invalid, aria-errormessage, error descriptions, and live regions.

## WCAG Criteria

- 3.3.1
- 3.3.3

## What It Checks

- Invalid fields without error messages
- aria-errormessage referencing missing IDs
- Alert/status live regions for error announcements
- Error message visibility

## Details

Inspects fields with aria-invalid for associated error messages via aria-errormessage and aria-describedby. Validates that referenced IDs exist and are visible. Detects alert/status live regions for error announcements.

## Data Returned

Array of `{ selector, tagName, isInvalid, hasErrorMessage, errorMessageId, errorMessageText, hasLiveRegion }`.

## Tags

forms, errors, validation

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/form-errors.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of form-errors.min.js>" })
   ```


2. Retrieve and analyze the JSON result:
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "JSON.stringify(window.__a11y)" })
   ```

## Result Shape

```json
{
  "bookmarklet": "form-errors",
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
