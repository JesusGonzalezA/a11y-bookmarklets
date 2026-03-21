export default function InvertedColorsTest() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* No @media (inverted-colors: inverted) rules — ERROR */
            .ic-photo-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
            .ic-icon-box { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border: 1px solid #ddd; border-radius: 0.5rem; }
          `,
        }}
      />

      <h2>Media Gallery</h2>

      {/* ERROR: Images without inversion compensation */}
      <div className="ic-photo-grid my-4">
        <div>
          <img
            src="https://picsum.photos/seed/invert1/300/200"
            alt="Mountain landscape at sunset"
            width={300}
            height={200}
            className="rounded"
          />
          <p className="text-sm mt-1 text-gray-600">No inversion compensation for this image.</p>
        </div>
        <div>
          <img
            src="https://picsum.photos/seed/invert2/300/200"
            alt="City skyline at night"
            width={300}
            height={200}
            className="rounded"
          />
          <p className="text-sm mt-1 text-gray-600">Colors will be inverted incorrectly.</p>
        </div>
      </div>

      {/* ERROR: SVGs with inline colors — will be affected by color inversion */}
      <div className="my-4">
        <h3>Status Icons</h3>
        <div className="flex gap-4 my-2">
          <div className="ic-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#22c55e" />
              <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Success</span>
          </div>
          <div className="ic-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#ef4444" />
              <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Error</span>
          </div>
          <div className="ic-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#f59e0b" />
              <path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Warning</span>
          </div>
        </div>
      </div>

      {/* ERROR: Background images that will be inverted */}
      <div
        className="my-4 p-6 rounded text-white"
        style={{
          backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <h3>Gradient Background</h3>
        <p>
          This section uses a CSS gradient background that will become unreadable when colors are
          inverted.
        </p>
      </div>

      {/* ERROR: Canvas-like element with color-dependent content */}
      <div className="my-4">
        <h3>Data Visualization</h3>
        <div className="flex gap-2 items-end h-32">
          {[60, 80, 45, 90, 70].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%`, backgroundColor: `hsl(${i * 50}, 70%, 50%)` }}
              className="w-12 rounded-t"
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Chart bars use color to convey data — inversion will break the visual meaning.
        </p>
      </div>
    </>
  );
}
