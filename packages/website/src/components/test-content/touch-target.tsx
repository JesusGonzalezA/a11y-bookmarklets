export default function TouchTargetTest() {
  return (
    <div>
      <h2>Mobile-Friendly Interface</h2>

      <div className="space-y-6 my-4">
        {/* ERROR: Tiny buttons (16×16) — fails WCAG 2.5.8 (24×24 minimum) */}
        <div>
          <h3>Action Buttons</h3>
          <div className="flex gap-1">
            <button
              type="button"
              style={{ width: 16, height: 16, padding: 0, fontSize: 10 }}
              className="border rounded flex items-center justify-center bg-gray-100"
            >
              ×
            </button>
            <button
              type="button"
              style={{ width: 16, height: 16, padding: 0, fontSize: 10 }}
              className="border rounded flex items-center justify-center bg-gray-100"
            >
              +
            </button>
            <button
              type="button"
              style={{ width: 16, height: 16, padding: 0, fontSize: 10 }}
              className="border rounded flex items-center justify-center bg-gray-100"
            >
              −
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ 16×16px buttons — far below the 24×24px minimum (WCAG 2.5.8) and the recommended
            44×44px (WCAG 2.5.5).
          </p>
        </div>

        {/* ERROR: Close-together links with small tap area */}
        <div>
          <h3>Tag Cloud</h3>
          <div className="flex flex-wrap gap-0.5">
            {["react", "vue", "angular", "svelte", "solid", "preact", "lit", "alpine"].map(
              (tag) => (
                <a
                  key={tag}
                  href={`#tag-${tag}`}
                  style={{ fontSize: 11, padding: "1px 4px" }}
                  className="text-blue-600 underline"
                >
                  {tag}
                </a>
              ),
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Dense tag cloud with tiny touch targets (under 24px) and only 2px spacing between
            them. Easy to tap the wrong link on mobile.
          </p>
        </div>

        {/* ERROR: Inline links with small target size */}
        <div>
          <h3>Footer Links</h3>
          <p style={{ fontSize: 11, lineHeight: 1.2 }}>
            <a href="#tt-terms" className="text-blue-600 underline">
              Terms
            </a>{" "}
            |{" "}
            <a href="#tt-privacy" className="text-blue-600 underline">
              Privacy
            </a>{" "}
            |{" "}
            <a href="#tt-cookies" className="text-blue-600 underline">
              Cookies
            </a>{" "}
            |{" "}
            <a href="#tt-sitemap" className="text-blue-600 underline">
              Sitemap
            </a>{" "}
            |{" "}
            <a href="#tt-contact" className="text-blue-600 underline">
              Contact
            </a>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Small inline links (11px font, tight line-height) — touch targets well below 24px
            height.
          </p>
        </div>

        {/* ERROR: Icon buttons that are too small */}
        <div>
          <h3>Social Media Icons</h3>
          <div className="flex gap-1">
            {["📘", "🐦", "📷", "💼", "🎵"].map((icon, i) => (
              <a
                key={i}
                href={`#social-${i}`}
                style={{ width: 20, height: 20, fontSize: 12 }}
                className="flex items-center justify-center border rounded"
              >
                {icon}
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ 20×20px social media icon links — below the 24×24 minimum.
          </p>
        </div>

        {/* ERROR: Checkbox with small touch target */}
        <div>
          <h3>Newsletter Opt-in</h3>
          <div className="flex items-center gap-1">
            <input type="checkbox" id="tt-newsletter" style={{ width: 12, height: 12 }} />
            <label htmlFor="tt-newsletter" style={{ fontSize: 11 }}>
              Subscribe to our newsletter
            </label>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ 12×12px checkbox — the label helps but the actual control is tiny.
          </p>
        </div>

        {/* CORRECT: Proper touch target sizes */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <h3>Correct Example</h3>
          <div className="flex gap-3">
            <button
              type="button"
              style={{ minWidth: 44, minHeight: 44 }}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Submit
            </button>
            <a
              href="#tt-correct"
              style={{ minWidth: 44, minHeight: 44 }}
              className="flex items-center justify-center px-4 py-2 border rounded text-blue-600"
            >
              Details
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ✓ Minimum 44×44px touch targets — meets WCAG 2.5.5 (AAA) recommendation.
          </p>
        </div>
      </div>
    </div>
  );
}
