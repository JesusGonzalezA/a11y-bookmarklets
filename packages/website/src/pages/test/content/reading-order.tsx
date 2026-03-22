export default function ReadingOrderTest() {
  return (
    <div>
      <h2>Page Layout with Mixed Ordering</h2>

      <div className="space-y-6 my-4">
        {/* ERROR: Flexbox CSS order reorders children away from DOM order */}
        <div>
          <h3>Flexbox Reordered Content</h3>
          <div className="flex gap-4">
            <div className="p-4 border rounded flex-1" style={{ order: 3 }}>
              <p>
                <strong>DOM 1st, Visual 3rd</strong> (order: 3)
              </p>
              <p className="text-sm text-gray-600 mt-1">
                This paragraph is first in the source code but displayed last due to CSS order.
              </p>
            </div>
            <div className="p-4 border rounded flex-1" style={{ order: 1 }}>
              <p>
                <strong>DOM 2nd, Visual 1st</strong> (order: 1)
              </p>
              <p className="text-sm text-gray-600 mt-1">
                This paragraph is second in source but displayed first.
              </p>
            </div>
            <div className="p-4 border rounded flex-1" style={{ order: 2 }}>
              <p>
                <strong>DOM 3rd, Visual 2nd</strong> (order: 2)
              </p>
              <p className="text-sm text-gray-600 mt-1">
                This paragraph is third in source but displayed second.
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            ↑ Screen readers read DOM order (1→2→3), but visually it's 2→3→1. This creates a
            confusing experience.
          </p>
        </div>

        {/* ERROR: Grid area reordering */}
        <div>
          <h3>Grid Area Displacement</h3>
          <div
            className="gap-4"
            style={{
              display: "grid",
              gridTemplateAreas: '"sidebar main" "sidebar footer"',
              gridTemplateColumns: "200px 1fr",
            }}
          >
            <div className="p-4 border rounded" style={{ gridArea: "main" }}>
              <p>
                <strong>Main content</strong> — DOM 1st, grid places it top-right.
              </p>
            </div>
            <div className="p-4 border rounded" style={{ gridArea: "footer" }}>
              <p>
                <strong>Footer</strong> — DOM 2nd, grid places it bottom-right.
              </p>
            </div>
            <div className="p-4 border rounded" style={{ gridArea: "sidebar" }}>
              <p>
                <strong>Sidebar</strong> — DOM 3rd, grid places it left column.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Screen readers hit Sidebar last, but it appears first visually.
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            ↑ DOM order: Main → Footer → Sidebar. Visual order: Sidebar → Main → Footer.
          </p>
        </div>

        {/* ERROR: Absolute positioning displaces element from DOM flow */}
        <div>
          <h3>Absolutely Positioned Content</h3>
          <div className="relative border rounded p-4" style={{ minHeight: 120 }}>
            <p>First paragraph in normal flow.</p>
            <p
              className="bg-yellow-100 p-2 rounded"
              style={{ position: "absolute", top: 8, right: 8 }}
            >
              <strong>Absolute top-right</strong> — reads after "First paragraph" in DOM, but
              appears before it visually.
            </p>
            <p className="mt-8">
              Third paragraph in normal flow. The absolute element above creates a reading order
              mismatch.
            </p>
          </div>
        </div>

        {/* ERROR: Positive tabindex disrupts focus order */}
        <div>
          <h3>Positive Tabindex</h3>
          <div className="flex gap-3">
            <button type="button" tabIndex={5} className="px-3 py-1 border rounded">
              Tab 5
            </button>
            <button type="button" tabIndex={1} className="px-3 py-1 border rounded">
              Tab 1
            </button>
            <button type="button" className="px-3 py-1 border rounded">
              Natural order
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Positive <code>tabindex</code> values force focus to jump out of visual/DOM order.
          </p>
        </div>

        {/* CORRECT: DOM order matches visual order */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <h3>Correct Example — Natural Order</h3>
          <p>First paragraph — both DOM and visual position #1.</p>
          <p>Second paragraph — both DOM and visual position #2.</p>
          <p>Third paragraph — both DOM and visual position #3.</p>
          <p className="text-sm text-gray-600 mt-2">
            ✓ DOM and visual order match perfectly. Screen readers and sighted users experience the
            same content flow.
          </p>
        </div>
      </div>
    </div>
  );
}
