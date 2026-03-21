export default function CaptionsTest() {
  return (
    <div>
      <h2>Video Course Library</h2>

      {/* ERROR: Video without any captions track */}
      <div className="my-4">
        <h3>Lesson 1: Introduction</h3>
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
          This video has no <code>&lt;track kind="captions"&gt;</code> element. Deaf and
          hard-of-hearing users cannot follow the dialogue.
        </p>
      </div>

      {/* ERROR: Track present but missing srclang */}
      <div className="my-4">
        <h3>Lesson 2: Getting Started</h3>
        <video
          width={480}
          height={270}
          controls
          src=""
          style={{ backgroundColor: "#000", display: "block" }}
        >
          <track kind="captions" src="/captions/lesson2.vtt" />
          <p>Your browser does not support the video element.</p>
        </video>
        <p className="text-sm text-gray-600 mt-1">
          The captions track exists but is missing the <code>srclang</code> attribute.
        </p>
      </div>

      {/* ERROR: Track has subtitles instead of captions */}
      <div className="my-4">
        <h3>Lesson 3: Advanced Topics</h3>
        <video
          width={480}
          height={270}
          controls
          src=""
          style={{ backgroundColor: "#000", display: "block" }}
        >
          <track kind="subtitles" src="/captions/lesson3.vtt" srcLang="en" label="English" />
          <p>Your browser does not support the video element.</p>
        </video>
        <p className="text-sm text-gray-600 mt-1">
          Uses <code>kind="subtitles"</code> instead of <code>kind="captions"</code> — subtitles
          don't include non-dialogue audio cues.
        </p>
      </div>

      {/* ERROR: Embedded video (iframe) without captions indicator */}
      <div className="my-4">
        <h3>Guest Lecture</h3>
        <div
          style={{
            width: 480,
            height: 270,
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
            border: "1px solid #333",
            borderRadius: "0.5rem",
          }}
        >
          <p>[Embedded video player — no caption controls visible]</p>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Embedded third-party video with no indication of caption availability.
        </p>
      </div>

      {/* CORRECT: Video with proper captions */}
      <div className="my-4">
        <h3>Correct Example</h3>
        <video
          width={480}
          height={270}
          controls
          src=""
          style={{ backgroundColor: "#000", display: "block" }}
        >
          <track kind="captions" src="/captions/correct.vtt" srcLang="en" label="English" default />
          <track kind="captions" src="/captions/correct-es.vtt" srcLang="es" label="Español" />
          <p>Your browser does not support the video element.</p>
        </video>
        <p className="text-sm text-gray-600 mt-1">
          Proper captions with <code>kind="captions"</code>, <code>srclang</code>,{" "}
          <code>label</code>, and a default track.
        </p>
      </div>
    </div>
  );
}
