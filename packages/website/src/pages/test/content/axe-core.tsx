export default function AxeCoreTest() {
  return (
    <div>
      <h2>Comprehensive Accessibility Test Surface</h2>
      <p className="my-4">
        This page contains a wide range of deliberate WCAG 2.1 A/AA violations designed to trigger
        multiple axe-core rules in a single scan.
      </p>

      <div className="space-y-8 my-4">
        {/* ── 1.1.1 Non-text Content ── */}
        <section>
          <h3>Images</h3>

          {/* ERROR: img with no alt attribute */}
          <div>
            <img src="https://picsum.photos/seed/axe1/400/200" width={400} height={200} />
            <p className="text-sm text-gray-600 mt-1">
              ↑ <code>&lt;img&gt;</code> with no <code>alt</code> attribute (image-alt).
            </p>
          </div>

          {/* ERROR: input type="image" without alt */}
          <div className="mt-4">
            <input type="image" src="https://picsum.photos/seed/axe-btn/100/40" />
            <p className="text-sm text-gray-600 mt-1">
              ↑ <code>&lt;input type="image"&gt;</code> with no <code>alt</code> (input-image-alt).
            </p>
          </div>
        </section>

        {/* ── 1.3.1 Info and Relationships ── */}
        <section>
          <h3>Structure &amp; Forms</h3>

          {/* ERROR: input without any label */}
          <div>
            <input type="text" className="border px-3 py-2 rounded" />
            <p className="text-sm text-gray-600 mt-1">
              ↑ Text input with no <code>&lt;label&gt;</code>, <code>aria-label</code>, or{" "}
              <code>title</code> (label).
            </p>
          </div>

          {/* ERROR: select without label */}
          <div className="mt-4">
            <select className="border px-3 py-2 rounded">
              <option value="">Choose…</option>
              <option value="a">Option A</option>
              <option value="b">Option B</option>
            </select>
            <p className="text-sm text-gray-600 mt-1">
              ↑ <code>&lt;select&gt;</code> with no associated label (select-name).
            </p>
          </div>

          {/* ERROR: Duplicate IDs */}
          <div className="mt-4">
            <div id="axe-dup">First element with id="axe-dup"</div>
            <div id="axe-dup">Second element with id="axe-dup"</div>
            <p className="text-sm text-gray-600 mt-1">
              ↑ Two elements share <code>id="axe-dup"</code> (duplicate-id).
            </p>
          </div>
        </section>

        {/* ── 1.4.3 Contrast ── */}
        <section>
          <h3>Color Contrast</h3>

          <div className="p-4 rounded" style={{ backgroundColor: "#ffffff" }}>
            <p style={{ color: "#aaaaaa" }}>
              Light gray text (#aaa) on white background — contrast ratio ≈ 2.3:1, well below the
              4.5:1 AA requirement for normal text (color-contrast).
            </p>
          </div>
        </section>

        {/* ── 2.4.4 Link Purpose ── */}
        <section>
          <h3>Links</h3>

          {/* ERROR: Empty link */}
          <div>
            <a href="https://example.com"></a>
            <p className="text-sm text-gray-600 mt-1">
              ↑ Empty <code>&lt;a&gt;</code> — no text, no <code>aria-label</code> (link-name).
            </p>
          </div>

          {/* ERROR: Link wrapping only an image without alt */}
          <div className="mt-4">
            <a href="https://example.com">
              <img src="https://picsum.photos/seed/axe-link/100/40" width={100} height={40} />
            </a>
            <p className="text-sm text-gray-600 mt-1">
              ↑ Link with only an <code>&lt;img&gt;</code> that has no <code>alt</code> — the link
              has no accessible name.
            </p>
          </div>
        </section>

        {/* ── 3.1.1 Language (page-level, cannot override in React) ── */}
        <section>
          <h3>Language</h3>

          {/* ERROR: lang attribute with invalid value */}
          <p lang="zzzz">
            This paragraph has <code>lang="zzzz"</code> — an invalid IETF language tag
            (valid-lang).
          </p>
        </section>

        {/* ── 4.1.2 Name, Role, Value ── */}
        <section>
          <h3>ARIA &amp; Buttons</h3>

          {/* ERROR: Button with no accessible name */}
          <div>
            <button type="button" className="px-4 py-2 border rounded"></button>
            <p className="text-sm text-gray-600 mt-1">
              ↑ Empty <code>&lt;button&gt;</code> — no accessible name (button-name).
            </p>
          </div>

          {/* ERROR: Invalid ARIA role */}
          <div className="mt-4">
            <div role="foo" className="p-3 border rounded">
              Content with <code>role="foo"</code>.
            </div>
            <p className="text-sm text-gray-600 mt-1">
              ↑ <code>role="foo"</code> is not a valid WAI-ARIA role (aria-allowed-role /
              aria-roles).
            </p>
          </div>

          {/* ERROR: aria-hidden on focusable element */}
          <div className="mt-4">
            <button type="button" aria-hidden="true" className="px-4 py-2 border rounded">
              Hidden but focusable
            </button>
            <p className="text-sm text-gray-600 mt-1">
              ↑ Focusable <code>&lt;button&gt;</code> with <code>aria-hidden="true"</code> —
              keyboard users can reach it but screen readers skip it
              (aria-hidden-focus).
            </p>
          </div>

          {/* ERROR: Missing required ARIA attributes */}
          <div className="mt-4">
            <div role="slider" className="w-full h-2 bg-gray-300 rounded relative">
              <div className="absolute h-full w-1/3 bg-blue-500 rounded" />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              ↑ <code>role="slider"</code> without required <code>aria-valuenow</code>,{" "}
              <code>aria-valuemin</code>, <code>aria-valuemax</code>{" "}
              (aria-required-attr).
            </p>
          </div>
        </section>

        {/* ── Best Practices ── */}
        <section>
          <h3>Best Practices</h3>

          {/* ERROR: Tabindex > 0 */}
          <div>
            <button type="button" tabIndex={5} className="px-4 py-2 border rounded">
              tabIndex=5
            </button>
            <p className="text-sm text-gray-600 mt-1">
              ↑ Positive <code>tabindex</code> disrupts natural tab order (tabindex).
            </p>
          </div>

          {/* ERROR: Scrolling content via marquee (deprecated element) */}
          <div className="mt-4" dangerouslySetInnerHTML={{
            __html: `<marquee>Scrolling announcement text</marquee>
              <p class="text-sm text-gray-600 mt-1">
                ↑ Deprecated <code>&lt;marquee&gt;</code> element — causes reading difficulty and is
                not pausable (marquee).
              </p>`
          }} />
        </section>

        {/* ── Correct examples ── */}
        <section className="p-4 border border-green-200 bg-green-50 rounded">
          <h3>Correct Examples</h3>
          <div className="space-y-4">
            <div>
              <img
                src="https://picsum.photos/seed/axe-ok/400/200"
                alt="Mountain landscape at sunrise with soft orange hues"
                width={400}
                height={200}
              />
              <p className="text-sm text-gray-600 mt-1">✓ Image with descriptive alt text.</p>
            </div>

            <div>
              <label htmlFor="axe-name" className="block font-medium mb-1">
                Full Name
              </label>
              <input id="axe-name" type="text" className="border px-3 py-2 rounded w-full" />
              <p className="text-sm text-gray-600 mt-1">
                ✓ Input properly associated with a label via matching <code>htmlFor</code>/
                <code>id</code>.
              </p>
            </div>

            <div>
              <a href="https://example.com" className="text-blue-600 underline">
                Visit the accessibility guidelines
              </a>
              <p className="text-sm text-gray-600 mt-1">✓ Link with descriptive text content.</p>
            </div>

            <div>
              <button type="button" className="px-4 py-2 bg-green-600 text-white rounded">
                Submit Form
              </button>
              <p className="text-sm text-gray-600 mt-1">
                ✓ Button with visible text as accessible name.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
