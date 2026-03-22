export default function AudioDescriptionTest() {
  return (
    <div>
      <h2>Documentary Series</h2>

      {/* ERROR: Video without audio description track */}
      <div className="my-4">
        <h3>Episode 1: The Visual Journey</h3>
        <video
          width={480}
          height={270}
          controls
          src=""
          style={{ backgroundColor: "#000", display: "block" }}
        >
          <track kind="captions" src="/captions/ep1.vtt" srcLang="en" label="English" />
          <p>Your browser does not support the video element.</p>
        </video>
        <p className="text-sm text-gray-600 mt-1">
          This video has captions but no <code>&lt;track kind="descriptions"&gt;</code> for audio
          descriptions. Visual-only content (charts, on-screen text, actions) is inaccessible to
          blind users.
        </p>
      </div>

      {/* ERROR: Video with visual-only information, no alternative */}
      <div className="my-4">
        <h3>Episode 2: Data Visualization</h3>
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
          Presentation video with charts and graphs. No audio descriptions and no alternative text
          link to a described version.
        </p>
      </div>

      {/* ERROR: Video with no tracks at all */}
      <div className="my-4">
        <h3>Episode 3: Behind the Scenes</h3>
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
          No captions, no audio descriptions — completely inaccessible for both deaf and blind
          users.
        </p>
      </div>

      {/* CORRECT: Video with audio description track */}
      <div className="my-4">
        <h3>Correct Example</h3>
        <video
          width={480}
          height={270}
          controls
          src=""
          style={{ backgroundColor: "#000", display: "block" }}
        >
          <track
            kind="captions"
            src="/captions/correct.vtt"
            srcLang="en"
            label="English captions"
          />
          <track
            kind="descriptions"
            src="/descriptions/correct.vtt"
            srcLang="en"
            label="English audio descriptions"
          />
          <p>Your browser does not support the video element.</p>
        </video>
        <p className="text-sm text-gray-600 mt-1">
          Includes both <code>kind="captions"</code> and <code>kind="descriptions"</code> tracks.
        </p>
        <p className="mt-2">
          <a href="#transcript">Read the full transcript with visual descriptions</a>
        </p>
      </div>
    </div>
  );
}
