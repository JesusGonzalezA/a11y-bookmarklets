export default function VideoControlsTest() {
  return (
    <div>
      <h2>Video Library</h2>

      {/* ERROR: Video without controls attribute */}
      <div className="my-4">
        <h3>Featured Presentation</h3>
        <video
          width={480}
          height={270}
          src=""
          style={{ backgroundColor: "#000", display: "block" }}
        >
          <p>Your browser does not support the video element.</p>
        </video>
        <p className="text-sm text-gray-600 mt-1">
          This video has no <code>controls</code> attribute — users cannot play, pause, or seek.
        </p>
      </div>

      {/* ERROR: Custom player without ARIA roles */}
      <div className="my-4">
        <h3>Custom Video Player</h3>
        <div style={{ backgroundColor: "#000", width: 480, height: 270, position: "relative" }}>
          <video width={480} height={270} src="" style={{ display: "block" }}>
            <p>Your browser does not support the video element.</p>
          </video>
          {/* Custom controls without ARIA */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: "0.5rem",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            {/* ERROR: No role, no aria-label, no keyboard handler */}
            <div
              style={{ color: "white", cursor: "pointer", padding: "0.25rem 0.5rem" }}
              onClick={() => {}}
            >
              ▶
            </div>
            {/* ERROR: Progress bar without slider role */}
            <div
              style={{
                flex: 1,
                height: 4,
                backgroundColor: "#555",
                borderRadius: 2,
                cursor: "pointer",
              }}
              onClick={() => {}}
            >
              <div
                style={{
                  width: "30%",
                  height: "100%",
                  backgroundColor: "#3b82f6",
                  borderRadius: 2,
                }}
              />
            </div>
            {/* ERROR: Volume without proper role */}
            <div
              style={{ color: "white", cursor: "pointer", padding: "0.25rem 0.5rem" }}
              onClick={() => {}}
            >
              🔊
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Custom controls lack ARIA roles, labels, and keyboard support.
        </p>
      </div>

      {/* CORRECT: Video with native controls */}
      <div className="my-4">
        <h3>Correct Example</h3>
        <video
          width={480}
          height={270}
          controls
          src=""
          style={{ backgroundColor: "#000", display: "block" }}
        >
          <p>Your browser does not support the video element.</p>
        </video>
        <p className="text-sm text-gray-600 mt-1">
          This video has the native <code>controls</code> attribute.
        </p>
      </div>
    </div>
  );
}
