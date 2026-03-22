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
