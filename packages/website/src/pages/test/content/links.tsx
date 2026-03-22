export default function LinksTest() {
  return (
    <div>
      <h2>Resource Directory</h2>

      <div className="space-y-6 my-4">
        {/* ERROR: Empty link — no text or aria-label */}
        <div>
          <a href="https://example.com/docs"></a>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Empty link — no text content, no aria-label. Announced as just "link" by screen
            readers.
          </p>
        </div>

        {/* ERROR: Link with generic text */}
        <div>
          <p>
            We have an amazing accessibility guide.{" "}
            <a href="https://example.com/guide">Click here</a> to read it.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Generic text "Click here" — provides no context when read out of context.
          </p>
        </div>

        {/* ERROR: Another generic link */}
        <div>
          <p>
            Learn about WCAG 2.2 guidelines. <a href="https://example.com/wcag">Read more</a>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ↑ "Read more" — screen reader users navigating by links won't know what "more" refers
            to.
          </p>
        </div>

        {/* ERROR: Faux link with href="#" */}
        <div>
          <a href="#">Show details</a>
          <p className="text-sm text-gray-600 mt-1">
            ↑ <code>href="#"</code> — navigates to top of page instead of performing the expected
            action. Should be a button.
          </p>
        </div>

        {/* ERROR: JavaScript void link */}
        <div>
          <a href="javascript:void(0)" onClick={() => {}}>
            Toggle menu
          </a>
          <p className="text-sm text-gray-600 mt-1">
            ↑ <code>href="javascript:void(0)"</code> — not a real destination. Should be a button.
          </p>
        </div>

        {/* ERROR: Link wrapping only an image with no alt */}
        <div>
          <a href="https://example.com/home">
            <img src="https://picsum.photos/seed/logo/100/40" width={100} height={40} />
          </a>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Link containing only an image without alt text — link has no accessible name.
          </p>
        </div>

        {/* CORRECT: Descriptive link */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <p>
            Read the{" "}
            <a href="https://example.com/guide" className="text-blue-600 underline">
              Web Content Accessibility Guidelines (WCAG) 2.2
            </a>{" "}
            for full compliance details.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ✓ Descriptive link text that makes sense out of context.
          </p>
        </div>
      </div>
    </div>
  );
}
