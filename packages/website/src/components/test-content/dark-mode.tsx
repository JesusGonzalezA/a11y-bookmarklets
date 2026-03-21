export default function DarkModeTest() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .dm-hero { background: #1a1a2e; color: #e0e0e0; padding: 2rem; border-radius: 0.5rem; }
            .dm-hero h2 { color: #ffffff; }
            .dm-card { background: #ffffff; color: #333333; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #ddd; }
            .dm-card-dark { background: #16213e; color: #e0e0e0; padding: 1.5rem; border-radius: 0.5rem; }
            .dm-btn { background: #e94560; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.25rem; cursor: pointer; }
            .dm-badge { background: #0f3460; color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.875rem; display: inline-block; }
            /* No @media (prefers-color-scheme) rules at all — ERROR */
            /* No color-scheme CSS property — ERROR */
          `,
        }}
      />

      {/* ERROR: Hard-coded dark colors, no prefers-color-scheme adaptation */}
      <div className="dm-hero">
        <h2>Welcome to DarkApp</h2>
        <p>
          This hero section uses hard-coded dark colors. It will look the same regardless of the
          user's system color scheme preference.
        </p>
        <button type="button" className="dm-btn" style={{ marginTop: "1rem" }}>
          Get Started
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 my-6">
        {/* ERROR: Hard-coded light card — no dark mode variant */}
        <div className="dm-card">
          <h3>Light Card</h3>
          <p>This card has hard-coded light colors with no dark mode support.</p>
          <span className="dm-badge">New</span>
        </div>

        {/* ERROR: Hard-coded dark card — no light mode variant */}
        <div className="dm-card-dark">
          <h3>Dark Card</h3>
          <p>This card uses hard-coded dark colors. No adaptation for light mode users.</p>
          <span className="dm-badge">Featured</span>
        </div>
      </div>

      {/* ERROR: Inline styles — impossible to override via media query */}
      <div
        style={{
          backgroundColor: "#2d2d2d",
          color: "#f5f5f5",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <h3>Inline Styled Section</h3>
        <p>
          This section uses inline styles for colors. These cannot be overridden by a
          prefers-color-scheme media query in a stylesheet.
        </p>
      </div>

      {/* ERROR: No color-scheme meta tag in the document */}
      <div className="my-4 p-4 border rounded bg-gray-50 text-gray-800">
        <h3>System UI Elements</h3>
        <p>
          Without a <code>color-scheme</code> CSS property or{" "}
          <code>&lt;meta name="color-scheme"&gt;</code>
          tag, form controls and scrollbars won't adapt to the user's preference.
        </p>
        <input type="text" placeholder="Text input" className="border px-2 py-1 rounded mt-2" />
        <select className="border px-2 py-1 rounded mt-2 ml-2">
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
      </div>
    </>
  );
}
