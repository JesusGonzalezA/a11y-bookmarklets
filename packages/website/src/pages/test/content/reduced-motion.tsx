export default function ReducedMotionTest() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* ERROR: Animation with no prefers-reduced-motion fallback */
            @keyframes rm-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes rm-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            @keyframes rm-slide { from { transform: translateX(-100%); } to { transform: translateX(0); } }
            @keyframes rm-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }

            .rm-spinner { width: 40px; height: 40px; border: 4px solid #ccc; border-top-color: #3b82f6; border-radius: 50%; animation: rm-spin 1s linear infinite; display: inline-block; }
            .rm-pulse-dot { width: 12px; height: 12px; background: #ef4444; border-radius: 50%; animation: rm-pulse 1.5s ease-in-out infinite; display: inline-block; }
            .rm-slide-in { animation: rm-slide 0.5s ease-out; }
            .rm-bounce-box { animation: rm-bounce 2s ease infinite; display: inline-block; }

            /* ERROR: Hover transition with no reduced-motion fallback */
            .rm-hover-card { transition: transform 0.3s ease, box-shadow 0.3s ease; padding: 1.5rem; border: 1px solid #ddd; border-radius: 0.5rem; }
            .rm-hover-card:hover { transform: scale(1.05); box-shadow: 0 10px 30px rgba(0,0,0,0.15); }

            /* CORRECT: Animation with proper prefers-reduced-motion fallback */
            .rm-correct-slide { animation: rm-slide 0.5s ease-out; }
            @media (prefers-reduced-motion: reduce) {
              .rm-correct-slide { animation: none; }
            }
          `,
        }}
      />

      <h2>Animated Dashboard</h2>

      {/* ERROR: Continuously spinning loader with no reduced-motion fallback */}
      <div className="my-4">
        <h3>Loading Indicators</h3>
        <div className="flex items-center gap-4 my-2">
          <div className="rm-spinner" aria-label="Loading" />
          <span>Loading data...</span>
          <span className="rm-pulse-dot" />
          <span>Live indicator</span>
        </div>
      </div>

      {/* ERROR: Slide animation on load — no fallback */}
      <div className="rm-slide-in my-4 p-4 bg-blue-50 rounded border border-blue-200">
        <h3>Welcome Notification</h3>
        <p>This element slides in from the left when the page loads. No reduced-motion fallback.</p>
      </div>

      {/* ERROR: Continuous bounce animation — no fallback */}
      <div className="my-4">
        <h3>Call to Action</h3>
        <div className="rm-bounce-box">
          <button type="button" className="px-4 py-2 bg-green-600 text-white rounded font-semibold">
            ↓ Scroll Down ↓
          </button>
        </div>
      </div>

      {/* ERROR: Hover transition — no fallback */}
      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="rm-hover-card">
          <h3>Feature Card</h3>
          <p>
            Hover over this card to see a scale + shadow transition. No reduced-motion fallback.
          </p>
        </div>
        <div className="rm-hover-card">
          <h3>Another Card</h3>
          <p>Same transform transition on hover without respecting motion preferences.</p>
        </div>
      </div>

      {/* CORRECT: Animation with proper fallback */}
      <div className="rm-correct-slide my-4 p-4 bg-green-50 rounded border border-green-200">
        <h3>Correct Example</h3>
        <p>
          This element slides in but has a <code>@media (prefers-reduced-motion: reduce)</code> rule
          that disables the animation.
        </p>
      </div>
    </>
  );
}
