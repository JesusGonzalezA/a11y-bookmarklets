export default function ReducedTransparencyTest() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* No @media (prefers-reduced-transparency: reduce) rules — ERROR */
            .rt-overlay { position: relative; padding: 2rem; border-radius: 0.5rem; }
            .rt-glass { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 1.5rem; border-radius: 0.5rem; }
          `,
        }}
      />

      <h2>Modern UI Components</h2>

      {/* ERROR: Semi-transparent overlay */}
      <div
        className="my-4 rt-overlay"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: "#fff" }}
      >
        <h3>Modal Overlay</h3>
        <p>
          This overlay uses <code>rgba(0, 0, 0, 0.5)</code> background. No reduced-transparency
          fallback.
        </p>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginTop: "0.5rem",
          }}
        >
          <p>Inner content with additional transparency layer.</p>
        </div>
      </div>

      {/* ERROR: Elements with opacity < 1 */}
      <div className="my-4">
        <h3>Disabled State (opacity)</h3>
        <div className="flex gap-4">
          <button
            type="button"
            style={{ opacity: 0.4 }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled
          >
            Disabled Button
          </button>
          <div style={{ opacity: 0.3 }} className="p-3 bg-gray-200 rounded">
            <p>Faded content with opacity: 0.3 — hard to read for some users.</p>
          </div>
        </div>
      </div>

      {/* ERROR: Glassmorphism effect with backdrop-filter */}
      <div
        className="my-4 p-6 rounded"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
        }}
      >
        <h3 className="text-white mb-3">Glassmorphism Card</h3>
        <div className="rt-glass">
          <p style={{ color: "#fff" }}>
            This card uses <code>backdrop-filter: blur()</code> and <code>rgba()</code> background
            for a glass effect. No solid fallback for reduced-transparency preference.
          </p>
        </div>
      </div>

      {/* ERROR: HSLA colors with transparency */}
      <div className="my-4 space-y-2">
        <h3>HSLA Color Badges</h3>
        <div className="flex gap-2 flex-wrap">
          <span
            style={{
              backgroundColor: "hsla(210, 80%, 50%, 0.3)",
              padding: "0.25rem 0.75rem",
              borderRadius: "1rem",
            }}
          >
            Info
          </span>
          <span
            style={{
              backgroundColor: "hsla(0, 80%, 50%, 0.3)",
              padding: "0.25rem 0.75rem",
              borderRadius: "1rem",
            }}
          >
            Danger
          </span>
          <span
            style={{
              backgroundColor: "hsla(120, 60%, 40%, 0.3)",
              padding: "0.25rem 0.75rem",
              borderRadius: "1rem",
            }}
          >
            Success
          </span>
        </div>
      </div>

      {/* ERROR: Transparent border used for subtle separation */}
      <div
        className="my-4 p-4 rounded"
        style={{
          border: "1px solid rgba(0, 0, 0, 0.1)",
          backgroundColor: "rgba(249, 250, 251, 0.5)",
        }}
      >
        <h3>Subtle Card</h3>
        <p>Semi-transparent border and background — may be invisible for some users.</p>
      </div>
    </>
  );
}
