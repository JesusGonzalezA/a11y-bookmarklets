export default function ColorContrastTest() {
  return (
    <div>
      <h2>Blog Article</h2>

      <div className="space-y-6 my-4">
        {/* ERROR: Light gray text on white background — fails AA for normal text */}
        <div className="p-4 rounded" style={{ backgroundColor: "#ffffff" }}>
          <h3 style={{ color: "#999999" }}>Section Title (low contrast)</h3>
          <p style={{ color: "#aaaaaa" }}>
            This paragraph uses light gray (#aaaaaa) text on white background. The contrast ratio is
            approximately 2.3:1, far below the 4.5:1 requirement for WCAG AA normal text.
          </p>
          <p className="text-sm mt-2" style={{ color: "#666666" }}>
            ↑ Contrast ratios: #999 on #fff = 2.8:1, #aaa on #fff = 2.3:1 — both fail AA.
          </p>
        </div>

        {/* ERROR: Small text with insufficient contrast */}
        <div className="p-4 rounded" style={{ backgroundColor: "#f0f0f0" }}>
          <p style={{ color: "#888888", fontSize: "14px" }}>
            Small text (14px) with color #888 on background #f0f0f0. Contrast ratio ~2.7:1. Needs at
            least 4.5:1 for normal size text.
          </p>
        </div>

        {/* ERROR: Large text with insufficient contrast (needs 3:1 minimum) */}
        <div className="p-4 rounded" style={{ backgroundColor: "#ffffff" }}>
          <h3 style={{ color: "#bbbbbb", fontSize: "24px", fontWeight: "bold" }}>
            Large Bold Heading (still fails)
          </h3>
          <p className="text-sm" style={{ color: "#666666" }}>
            ↑ Even large text (24px bold) with #bbb on white only has ~1.9:1 ratio. Large text needs
            at least 3:1.
          </p>
        </div>

        {/* ERROR: Colored text on similar colored background */}
        <div className="p-4 rounded" style={{ backgroundColor: "#e8f4fd" }}>
          <p style={{ color: "#89b4d4" }}>
            Blue text (#89b4d4) on light blue background (#e8f4fd). Looks themed but the contrast is
            very poor — approximately 2.1:1.
          </p>
        </div>

        {/* ERROR: Placeholder text with very low contrast */}
        <div className="p-4 rounded" style={{ backgroundColor: "#ffffff" }}>
          <label htmlFor="cc-search" style={{ color: "#333333" }} className="block mb-1">
            Search
          </label>
          <input
            id="cc-search"
            type="text"
            placeholder="Type to search..."
            className="w-full border px-3 py-2 rounded"
            style={{ color: "#333", backgroundColor: "#fff" }}
          />
          <p className="text-sm mt-1" style={{ color: "#666" }}>
            ↑ The label has adequate contrast, but placeholder text is often styled with very low
            contrast by browsers (~3.7:1 sometimes, lower in some themes).
          </p>
        </div>

        {/* ERROR: Link text that doesn't contrast with surrounding text */}
        <div className="p-4 rounded" style={{ backgroundColor: "#ffffff" }}>
          <p style={{ color: "#333333" }}>
            Read our guide on{" "}
            <a href="#cc-link" style={{ color: "#444444", textDecoration: "none" }}>
              color accessibility
            </a>{" "}
            to learn more about proper contrast.
          </p>
          <p className="text-sm mt-1" style={{ color: "#666" }}>
            ↑ Link (#444) barely differs from surrounding text (#333) and has no underline — hard to
            identify as a link.
          </p>
        </div>

        {/* CORRECT: Proper contrast */}
        <div className="p-4 rounded border border-green-200" style={{ backgroundColor: "#ffffff" }}>
          <h3 style={{ color: "#1a1a1a" }}>Correct Example</h3>
          <p style={{ color: "#333333" }}>
            This text (#333) on white has a contrast ratio of ~12.6:1 — well above AA requirements.
          </p>
          <a href="#cc-correct" style={{ color: "#0055cc" }} className="underline">
            Properly contrasted link
          </a>
          <p className="text-sm mt-2" style={{ color: "#555555" }}>
            ✓ All text meets WCAG AA contrast requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
