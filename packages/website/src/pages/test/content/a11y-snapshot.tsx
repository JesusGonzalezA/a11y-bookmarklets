export default function A11ySnapshotTest() {
  return (
    <div>
      <h2>Complete Page for Snapshot Analysis</h2>

      <div className="space-y-6 my-4">
        {/* Section: Headings */}
        <section>
          <h3>Article Section</h3>
          <p>
            This page includes a variety of elements to produce a comprehensive accessibility
            snapshot. The bookmarklet collects headings, landmarks, images, forms, links, buttons,
            live regions, ARIA roles, media, and meta tags.
          </p>
          <h4>Subsection</h4>
          <p>Content within a subsection to create heading hierarchy data.</p>
        </section>

        {/* Section: Images — mix of correct and missing alt */}
        <section>
          <h3>Images</h3>
          <div className="flex gap-4 flex-wrap">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' fill='%23ddd'%3E%3Crect width='120' height='80'/%3E%3C/svg%3E"
              alt="Placeholder with alt text"
              className="rounded border"
            />
            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt -- intentional for testing */}
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' fill='%23ccc'%3E%3Crect width='120' height='80'/%3E%3C/svg%3E"
              alt=""
              role="presentation"
              className="rounded border"
            />
            {/* biome-ignore lint/a11y/useAltText: intentional missing alt for testing */}
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' fill='%23bbb'%3E%3Crect width='120' height='80'/%3E%3C/svg%3E"
              className="rounded border"
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Three images: one with alt, one decorative (<code>alt=""</code>), one missing alt
            entirely.
          </p>
        </section>

        {/* Section: Form controls */}
        <section>
          <h3>Contact Form</h3>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
            <div>
              <label htmlFor="snap-name">Name</label>
              <input
                id="snap-name"
                type="text"
                autoComplete="name"
                className="ml-2 border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label htmlFor="snap-email">Email</label>
              <input
                id="snap-email"
                type="email"
                autoComplete="email"
                className="ml-2 border px-2 py-1 rounded"
              />
            </div>
            {/* Input without label — snapshot should capture this */}
            <div>
              <input
                type="text"
                placeholder="Message (no label)"
                className="border px-2 py-1 rounded w-full"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Send
            </button>
          </form>
        </section>

        {/* Section: Links and buttons */}
        <section>
          <h3>Navigation</h3>
          <div className="flex gap-3 flex-wrap">
            <a href="#snapshot-section">Internal link</a>
            <a href="https://example.com" target="_blank" rel="noopener noreferrer">
              External link (new tab)
            </a>
            {/* biome-ignore lint/a11y/useValidAnchor: intentional for testing */}
            <a href="#">Empty href link</a>
            <button type="button" aria-label="Close dialog" className="px-3 py-1 border rounded">
              ✕
            </button>
            <div role="button" tabIndex={0} className="px-3 py-1 bg-gray-100 rounded cursor-pointer">
              Faux button
            </div>
          </div>
        </section>

        {/* Section: Live regions and ARIA */}
        <section>
          <h3>Dynamic Content</h3>
          <div role="alert" aria-live="assertive" className="p-2 bg-red-50 text-red-800 rounded">
            Error: connection timeout
          </div>
          <div role="status" aria-live="polite" className="mt-2 p-2 bg-blue-50 text-blue-800 rounded">
            Ready
          </div>
        </section>

        {/* Section: Media */}
        <section>
          <h3>Media Elements</h3>
          {/* biome-ignore lint/a11y/useMediaCaption: intentional for testing */}
          <video
            controls
            className="rounded border"
            style={{ width: 320, height: 180, background: "#000" }}
          >
            <track kind="captions" srcLang="en" label="English" />
          </video>
          {/* biome-ignore lint/a11y/useMediaCaption: intentional for testing */}
          <audio className="mt-2 block">
            <source src="audio.mp3" type="audio/mpeg" />
          </audio>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Video with controls and caption track, audio without controls.
          </p>
        </section>

        {/* Section: Hidden content */}
        <section>
          <h3>Hidden Elements</h3>
          <div aria-hidden="true" className="p-2 bg-gray-100 rounded">
            <p>This content is hidden from assistive technologies.</p>
          </div>
          <div style={{ display: "none" }}>
            <p>Completely hidden content.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
