export default function TabOrderTest() {
  return (
    <div>
      <h2>Interactive Form</h2>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* ERROR: Positive tabindex values — disrupts natural tab order */}
        <div className="space-y-4 my-4">
          <div>
            <label htmlFor="field-tab5">Name (tabindex=5):</label>
            <input
              id="field-tab5"
              type="text"
              tabIndex={5}
              className="ml-2 border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label htmlFor="field-tab2">Email (tabindex=2):</label>
            <input
              id="field-tab2"
              type="email"
              tabIndex={2}
              className="ml-2 border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label htmlFor="field-tab10">Phone (tabindex=10):</label>
            <input
              id="field-tab10"
              type="tel"
              tabIndex={10}
              className="ml-2 border px-2 py-1 rounded"
            />
          </div>
        </div>

        {/* ERROR: Hidden element that is still focusable */}
        <div style={{ display: "none" }}>
          <button type="button" tabIndex={0}>
            Hidden but focusable button
          </button>
        </div>

        {/* ERROR: Focusable element hidden with visibility:hidden */}
        <div style={{ visibility: "hidden", height: 0, overflow: "hidden" }}>
          <a href="#nowhere">Invisible focusable link</a>
        </div>

        {/* ERROR: Non-interactive element with tabindex="0" without a role */}
        <div tabIndex={0} className="p-3 my-4 bg-gray-100 rounded border">
          This div is focusable but has no interactive role. Screen readers won't know what to do
          with it.
        </div>

        {/* ERROR: Span with tabindex acting as button without role */}
        <span
          tabIndex={0}
          className="inline-block px-3 py-1 bg-blue-100 rounded cursor-pointer my-2"
        >
          Click me (span with tabindex, no role)
        </span>

        {/* CORRECT: Proper focusable elements */}
        <div className="space-y-3 mt-6 pt-6 border-t">
          <h3>Correct Examples</h3>
          <div>
            <label htmlFor="field-normal">Normal field (no tabindex):</label>
            <input id="field-normal" type="text" className="ml-2 border px-2 py-1 rounded" />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
