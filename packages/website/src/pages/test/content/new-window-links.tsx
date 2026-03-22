export default function NewWindowLinksTest() {
  return (
    <div>
      <h2>External Resources</h2>

      <div className="space-y-6 my-4">
        {/* ERROR: target="_blank" without any warning */}
        <div>
          <a href="https://example.com/docs" target="_blank" rel="noopener">
            Documentation
          </a>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Opens in a new window with no indication — disorienting for screen reader users.
          </p>
        </div>

        {/* ERROR: target="_blank" without rel="noopener" */}
        <div>
          <a href="https://example.com/partner" target="_blank" rel="noopener">
            Partner Website
          </a>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Missing <code>rel="noopener"</code> — potential security risk (reverse tabnapping).
          </p>
        </div>

        {/* ERROR: No visual or accessible indicator for new window */}
        <div>
          <p>
            Check out these frameworks for accessible development:{" "}
            <a href="https://example.com/react-a11y" target="_blank" rel="noopener">
              React A11y
            </a>
            ,{" "}
            <a href="https://example.com/vue-a11y" target="_blank" rel="noopener">
              Vue A11y
            </a>
            , and{" "}
            <a href="https://example.com/angular-a11y" target="_blank" rel="noopener">
              Angular A11y
            </a>
            .
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Multiple links opening new windows, none indicate new-window behavior.
          </p>
        </div>

        {/* ERROR: aria-label doesn't mention new window */}
        <div>
          <a
            href="https://example.com/blog"
            target="_blank"
            aria-label="Read our blog"
            rel="noopener"
          >
            Blog
          </a>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Has <code>aria-label</code> but it doesn't warn about opening in a new window.
          </p>
        </div>

        {/* CORRECT: New window link with proper warning */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <a
            href="https://example.com/guide"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WCAG Guidelines (opens in a new window)"
          >
            WCAG Guidelines
            <span className="text-xs ml-1" aria-hidden="true">
              ↗
            </span>
          </a>
          <p className="text-sm text-gray-600 mt-1">
            ✓ Has <code>rel="noopener noreferrer"</code>, <code>aria-label</code> mentions new
            window, and visual indicator (↗).
          </p>
        </div>

        {/* CORRECT: Alternative with sr-only text */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <a href="https://example.com/tools" target="_blank" rel="noopener noreferrer">
            Accessibility Tools
            <span className="sr-only"> (opens in a new window)</span>
            <span className="text-xs ml-1" aria-hidden="true">
              ↗
            </span>
          </a>
          <p className="text-sm text-gray-600 mt-1">
            ✓ Uses sr-only text to warn screen reader users, plus visible icon.
          </p>
        </div>
      </div>
    </div>
  );
}
