export default function ButtonsTest() {
  return (
    <div>
      <h2>Interactive Toolbar</h2>

      <div className="space-y-6 my-4">
        {/* ERROR: Empty button — no accessible name */}
        <div>
          <button type="button" className="px-4 py-2 border rounded"></button>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Empty button — no text, no aria-label. Announced as just "button" by screen readers.
          </p>
        </div>

        {/* ERROR: Faux button — div with onClick but no role or tabindex */}
        <div>
          <div
            onClick={() => {}}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          >
            Save Changes
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ <code>&lt;div&gt;</code> with <code>onClick</code> — no <code>role="button"</code>, no{" "}
            <code>tabindex</code>, not keyboard accessible.
          </p>
        </div>

        {/* ERROR: Span styled as button without role or tabindex */}
        <div>
          <span className="inline-block px-4 py-2 bg-gray-800 text-white rounded cursor-pointer">
            Delete Item
          </span>
          <p className="text-sm text-gray-600 mt-1">
            ↑ <code>&lt;span&gt;</code> styled to look like a button — no semantics at all.
          </p>
        </div>

        {/* ERROR: Icon-only button without aria-label */}
        <div className="flex gap-2">
          <button type="button" className="p-2 border rounded">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0L10 6H16L11 9.5L13 16L8 12L3 16L5 9.5L0 6H6Z" />
            </svg>
          </button>
          <button type="button" className="p-2 border rounded">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M2 2h12v12H2zM4 4v8h8V4z" />
            </svg>
          </button>
          <p className="text-sm text-gray-600 self-center">
            ↑ Icon-only buttons with no <code>aria-label</code> — announced as empty buttons.
          </p>
        </div>

        {/* ERROR: Label-in-name violation (2.5.3) */}
        <div>
          <button type="button" aria-label="Navigate to page" className="px-4 py-2 border rounded">
            Go to Settings
          </button>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Visible text is "Go to Settings" but <code>aria-label</code> is "Navigate to page" —
            label-in-name violation (WCAG 2.5.3). Voice control users can't activate it.
          </p>
        </div>

        {/* CORRECT: Proper button */}
        <div className="p-4 border border-green-200 bg-green-50 rounded space-y-2">
          <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded">
            Submit Form
          </button>
          <button type="button" aria-label="Close dialog" className="p-2 border rounded">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <p className="text-sm text-gray-600 mt-1">
            ✓ Text button with visible label, icon button with <code>aria-label</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
