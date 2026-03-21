export default function AutocompleteTest() {
  return (
    <div>
      <h2>Checkout Form</h2>
      <p>Please fill in your details to complete your purchase.</p>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-5 my-4">
        {/* ERROR: Personal name without autocomplete */}
        <div>
          <label htmlFor="ac-name" className="block font-medium mb-1">
            Full Name
          </label>
          <input id="ac-name" type="text" className="w-full border px-3 py-2 rounded" />
          <p className="text-sm text-gray-600 mt-1">
            ↑ Missing <code>autocomplete="name"</code>.
          </p>
        </div>

        {/* ERROR: Email without autocomplete */}
        <div>
          <label htmlFor="ac-email" className="block font-medium mb-1">
            Email Address
          </label>
          <input id="ac-email" type="email" className="w-full border px-3 py-2 rounded" />
          <p className="text-sm text-gray-600 mt-1">
            ↑ Missing <code>autocomplete="email"</code>.
          </p>
        </div>

        {/* ERROR: Phone without autocomplete */}
        <div>
          <label htmlFor="ac-phone" className="block font-medium mb-1">
            Phone Number
          </label>
          <input id="ac-phone" type="tel" className="w-full border px-3 py-2 rounded" />
          <p className="text-sm text-gray-600 mt-1">
            ↑ Missing <code>autocomplete="tel"</code>.
          </p>
        </div>

        {/* ERROR: Address fields without autocomplete */}
        <fieldset className="border p-4 rounded">
          <legend className="font-medium px-2">Shipping Address</legend>
          <div className="space-y-3">
            <div>
              <label htmlFor="ac-street" className="block text-sm mb-1">
                Street Address
              </label>
              <input id="ac-street" type="text" className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label htmlFor="ac-city" className="block text-sm mb-1">
                City
              </label>
              <input id="ac-city" type="text" className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label htmlFor="ac-zip" className="block text-sm mb-1">
                ZIP / Postal Code
              </label>
              <input id="ac-zip" type="text" className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label htmlFor="ac-country" className="block text-sm mb-1">
                Country
              </label>
              <select id="ac-country" className="w-full border px-3 py-2 rounded">
                <option value="">Select country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="es">Spain</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            ↑ All address fields missing appropriate <code>autocomplete</code> attributes
            (address-line1, address-level2, postal-code, country-name).
          </p>
        </fieldset>

        {/* ERROR: Credit card fields without autocomplete */}
        <div>
          <label htmlFor="ac-cc" className="block font-medium mb-1">
            Credit Card Number
          </label>
          <input
            id="ac-cc"
            type="text"
            inputMode="numeric"
            className="w-full border px-3 py-2 rounded"
          />
          <p className="text-sm text-gray-600 mt-1">
            ↑ Missing <code>autocomplete="cc-number"</code>.
          </p>
        </div>

        {/* CORRECT: Field with proper autocomplete */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <label htmlFor="ac-correct-email" className="block font-medium mb-1">
            Billing Email (correct)
          </label>
          <input
            id="ac-correct-email"
            type="email"
            autoComplete="email"
            className="w-full border px-3 py-2 rounded"
          />
          <p className="text-sm text-gray-600 mt-1">
            ✓ Has <code>autocomplete="email"</code>.
          </p>
        </div>

        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">
          Place Order
        </button>
      </form>
    </div>
  );
}
