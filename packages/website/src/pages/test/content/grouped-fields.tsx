export default function GroupedFieldsTest() {
  return (
    <div>
      <h2>Survey Form</h2>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6 my-4">
        {/* ERROR: Radio buttons not wrapped in fieldset */}
        <div>
          <p className="font-medium mb-2">What is your experience level?</p>
          <div className="space-y-1">
            <div>
              <input type="radio" name="experience" id="gf-beginner" value="beginner" />
              <label htmlFor="gf-beginner" className="ml-2">
                Beginner
              </label>
            </div>
            <div>
              <input type="radio" name="experience" id="gf-intermediate" value="intermediate" />
              <label htmlFor="gf-intermediate" className="ml-2">
                Intermediate
              </label>
            </div>
            <div>
              <input type="radio" name="experience" id="gf-advanced" value="advanced" />
              <label htmlFor="gf-advanced" className="ml-2">
                Advanced
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Radio group with no <code>&lt;fieldset&gt;</code> or <code>role="radiogroup"</code>.
            The group question is just a <code>&lt;p&gt;</code> — not programmatically associated.
          </p>
        </div>

        {/* ERROR: Checkbox group without grouping */}
        <div>
          <p className="font-medium mb-2">Which topics interest you?</p>
          <div className="space-y-1">
            <div>
              <input type="checkbox" id="gf-html" value="html" />
              <label htmlFor="gf-html" className="ml-2">
                HTML
              </label>
            </div>
            <div>
              <input type="checkbox" id="gf-css" value="css" />
              <label htmlFor="gf-css" className="ml-2">
                CSS
              </label>
            </div>
            <div>
              <input type="checkbox" id="gf-js" value="js" />
              <label htmlFor="gf-js" className="ml-2">
                JavaScript
              </label>
            </div>
            <div>
              <input type="checkbox" id="gf-a11y" value="a11y" />
              <label htmlFor="gf-a11y" className="ml-2">
                Accessibility
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Checkbox group with no <code>&lt;fieldset&gt;</code> — group label is not associated.
          </p>
        </div>

        {/* ERROR: Fieldset without legend */}
        <fieldset className="border p-4 rounded">
          <div className="space-y-1">
            <div>
              <input type="radio" name="notify" id="gf-email-notify" value="email" />
              <label htmlFor="gf-email-notify" className="ml-2">
                Email
              </label>
            </div>
            <div>
              <input type="radio" name="notify" id="gf-sms-notify" value="sms" />
              <label htmlFor="gf-sms-notify" className="ml-2">
                SMS
              </label>
            </div>
            <div>
              <input type="radio" name="notify" id="gf-none-notify" value="none" />
              <label htmlFor="gf-none-notify" className="ml-2">
                None
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            ↑ <code>&lt;fieldset&gt;</code> without <code>&lt;legend&gt;</code> — the group has no
            accessible name describing the question.
          </p>
        </fieldset>

        {/* CORRECT: Properly grouped radio buttons */}
        <fieldset className="border border-green-200 bg-green-50 p-4 rounded">
          <legend className="font-medium px-2">How did you hear about us?</legend>
          <div className="space-y-1 mt-2">
            <div>
              <input type="radio" name="referral" id="gf-search" value="search" />
              <label htmlFor="gf-search" className="ml-2">
                Search engine
              </label>
            </div>
            <div>
              <input type="radio" name="referral" id="gf-social" value="social" />
              <label htmlFor="gf-social" className="ml-2">
                Social media
              </label>
            </div>
            <div>
              <input type="radio" name="referral" id="gf-friend" value="friend" />
              <label htmlFor="gf-friend" className="ml-2">
                Friend or colleague
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            ✓ Proper <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code>.
          </p>
        </fieldset>

        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">
          Submit Survey
        </button>
      </form>
    </div>
  );
}
