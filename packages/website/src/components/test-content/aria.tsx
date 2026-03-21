export default function AriaTest() {
  return (
    <div>
      <h2>Complex Web Application</h2>

      <div className="space-y-6 my-4">
        {/* ERROR: Invalid ARIA role */}
        <div>
          <div role="invalid-role" className="p-4 border rounded">
            <h3>Notifications Panel</h3>
            <p>
              This panel has <code>role="invalid-role"</code> which is not a valid WAI-ARIA role.
            </p>
          </div>
        </div>

        {/* ERROR: Redundant role on semantic element */}
        <div>
          <nav role="navigation" className="p-3 bg-gray-100 rounded">
            <a href="#a1">Link 1</a> | <a href="#a2">Link 2</a> | <a href="#a3">Link 3</a>
          </nav>
          <p className="text-sm text-gray-600 mt-1">
            ↑ <code>&lt;nav role="navigation"&gt;</code> — redundant. <code>&lt;nav&gt;</code>
            already implies <code>role="navigation"</code>.
          </p>
        </div>

        {/* ERROR: Missing required ARIA properties */}
        <div>
          <div role="slider" className="w-full h-2 bg-gray-300 rounded my-2 relative">
            <div className="absolute h-full w-1/3 bg-blue-500 rounded" />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ <code>role="slider"</code> without required <code>aria-valuenow</code>,{" "}
            <code>aria-valuemin</code>, <code>aria-valuemax</code>.
          </p>
        </div>

        {/* ERROR: aria-labelledby referencing nonexistent ID */}
        <div>
          <section aria-labelledby="heading-that-does-not-exist" className="p-4 border rounded">
            <h3>Settings Section</h3>
            <p>
              This section's <code>aria-labelledby</code> points to "heading-that-does-not-exist" —
              broken reference.
            </p>
          </section>
        </div>

        {/* ERROR: aria-hidden="true" on focusable element */}
        <div>
          <div aria-hidden="true" className="p-4 border rounded">
            <p>This content is hidden from assistive technology, but contains:</p>
            <button type="button" className="px-3 py-1 bg-blue-600 text-white rounded mt-2">
              A focusable button inside aria-hidden
            </button>
            <a href="https://example.com" className="block mt-2 text-blue-600 underline">
              A focusable link inside aria-hidden
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ <code>aria-hidden="true"</code> on a container with focusable children — keyboard
            users can focus elements they can't "see" via assistive technology.
          </p>
        </div>

        {/* ERROR: aria-describedby with broken reference */}
        <div>
          <label htmlFor="aria-field">Username</label>
          <input
            id="aria-field"
            type="text"
            aria-describedby="nonexistent-description"
            className="ml-2 border px-2 py-1 rounded"
          />
          <p className="text-sm text-gray-600 mt-1">
            ↑ <code>aria-describedby="nonexistent-description"</code> — broken ID reference.
          </p>
        </div>

        {/* ERROR: Multiple redundant roles */}
        <div>
          <ul role="list" className="list-disc pl-5">
            <li role="listitem">Item 1</li>
            <li role="listitem">Item 2</li>
          </ul>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Redundant <code>role="list"</code> on <code>&lt;ul&gt;</code> and{" "}
            <code>role="listitem"</code> on <code>&lt;li&gt;</code>.
          </p>
        </div>

        {/* CORRECT: Proper ARIA usage */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <h3 id="correct-section-heading">Correct ARIA Example</h3>
          <section aria-labelledby="correct-section-heading">
            <div
              role="slider"
              aria-valuenow={50}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Volume"
              tabIndex={0}
              className="w-full h-2 bg-gray-300 rounded my-2 relative"
            >
              <div className="absolute h-full w-1/2 bg-green-500 rounded" />
            </div>
            <p className="text-sm text-gray-600">
              ✓ Slider with all required properties, section with valid <code>aria-labelledby</code>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
