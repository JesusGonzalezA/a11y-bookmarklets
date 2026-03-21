import { useEffect } from "react";

export default function ViewportZoomTest() {
  useEffect(() => {
    // Modify the existing viewport meta tag (querySelector only finds the first one)
    const existing = document.querySelector('meta[name="viewport"]');
    const originalContent = existing?.getAttribute("content") ?? null;

    if (existing) {
      existing.setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
      document.head.appendChild(meta);
    }

    return () => {
      if (existing && originalContent !== null) {
        existing.setAttribute("content", originalContent);
      } else if (!existing) {
        document.querySelector('meta[name="viewport"]')?.remove();
      }
    };
  }, []);

  return (
    <div>
      <h2>Mobile-First Web App</h2>

      <div className="my-4 p-4 bg-red-50 border border-red-200 rounded">
        <h3>⚠ Viewport Restrictions Active</h3>
        <p>This test page has injected a restrictive viewport meta tag:</p>
        <code className="block my-2 p-2 bg-white rounded text-sm font-mono">
          &lt;meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1,
          user-scalable=no"&gt;
        </code>
        <p className="text-sm text-gray-700">
          <strong>user-scalable=no</strong> prevents pinch-to-zoom.
          <br />
          <strong>maximum-scale=1</strong> limits zoom to 100%.
          <br />
          This violates WCAG 1.4.4 (Resize Text) — users who need to zoom cannot do so.
        </p>
      </div>

      {/* Simulated mobile app content */}
      <div className="my-4">
        <h3>App Navigation</h3>
        <div className="flex gap-2">
          <button type="button" className="px-3 py-2 bg-blue-600 text-white rounded text-sm">
            Home
          </button>
          <button type="button" className="px-3 py-2 bg-gray-200 rounded text-sm">
            Search
          </button>
          <button type="button" className="px-3 py-2 bg-gray-200 rounded text-sm">
            Profile
          </button>
        </div>
      </div>

      <div className="my-4">
        <h3>Small Text Content</h3>
        <p style={{ fontSize: "12px" }}>
          This text is only 12px. Combined with the zoom restriction, users with low vision cannot
          enlarge it. On mobile devices, this is a significant barrier.
        </p>
        <p style={{ fontSize: "10px", color: "#777" }}>
          Even smaller text at 10px with low contrast — completely illegible for many users, and
          zoom is disabled.
        </p>
      </div>

      <div className="my-4">
        <h3>Dense Data Table</h3>
        <table className="text-xs border-collapse w-full">
          <thead>
            <tr>
              <th className="border p-1 bg-gray-100">ID</th>
              <th className="border p-1 bg-gray-100">Name</th>
              <th className="border p-1 bg-gray-100">Status</th>
              <th className="border p-1 bg-gray-100">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-1">001</td>
              <td className="border p-1">Alpha</td>
              <td className="border p-1">Active</td>
              <td className="border p-1">$12.50</td>
            </tr>
            <tr>
              <td className="border p-1">002</td>
              <td className="border p-1">Beta</td>
              <td className="border p-1">Pending</td>
              <td className="border p-1">$8.75</td>
            </tr>
            <tr>
              <td className="border p-1">003</td>
              <td className="border p-1">Gamma</td>
              <td className="border p-1">Inactive</td>
              <td className="border p-1">$45.00</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-1">
          Dense table at 12px — users cannot zoom to read this data.
        </p>
      </div>
    </div>
  );
}
