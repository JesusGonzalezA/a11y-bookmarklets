export default function TextSpacingTest() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* These will be tested by the bookmarklet which increases spacing */
            .ts-clip-box { height: 80px; overflow: hidden; border: 1px solid #ddd; padding: 0.75rem; border-radius: 0.5rem; }
            .ts-fixed-line { line-height: 1; }
            .ts-fixed-height { height: 1.5em; overflow: hidden; }
            .ts-nowrap { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px; }
          `,
        }}
      />

      <h2>Content Layout Stress Test</h2>

      <div className="space-y-6 my-4">
        {/* ERROR: Fixed height container that will clip with increased spacing */}
        <div>
          <h3>Testimonial Card</h3>
          <div className="ts-clip-box">
            <p>
              "This product changed my workflow completely. I can't imagine going back to the old
              way of doing things. The team support has been incredible and responsive."
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Fixed height (80px) with <code>overflow: hidden</code> — text clipped when spacing
            increases per WCAG 1.4.12.
          </p>
        </div>

        {/* ERROR: Fixed line-height that doesn't adapt */}
        <div>
          <h3>Compact List</h3>
          <ul className="ts-fixed-line list-disc pl-5">
            <li>Accessibility audit and remediation services</li>
            <li>WCAG 2.2 compliance consulting for enterprise</li>
            <li>Assistive technology testing and validation</li>
            <li>Inclusive design workshops and training sessions</li>
          </ul>
          <p className="text-sm text-gray-600 mt-1">
            ↑ <code>line-height: 1</code> — when letter spacing is increased to 0.12em and word
            spacing to 0.16em, text will overlap.
          </p>
        </div>

        {/* ERROR: Single-line fixed height cells */}
        <div>
          <h3>Data Table</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="ts-fixed-height border p-1 bg-gray-100">Product</th>
                <th className="ts-fixed-height border p-1 bg-gray-100">Category</th>
                <th className="ts-fixed-height border p-1 bg-gray-100">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="ts-fixed-height border p-1">Premium Widget</td>
                <td className="ts-fixed-height border p-1">Electronics</td>
                <td className="ts-fixed-height border p-1">$49.99</td>
              </tr>
              <tr>
                <td className="ts-fixed-height border p-1">Super Gadget Pro</td>
                <td className="ts-fixed-height border p-1">Accessories</td>
                <td className="ts-fixed-height border p-1">$29.99</td>
              </tr>
            </tbody>
          </table>
          <p className="text-sm text-gray-600 mt-1">
            ↑ Table cells with <code>height: 1.5em; overflow: hidden</code> — content clipped when
            spacing adjustments are applied.
          </p>
        </div>

        {/* ERROR: No-wrap text that truncates */}
        <div>
          <h3>Navigation Buttons</h3>
          <div className="flex gap-2">
            <div className="ts-nowrap px-3 py-1 border rounded text-sm">
              Account Settings and Preferences
            </div>
            <div className="ts-nowrap px-3 py-1 border rounded text-sm">
              Notification Management Center
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ↑ <code>white-space: nowrap; overflow: hidden; text-overflow: ellipsis</code> — loses
            content when word/letter spacing increases.
          </p>
        </div>

        {/* CORRECT: Flexible container */}
        <div className="p-4 border border-green-200 bg-green-50 rounded">
          <h3>Correct Example</h3>
          <div className="border p-3 rounded" style={{ minHeight: "3em" }}>
            <p>
              This container uses <code>min-height</code> instead of fixed <code>height</code>, and
              has no <code>overflow: hidden</code>. Text can expand freely when spacing is
              increased.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
