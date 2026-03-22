export default function FormErrorsTest() {
  return (
    <div>
      <h2>Account Settings</h2>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6 my-4">
        {/* ERROR: Invalid field without aria-invalid */}
        <div>
          <label htmlFor="fe-username" className="block font-medium mb-1">
            Username
          </label>
          <input
            id="fe-username"
            type="text"
            value="ab"
            readOnly
            className="w-full border border-red-500 px-3 py-2 rounded"
          />
          <p className="text-red-600 text-sm mt-1">Username must be at least 3 characters.</p>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Red border and error text visible, but no <code>aria-invalid="true"</code> on the
            input. Screen readers won't know it's invalid.
          </p>
        </div>

        {/* ERROR: Error message not linked via aria-errormessage */}
        <div>
          <label htmlFor="fe-email" className="block font-medium mb-1">
            Email
          </label>
          <input
            id="fe-email"
            type="email"
            value="not-an-email"
            readOnly
            aria-invalid="true"
            className="w-full border border-red-500 px-3 py-2 rounded"
          />
          <p id="fe-email-error" className="text-red-600 text-sm mt-1">
            Please enter a valid email address.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Has <code>aria-invalid</code> but no <code>aria-errormessage</code> or{" "}
            <code>aria-describedby</code> linking to the error message.
          </p>
        </div>

        {/* ERROR: Error appears but not in a live region */}
        <div>
          <label htmlFor="fe-password" className="block font-medium mb-1">
            Password
          </label>
          <input
            id="fe-password"
            type="password"
            value="123"
            readOnly
            className="w-full border border-red-500 px-3 py-2 rounded"
          />
          <div>
            <p className="text-red-600 text-sm mt-1">
              Password must be at least 8 characters with one uppercase letter and one number.
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Error is not inside an <code>aria-live</code> region — dynamically shown errors won't
            be announced by screen readers.
          </p>
        </div>

        {/* ERROR: Error message with no programmatic association */}
        <div>
          <label htmlFor="fe-confirm" className="block font-medium mb-1">
            Confirm Password
          </label>
          <input
            id="fe-confirm"
            type="password"
            value="456"
            readOnly
            className="w-full border border-red-500 px-3 py-2 rounded"
          />
          <span className="text-red-600 text-sm">✗</span>
          <span className="text-red-600 text-sm ml-1">Passwords do not match.</span>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Error is just styled text next to the field — not linked by any ARIA attribute.
          </p>
        </div>

        {/* CORRECT: Proper error handling */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <label htmlFor="fe-correct-phone" className="block font-medium mb-1">
            Phone Number (correct)
          </label>
          <input
            id="fe-correct-phone"
            type="tel"
            value="abc"
            readOnly
            aria-invalid="true"
            aria-errormessage="fe-phone-error"
            aria-describedby="fe-phone-error"
            className="w-full border border-red-500 px-3 py-2 rounded"
          />
          <p id="fe-phone-error" role="alert" className="text-red-600 text-sm mt-1">
            Please enter a valid phone number.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ✓ Has <code>aria-invalid</code>, <code>aria-errormessage</code>, and{" "}
            <code>role="alert"</code>.
          </p>
        </div>

        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
