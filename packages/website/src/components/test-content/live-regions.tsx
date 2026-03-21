import { useState } from "react";

export default function LiveRegionsTest() {
  const [count, setCount] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [correctStatus, setCorrectStatus] = useState("");

  return (
    <div>
      <h2>Real-Time Dashboard</h2>

      <div className="space-y-6 my-4">
        {/* ERROR: Dynamic counter without live region */}
        <div>
          <h3>Notification Counter</h3>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-3 py-1 bg-blue-600 text-white rounded"
              onClick={() => setCount((c) => c + 1)}
            >
              Add notification
            </button>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold">
              {count}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Counter updates visually but has no <code>aria-live</code> — screen readers don't
            announce changes.
          </p>
        </div>

        {/* ERROR: Status update without aria-live */}
        <div>
          <h3>Save Status</h3>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-3 py-1 bg-green-600 text-white rounded"
              onClick={() => setStatusText("Document saved successfully.")}
            >
              Save Document
            </button>
            {statusText && (
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded">{statusText}</div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Status message appears but not in an <code>aria-live</code> region — screen readers
            won't announce the save confirmation.
          </p>
        </div>

        {/* ERROR: Alert-like message without role="alert" */}
        <div>
          <h3>Error Messages</h3>
          <button
            type="button"
            className="px-3 py-1 bg-red-600 text-white rounded"
            onClick={() => {
              const el = document.getElementById("lr-error-area");
              if (el) el.textContent = "Connection lost. Please check your network.";
            }}
          >
            Simulate Error
          </button>
          <div
            id="lr-error-area"
            className="mt-2 p-2 bg-red-50 text-red-800 rounded min-h-[2rem]"
          />
          <p className="text-sm text-gray-600 mt-1">
            ↑ Error message injected via DOM without <code>role="alert"</code> or{" "}
            <code>aria-live="assertive"</code>.
          </p>
        </div>

        {/* ERROR: aria-live on element that gets replaced entirely */}
        <div>
          <h3>Progress Update</h3>
          <div className="mt-2">
            <div className="w-full h-4 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${Math.min(count * 10, 100)}%` }}
              />
            </div>
            <p className="text-sm mt-1">{Math.min(count * 10, 100)}% complete</p>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Progress bar updates visually but the percentage text has no live region.
          </p>
        </div>

        {/* CORRECT: Proper live region */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <h3>Correct Example</h3>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-3 py-1 bg-blue-600 text-white rounded"
              onClick={() => setCorrectStatus("Item added to cart. Cart total: $29.99.")}
            >
              Add to Cart
            </button>
            <div aria-live="polite" role="status" className="px-3 py-1">
              {correctStatus}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ✓ Uses <code>aria-live="polite"</code> and <code>role="status"</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
