export default function CognitiveLoadTest() {
  return (
    <div>
      <h2>Busy Marketing Landing Page</h2>

      <div className="space-y-6 my-4">
        {/* ERROR: Infinite CSS animations */}
        <div>
          <h3>Animated Elements</h3>
          <style>{`
            @keyframes cl-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
            @keyframes cl-blink { 0%, 100% { background-color: #fef3c7; } 50% { background-color: #fca5a5; } }
            .cl-pulse-anim { animation: cl-pulse 2s infinite; }
            .cl-blink-anim { animation: cl-blink 0.5s infinite; }
          `}</style>
          <div className="flex gap-4">
            <div className="cl-pulse-anim p-4 border rounded bg-blue-50">
              <p>
                <strong>Pulsing element</strong> — infinite animation that never stops.
              </p>
            </div>
            <div className="cl-blink-anim p-4 border rounded">
              <p>
                <strong>Blinking element</strong> — rapid infinite animation (0.5s cycle).
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Two infinite CSS animations with no pause mechanism. Adds cognitive burden and may
            trigger WCAG 2.2.2 violations.
          </p>
        </div>

        {/* ERROR: Autoplay media */}
        <div>
          <h3>Autoplay Media</h3>
          {/* biome-ignore lint/a11y/useMediaCaption: intentional for testing */}
          <video
            autoPlay
            className="rounded border"
            style={{ width: 320, height: 180, background: "#000" }}
          >
            <source src="promo.mp4" type="video/mp4" />
          </video>
          {/* biome-ignore lint/a11y/useMediaCaption: intentional for testing */}
          <audio autoPlay>
            <source src="background-music.mp3" type="audio/mpeg" />
          </audio>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Video and audio set to autoplay without muted attribute. Screen reader users may
            struggle to hear their assistive technology over the media.
          </p>
        </div>

        {/* ERROR: Modal/popup visible on load */}
        <div>
          <h3>Popup Overlays</h3>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Newsletter signup"
            className="p-4 border-2 border-purple-300 bg-purple-50 rounded"
          >
            <p className="font-semibold">🎉 Subscribe to our newsletter!</p>
            <p className="text-sm mt-1">Get 10% off your first order.</p>
            <div className="flex gap-2 mt-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="border px-2 py-1 rounded flex-1"
              />
              <button type="button" className="px-3 py-1 bg-purple-600 text-white rounded">
                Subscribe
              </button>
            </div>
            <button type="button" className="mt-2 text-sm text-gray-500 underline">
              No thanks
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Modal dialog visible on page load, competing for attention with page content.
          </p>
        </div>

        {/* ERROR: Auto-rotating carousel */}
        <div>
          <h3>Auto-rotating Carousel</h3>
          <div
            className="carousel p-4 border rounded relative overflow-hidden"
            data-autoplay=""
            data-interval="3000"
          >
            <div className="flex gap-4">
              <div className="min-w-full p-6 bg-blue-50 rounded">
                <h4>Slide 1: Amazing Product</h4>
                <p>Discover our latest innovation.</p>
              </div>
              <div className="min-w-full p-6 bg-green-50 rounded">
                <h4>Slide 2: Special Offer</h4>
                <p>Limited time deal — act now!</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Auto-rotating carousel with <code>data-autoplay</code> — no pause, stop, or skip
            controls.
          </p>
        </div>

        {/* ERROR: Too many competing CTAs above the fold */}
        <div>
          <h3>Competing Calls-to-Action</h3>
          <div className="flex gap-2 flex-wrap">
            <a
              href="#buy"
              className="inline-block px-6 py-3 rounded text-white"
              style={{ backgroundColor: "#e74c3c" }}
            >
              Buy Now
            </a>
            <a
              href="#subscribe"
              className="inline-block px-6 py-3 rounded text-white"
              style={{ backgroundColor: "#3498db" }}
            >
              Subscribe
            </a>
            <a
              href="#trial"
              className="inline-block px-6 py-3 rounded text-white"
              style={{ backgroundColor: "#2ecc71" }}
            >
              Free Trial
            </a>
            <a
              href="#download"
              className="inline-block px-6 py-3 rounded text-white"
              style={{ backgroundColor: "#9b59b6" }}
            >
              Download App
            </a>
            <a
              href="#learn"
              className="inline-block px-6 py-3 rounded text-white"
              style={{ backgroundColor: "#e67e22" }}
            >
              Learn More
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Five competing prominent CTAs — users don't know which action to take first.
          </p>
        </div>

        {/* CORRECT: Low cognitive load section */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <h3>Correct Example — Clean Layout</h3>
          <p>
            This section has simple static content with no animations, no autoplay, and a single
            clear call-to-action.
          </p>
          <button
            type="button"
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Get Started
          </button>
          <p className="text-sm text-gray-600 mt-2">
            ✓ One clear CTA, no moving content, focused message.
          </p>
        </div>
      </div>
    </div>
  );
}
