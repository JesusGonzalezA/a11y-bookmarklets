export default function AutoplayTest() {
  return (
    <div>
      <h2>Media Hub</h2>

      {/* ERROR: Autoplay video that is not muted — will play audio automatically */}
      <div className="my-4">
        <h3>Hero Video</h3>
        <video
          width={480}
          height={270}
          autoPlay
          src=""
          style={{ backgroundColor: "#000", display: "block" }}
        >
          <p>Your browser does not support the video element.</p>
        </video>
        <p className="text-sm text-gray-600 mt-1">
          Autoplay enabled, <strong>not muted</strong> — audio plays immediately without user
          consent.
        </p>
      </div>

      {/* ERROR: Autoplay without any pause/stop control */}
      <div className="my-4">
        <h3>Background Promo</h3>
        <video
          width={480}
          height={270}
          autoPlay
          loop
          src=""
          style={{ backgroundColor: "#1a1a2e", display: "block" }}
        >
          <p>Your browser does not support the video element.</p>
        </video>
        <p className="text-sm text-gray-600 mt-1">
          Autoplay + loop, no controls to pause. The video plays indefinitely.
        </p>
      </div>

      {/* ERROR: Audio element with autoplay */}
      <div className="my-4">
        <h3>Background Music</h3>
        <audio autoPlay loop src="">
          Your browser does not support the audio element.
        </audio>
        <p className="text-sm text-gray-600">
          Audio element with <code>autoplay</code> and <code>loop</code> — plays sound immediately
          with no visible controls.
        </p>
      </div>

      {/* CORRECT: Autoplay but muted, with controls */}
      <div className="my-4">
        <h3>Correct Example — Muted Autoplay</h3>
        <video
          width={480}
          height={270}
          autoPlay
          muted
          controls
          src=""
          style={{ backgroundColor: "#000", display: "block" }}
        >
          <p>Your browser does not support the video element.</p>
        </video>
        <p className="text-sm text-gray-600 mt-1">
          Autoplay is muted and controls are available for user interaction.
        </p>
      </div>
    </div>
  );
}
