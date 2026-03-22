export default function PrintStylesTest() {
  return (
    <div>
      <h2>Print Styles Test Page</h2>

      <style>{`
        @media print {
          .print-hide { display: none !important; }
          .print-show { display: block !important; }
          .print-expand-link::after { content: " (" attr(href) ")"; font-size: 0.85em; color: #555; }
        }
      `}</style>

      <div className="space-y-6 my-4">
        {/* ERROR: Nav visible in print */}
        <div>
          <h3>Navigation (Visible in Print)</h3>
          <nav aria-label="Main navigation" className="flex gap-4 p-2 bg-gray-100 rounded">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Navigation element without <code>print-hide</code> class — will appear in printed
            output and waste paper. Interactive links are useless on paper.
          </p>
        </div>

        {/* ERROR: Background image without text alternative */}
        <div>
          <h3>Background Image</h3>
          <div
            className="rounded"
            style={{
              backgroundImage: "url('/hero-banner.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              textShadow: "0 1px 4px rgba(0,0,0,0.7)",
            }}
          >
            <p className="text-xl font-bold">Promotional Banner</p>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Background image applied via CSS — will likely disappear in print, losing visual
            context. No text alternative describes the image.
          </p>
        </div>

        {/* ERROR: Links without visible URL in print */}
        <div>
          <h3>Links Without Expanded URL</h3>
          <p>
            Read more on <a href="https://www.w3.org/WAI/">the WAI website</a> and{" "}
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media">MDN docs</a>.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ↑ These links do not use the <code>print-expand-link</code> class, so the URL won't
            appear when printed. Readers can't follow the link on paper.
          </p>
        </div>

        {/* Section hidden on screen, shown in print */}
        <div>
          <h3>Print-Only Content</h3>
          <div className="print-show hidden p-3 border rounded bg-yellow-50">
            <p>This paragraph is only visible when printing (display: none on screen).</p>
          </div>
          <p className="text-sm text-gray-600">
            ↑ A <code>.print-show</code> block that is hidden on screen but becomes visible when
            printed. Useful for print-specific instructions.
          </p>
        </div>

        {/* CORRECT: Properly print-styled section */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <h3>Correct Example — Print-Ready Section</h3>
          <p>This article body has clean text content that renders well in print.</p>
          <p>
            Learn more at{" "}
            <a href="https://www.w3.org/WAI/WCAG21/quickref/" className="print-expand-link">
              WCAG Quick Reference
            </a>
            .
          </p>
          <nav className="print-hide mt-3 flex gap-2" aria-label="Print-hidden nav">
            <button type="button" className="px-3 py-1 bg-gray-200 rounded">
              Share
            </button>
            <button type="button" className="px-3 py-1 bg-gray-200 rounded">
              Bookmark
            </button>
          </nav>
          <p className="text-sm text-gray-600 mt-2">
            ✓ Navigation hidden in print, link URL expanded, clean text content.
          </p>
        </div>
      </div>
    </div>
  );
}
