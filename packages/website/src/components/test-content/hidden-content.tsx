export default function HiddenContentTest() {
  return (
    <div>
      <h2>Content Visibility Patterns</h2>

      <div className="space-y-6 my-4">
        {/* ERROR: aria-hidden="true" with focusable children */}
        <div>
          <h3>Hidden Navigation</h3>
          <div aria-hidden="true" className="p-4 border rounded bg-gray-50">
            <button type="button" className="px-3 py-1 border rounded mr-2">
              Previous
            </button>
            <button type="button" className="px-3 py-1 border rounded mr-2">
              Next
            </button>
            <a href="#hidden-link" className="text-blue-600 underline">
              More info
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ <code>aria-hidden="true"</code> container with focusable buttons and a link inside.
          </p>
        </div>

        {/* ERROR: Important content hidden with display:none */}
        <div>
          <h3>Important Notice</h3>
          <div style={{ display: "none" }}>
            <p>Your account will be deleted in 30 days unless you verify your email address.</p>
          </div>
          <p className="text-sm text-gray-600">
            ↑ Critical warning hidden with <code>display: none</code> — invisible to everyone.
          </p>
        </div>

        {/* ERROR: Content hidden with visibility:hidden */}
        <div>
          <h3>Status Messages</h3>
          <div style={{ visibility: "hidden", height: 40 }}>
            <p>3 unread messages in your inbox.</p>
          </div>
          <p className="text-sm text-gray-600">
            ↑ Status message hidden with <code>visibility: hidden</code>.
          </p>
        </div>

        {/* ERROR: Content hidden with opacity:0 without aria handling */}
        <div>
          <h3>Tooltip Content</h3>
          <div style={{ opacity: 0 }} className="p-3 bg-gray-800 text-white rounded">
            This tooltip is visually invisible (opacity: 0) but still occupies space and is
            accessible to screen readers without proper aria handling.
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ <code>opacity: 0</code> — visually hidden but still in the accessibility tree. Should
            have <code>aria-hidden="true"</code> if not meant to be read.
          </p>
        </div>

        {/* ERROR: Off-screen content without sr-only intent */}
        <div>
          <h3>Off-screen Element</h3>
          <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}>
            <button type="button">Hidden action button</button>
          </div>
          <p className="text-sm text-gray-600">
            ↑ Element positioned off-screen with a focusable button — when users tab to it, focus
            disappears visually.
          </p>
        </div>

        {/* CORRECT: sr-only pattern for screen-reader-only text */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <h3>Correct Example — SR Only</h3>
          <p>
            There are <span className="sr-only">three</span>
            <span aria-hidden="true">3</span> items in your cart.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ✓ Uses <code>sr-only</code> class to provide screen-reader-only text alongside visual
            content.
          </p>
        </div>

        {/* CORRECT: Properly hidden decorative element */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <h3>Correct Example — Decorative Hidden</h3>
          <span aria-hidden="true" className="text-2xl mr-2">
            ✨
          </span>
          <span>New feature available!</span>
          <p className="text-sm text-gray-600 mt-1">
            ✓ Decorative emoji hidden from assistive tech with <code>aria-hidden="true"</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
