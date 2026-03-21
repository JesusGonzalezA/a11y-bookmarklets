export default function FormLabelsTest() {
  return (
    <div>
      <h2>Registration Form</h2>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6 my-4">
        {/* ERROR: Input with no label at all */}
        <div>
          <input type="text" className="w-full border px-3 py-2 rounded" />
          <p className="text-sm text-gray-600 mt-1">
            ↑ Input with absolutely no label, aria-label, or title.
          </p>
        </div>

        {/* ERROR: Input with only placeholder (no label) */}
        <div>
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full border px-3 py-2 rounded"
          />
          <p className="text-sm text-gray-600 mt-1">
            ↑ Only a placeholder — disappears when user starts typing. Not a label.
          </p>
        </div>

        {/* ERROR: Label with wrong "for" attribute */}
        <div>
          <label htmlFor="nonexistent-id" className="block font-medium mb-1">
            Phone Number
          </label>
          <input id="phone-field" type="tel" className="w-full border px-3 py-2 rounded" />
          <p className="text-sm text-gray-600 mt-1">
            ↑ Label <code>for="nonexistent-id"</code> doesn't match input{" "}
            <code>id="phone-field"</code>.
          </p>
        </div>

        {/* ERROR: Select without any label */}
        <div>
          <select className="w-full border px-3 py-2 rounded">
            <option value="">Choose your country</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="es">Spain</option>
          </select>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Select with no label — first option acts as pseudo-label but is not accessible.
          </p>
        </div>

        {/* ERROR: Textarea with no label */}
        <div>
          <textarea
            rows={3}
            className="w-full border px-3 py-2 rounded"
            placeholder="Tell us about yourself..."
          />
          <p className="text-sm text-gray-600 mt-1">↑ Textarea with only placeholder, no label.</p>
        </div>

        {/* ERROR: Multiple inputs in a row, single label */}
        <div>
          <label className="block font-medium mb-1">Date of Birth</label>
          <div className="flex gap-2">
            <input type="text" placeholder="MM" className="w-16 border px-2 py-2 rounded" />
            <input type="text" placeholder="DD" className="w-16 border px-2 py-2 rounded" />
            <input type="text" placeholder="YYYY" className="w-20 border px-2 py-2 rounded" />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ One label for three separate inputs — only the first (if any) is associated.
          </p>
        </div>

        {/* CORRECT: Properly labeled input */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <label htmlFor="correct-name" className="block font-medium mb-1">
            Full Name
          </label>
          <input id="correct-name" type="text" className="w-full border px-3 py-2 rounded" />
          <p className="text-sm text-gray-600 mt-1">
            ✓ Proper label with matching <code>for</code> and <code>id</code>.
          </p>
        </div>

        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">
          Register
        </button>
      </form>
    </div>
  );
}
