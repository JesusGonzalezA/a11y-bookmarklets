---
name: add-bookmarklet
description: "Use this skill when creating a new bookmarklet for the a11y-bookmarklets project. Triggers on: 'add bookmarklet', 'create bookmarklet', 'new bookmarklet', 'implement bookmarklet', 'add a11y check', 'new accessibility audit'. Covers the full lifecycle: catalog entry, domain class, auditor, renderer, entry point, registration, build system, README, and SKILL.md updates."
---

# Add Bookmarklet — Full Implementation Workflow

You are adding a new accessibility bookmarklet to the a11y-bookmarklets monorepo. Every bookmarklet follows the same architecture: **catalog → domain class → auditor → renderer → entry point → registration → build → docs**.

## Architecture Overview

```
packages/bookmarklets/src/
├── catalog/{id}.ts              ← Metadata (id, name, description, wcag, checks, tags)
├── catalog/index.ts             ← Re-exports + BOOKMARKLET_CATALOG array
├── domain/
│   ├── Bookmarklet.ts           ← Sync base class (Template Method)
│   ├── AsyncBookmarklet.ts      ← Async base class (for CDN/fetch-based bookmarklets)
│   ├── types.ts                 ← AuditOutput<T>, AuditResult, Issue, Severity
│   └── bookmarklets/
│       ├── {Id}Bookmarklet.ts   ← Concrete class extending Bookmarklet<T> or AsyncBookmarklet<T>
│       └── {id}/
│           ├── types.ts         ← Bookmarklet-specific data types
│           ├── {Id}Auditor.ts   ← Pure analysis logic → AuditOutput<T>
│           └── {Id}Renderer.ts  ← Visual overlays + result panel
├── entry/{id}.ts                ← Bootstrap: `new {Id}Bookmarklet().run()`
└── index.ts                     ← Public API exports
```

## Decision: Sync vs Async

- **Sync** (`extends Bookmarklet<T>`): All analysis is synchronous DOM traversal. This is the default for most bookmarklets.
- **Async** (`extends AsyncBookmarklet<T>`): The bookmarklet must load external resources (CDN scripts, fetch API data) before analysis. Add `"async"` to the catalog `tags` array — the build system uses this to generate `async () => {}` skill script wrappers.

## Procedure

### Step 1 — Define Catalog Entry

Create `packages/bookmarklets/src/catalog/{id}.ts`:

```typescript
import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const {UPPER_ID}_CATALOG: BookmarkletCatalogEntry = {
  id: "{id}",
  name: "{Display Name}",
  description: "{One-line description of what this bookmarklet audits.}",
  wcag: ["{criterion1}", "{criterion2}"],
  details: "{Longer explanation of how the bookmarklet works, what visual indicators it shows, and what data it returns.}",
  checks: [
    "{Check 1}",
    "{Check 2}",
  ],
  dataReturned: "{Description of the typed data array/object returned by audit().}",
  tags: ["{tag1}", "{tag2}"],
  // Add "async" to tags if the bookmarklet needs async operations
};
```

**Reference**: Use existing catalogs as templates — [packages/bookmarklets/src/catalog/images.ts](packages/bookmarklets/src/catalog/images.ts) for sync, [packages/bookmarklets/src/catalog/axe-core.ts](packages/bookmarklets/src/catalog/axe-core.ts) for async.

### Step 2 — Define Types

Create `packages/bookmarklets/src/domain/bookmarklets/{id}/types.ts`:

```typescript
export interface {TypeName}Data {
  selector: string;
  // ... bookmarklet-specific fields
}
```

The generic type `T` in `Bookmarklet<T>` / `AsyncBookmarklet<T>` is this data type (usually an array or object).

### Step 3 — Implement Auditor

Create `packages/bookmarklets/src/domain/bookmarklets/{id}/{Id}Auditor.ts`:

```typescript
import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { createIssue, noElementsIssue } from "../shared/issue-helpers.js";
import type { {TypeName}Data } from "./types.js";

export function audit{Id}(): AuditOutput<{TypeName}Data[]> {
  const elements = queryAll("{css-selector}");
  const issues: Issue[] = [];
  const data: {TypeName}Data[] = [];

  for (const el of elements) {
    const selector = uniqueSelector(el);
    // ... analysis logic ...

    // Create issues using the factory:
    issues.push(
      createIssue("error" | "warning" | "pass" | "info", "Message", {
        selector,
        html: truncatedHtml(el),
        wcag: "{criterion}",
        suggestion: "How to fix",
        data: { /* bookmarklet-specific */ },
      }),
    );
  }

  if (elements.length === 0) {
    issues.push(noElementsIssue("info", "{element type}", "{wcag}"));
  }

  return { issues, data };
}
```

**Key utilities available**:
- `queryAll(selector)` — `document.querySelectorAll` as array
- `uniqueSelector(el)` — CSS selector string for any element
- `truncatedHtml(el, maxLen?)` — outer HTML truncated to 200 chars
- `createIssue(severity, message, opts?)` — Issue factory
- `noElementsIssue(severity, type, wcag)` — "No X found" issue
- For CSS media query bookmarklets: `findMediaRules()`, `hasMediaQuery()`, `countInaccessibleStylesheets()`

**Severity guidelines**:
| Severity | When to use |
|----------|------------|
| `"error"` | WCAG violation — must fix |
| `"warning"` | Likely issue or best-practice violation |
| `"info"` | Informational — describes what was found |
| `"pass"` | Element passed the check |

### Step 4 — Implement Renderer

Create `packages/bookmarklets/src/domain/bookmarklets/{id}/{Id}Renderer.ts`:

```typescript
import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { {TypeName}Data } from "./types.js";

export function render{Id}(data: {TypeName}Data[], issues: Issue[]): void {
  renderOverlays(
    data.map((item) => ({
      selector: item.selector,
      color: "#e74c3c",  // red for errors, #2ecc71 green for pass, #e67e22 orange for warnings
      label: "label text",
    })),
  );

  showResultPanel("{Title} ({count})", issues, {
    summaryHtml: `<div>
        <div style="color:#e74c3c">✗ Errors: ${errorCount}</div>
        <div style="color:#2ecc71">✓ Passed: ${passCount}</div>
      </div>`,
  });
}
```

**Color conventions**: Red `#e74c3c` = error/missing, Orange `#e67e22` = warning, Green `#2ecc71` = pass, Gray `#95a5a6` = decorative/skipped, Blue `#3498db` = info.

### Step 5 — Create Bookmarklet Class

Create `packages/bookmarklets/src/domain/bookmarklets/{Id}Bookmarklet.ts`:

```typescript
import { {UPPER_ID}_CATALOG } from "../../catalog/{id}.js";
import { Bookmarklet } from "../Bookmarklet.js";  // or AsyncBookmarklet
import type { AuditOutput, Issue } from "../types.js";
import { audit{Id} } from "./{id}/{Id}Auditor.js";
import { render{Id} } from "./{id}/{Id}Renderer.js";
import type { {TypeName}Data } from "./{id}/types.js";

export class {Id}Bookmarklet extends Bookmarklet<{TypeName}Data[]> {
  constructor() {
    super({UPPER_ID}_CATALOG);
  }

  protected audit(): AuditOutput<{TypeName}Data[]> {
    return audit{Id}();
  }

  protected render(data: {TypeName}Data[], issues: Issue[]): void {
    render{Id}(data, issues);
  }
}
```

For async bookmarklets, use `AsyncBookmarklet<T>` and make `audit()` return `Promise<AuditOutput<T>>`.

### Step 6 — Create Test Page (React)

Create `packages/website/src/pages/test/content/{id}.tsx` — A React component with examples of both passing and failing cases for your bookmarklet.

```tsx
export default function {PascalCase}Test() {
  return (
    <div>
      <h2>{Display Name} Test Page</h2>

      <div className="space-y-6 my-4">
        {/* ERROR: Failing example */}
        <div>
          <h3>Failing Example Title</h3>
          {/* Content that should FAIL the audit */}
          <p className="text-sm text-gray-600 mt-1">
            ↑ Explanation of why this fails.
          </p>
        </div>

        {/* CORRECT: Passing example */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <h3>Correct Example — Passing Title</h3>
          {/* Content that should PASS the audit */}
          <p className="text-sm text-gray-600 mt-2">
            ✓ Explanation of why this passes.
          </p>
        </div>
      </div>
    </div>
  );
}
```

Then register the component in `packages/website/src/pages/test/content/index.ts`:

```typescript
"{id}": lazy(() => import("./{id}")),
```

Add the entry in alphabetical order within the appropriate category block, keeping `"axe-core"` last.

**Use this page to**:
- Manually test the bookmarklet in the website dev server
- Verify overlays appear correctly
- Check console output and `window.__a11y['{id}'].lastResult` JSON
- Document expected behavior for future developers

### Step 7 — Create Entry Point

Create `packages/bookmarklets/src/entry/{id}.ts`:

```typescript
import { {Id}Bookmarklet } from "../domain/bookmarklets/{Id}Bookmarklet.js";

new {Id}Bookmarklet().run();
```

### Step 8 — Register in Catalog Index

Update `packages/bookmarklets/src/catalog/index.ts`:
1. Add `export { {UPPER_ID}_CATALOG } from "./{id}.js";` (alphabetical order in the export block)
2. Add `import { {UPPER_ID}_CATALOG } from "./{id}.js";` (alphabetical order in the import block)
3. Add `{UPPER_ID}_CATALOG,` to the `BOOKMARKLET_CATALOG` array in the appropriate category comment block

### Step 9 — Register in Public API

Update `packages/bookmarklets/src/index.ts`:
1. Add `{UPPER_ID}_CATALOG,` to the catalog export block (alphabetical)
2. Add `export { {Id}Bookmarklet } from "./domain/bookmarklets/{Id}Bookmarklet.js";` (alphabetical)

### Step 10 — Update README

Update `README.md`:
- Add a row to the appropriate category table (or create a new category section)
- Format: `| **{Display Name}** | {Spanish description} | {WCAG criteria} |`

### Step 11 — Update Skill

Update `skills/a11y-bookmarklets/SKILL.md`:
1. Add a row to the appropriate "Available Bookmarklets" table
2. Add the bookmarklet to "Recommended Audit Order" at the appropriate position
3. For async bookmarklets, note "(async)" in the description

### Step 12 — Build and Verify

```bash
npm run build                    # TypeScript compilation
npm run build:bookmarklets       # Compile all bookmarklets
```

**Verify these outputs exist**:
- `dist/bookmarklets/{id}.min.js` — Compiled bookmarklet (IIFE)
- `dist/bookmarklets/{id}.bookmarklet.js` — `javascript:void(...)` URL
- `skills/a11y-bookmarklets/scripts/{id}.min.js` — Skill script (arrow function wrapper)
- `skills/a11y-bookmarklets/knowledge/{id}.md` — Auto-generated knowledge doc
- `skills/a11y-bookmarklets/scripts/manifest.json` — Updated manifest with new entry

**Quick verification commands**:
```bash
head -1 skills/a11y-bookmarklets/scripts/{id}.min.js   # Should start with "() =>" or "async () =>"
cat skills/a11y-bookmarklets/knowledge/{id}.md          # Should have WCAG, checks, result shape
grep -c "{id}" skills/a11y-bookmarklets/scripts/manifest.json  # Should be > 0
```

## Reference — Project Conventions

### File naming
- Catalog: `{id}.ts` (kebab-case, matches bookmarklet ID)
- Types: `types.ts` inside the bookmarklet subfolder
- Auditor: `{PascalCase}Auditor.ts`
- Renderer: `{PascalCase}Renderer.ts`
- Bookmarklet class: `{PascalCase}Bookmarklet.ts`
- Entry: `{id}.ts` (kebab-case)

### Import conventions
- All imports use `.js` extensions (TypeScript project with ESM)
- Infrastructure utilities imported from `../../../infrastructure/...`
- Shared helpers from `../shared/issue-helpers.js` and `../shared/render-helpers.js`

### Build auto-generation
The CLI (`packages/bookmarklets/build/cli.ts`) auto-generates from the entry point + catalog:
- Minified JS (esbuild → SWC ES5 downlevel for bookmarklets, ES2020 for skill scripts)
- `javascript:void(...)` bookmarklet URL
- Skill script with `() => { ...IIFE...; return window.__a11y['{id}'].lastResult; }` wrapper
- Knowledge `.md` file from catalog fields
- Manifest entry with metadata + file size

### Async bookmarklets
If your bookmarklet tag includes `"async"`, the CLI generates `async () => {}` skill script wrappers instead of sync ones. The `AsyncBookmarklet<T>` base class handles the async template method pattern.
