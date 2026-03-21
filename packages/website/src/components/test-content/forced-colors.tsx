export default function ForcedColorsTest() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* No @media (forced-colors: active) rules — ERROR */
            /* No @media (prefers-contrast: more) rules — ERROR */
            .fc-status-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
            .fc-status-green { background-color: #22c55e; }
            .fc-status-red { background-color: #ef4444; }
            .fc-status-yellow { background-color: #f59e0b; }
            .fc-custom-focus:focus { outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); }
          `,
        }}
      />

      <h2>System Dashboard</h2>

      {/* ERROR: Status indicators using only custom background colors */}
      <div className="my-4">
        <h3>Server Status</h3>
        <ul className="space-y-2 my-2">
          <li className="flex items-center gap-2">
            <span className="fc-status-dot fc-status-green" />
            Web Server — Online
          </li>
          <li className="flex items-center gap-2">
            <span className="fc-status-dot fc-status-red" />
            Database — Offline
          </li>
          <li className="flex items-center gap-2">
            <span className="fc-status-dot fc-status-yellow" />
            Cache — Degraded
          </li>
        </ul>
        <p className="text-sm text-gray-600">
          These status dots rely on background-color which is overridden in forced-colors mode.
        </p>
      </div>

      {/* ERROR: Box-shadow used for visual state indication */}
      <div className="my-4">
        <h3>Selected Items</h3>
        <div className="flex gap-3">
          <div className="p-3 rounded border" style={{ boxShadow: "0 0 0 3px #3b82f6" }}>
            <p>Selected (box-shadow ring)</p>
          </div>
          <div className="p-3 rounded border">
            <p>Not selected</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Box-shadow is removed in forced-colors mode — selected state becomes invisible.
        </p>
      </div>

      {/* ERROR: Custom focus style using box-shadow instead of outline */}
      <div className="my-4">
        <h3>Form with Custom Focus</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Focus me"
            className="fc-custom-focus border px-3 py-2 rounded"
          />
          <button
            type="button"
            className="fc-custom-focus px-4 py-2 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Focus uses <code>outline: none</code> + <code>box-shadow</code> — invisible in
          forced-colors mode.
        </p>
      </div>

      {/* ERROR: Custom colors on borders that will be overridden */}
      <div className="my-4 grid grid-cols-3 gap-3">
        <div
          style={{
            borderLeft: "4px solid #22c55e",
            padding: "0.75rem",
            backgroundColor: "#f0fdf4",
          }}
        >
          <p className="font-semibold">Success</p>
          <p className="text-sm">Custom border color lost in forced-colors.</p>
        </div>
        <div
          style={{
            borderLeft: "4px solid #ef4444",
            padding: "0.75rem",
            backgroundColor: "#fef2f2",
          }}
        >
          <p className="font-semibold">Error</p>
          <p className="text-sm">Custom border color lost in forced-colors.</p>
        </div>
        <div
          style={{
            borderLeft: "4px solid #3b82f6",
            padding: "0.75rem",
            backgroundColor: "#eff6ff",
          }}
        >
          <p className="font-semibold">Info</p>
          <p className="text-sm">Custom border color lost in forced-colors.</p>
        </div>
      </div>

      {/* ERROR: Background-image for decorative purposes */}
      <div
        className="my-4 p-6 rounded"
        style={{
          backgroundImage: "linear-gradient(to right, #4f46e5, #7c3aed)",
          color: "white",
        }}
      >
        <h3>Gradient Banner</h3>
        <p>Background-image is removed in forced-colors mode, making this text unreadable.</p>
      </div>
    </>
  );
}
