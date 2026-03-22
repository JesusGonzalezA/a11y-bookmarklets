export default function SkipLinksTest() {
  return (
    <div>
      {/* ERROR: No skip link at all at the top of the page */}
      <nav className="p-4 bg-gray-100 border-b mb-4">
        <ul className="flex gap-4 list-none p-0">
          <li>
            <a href="#sl-home">Home</a>
          </li>
          <li>
            <a href="#sl-about">About</a>
          </li>
          <li>
            <a href="#sl-services">Services</a>
          </li>
          <li>
            <a href="#sl-portfolio">Portfolio</a>
          </li>
          <li>
            <a href="#sl-blog">Blog</a>
          </li>
          <li>
            <a href="#sl-contact">Contact</a>
          </li>
          <li>
            <a href="#sl-careers">Careers</a>
          </li>
          <li>
            <a href="#sl-faq">FAQ</a>
          </li>
          <li>
            <a href="#sl-support">Support</a>
          </li>
          <li>
            <a href="#sl-legal">Legal</a>
          </li>
        </ul>
        <p className="text-sm text-gray-600 mt-2">
          ↑ 10 navigation links before main content, and no skip link to bypass them.
        </p>
      </nav>

      {/* ERROR: Skip link with broken target */}
      <a
        href="#nonexistent-target"
        className="block p-2 bg-yellow-100 border border-yellow-300 rounded mb-4 text-sm"
      >
        Skip to main content
      </a>
      <p className="text-sm text-gray-600 mb-4">
        ↑ This skip link points to <code>#nonexistent-target</code> which doesn't exist on the page.
      </p>

      {/* ERROR: Skip link that is not the first focusable element */}
      <div className="mb-4">
        <button type="button" className="px-3 py-1 border rounded text-sm">
          Cookie Preferences
        </button>
        <a
          href="#sl-main-content"
          className="ml-2 p-2 bg-blue-100 border border-blue-300 rounded text-sm"
        >
          Skip to content
        </a>
        <p className="text-sm text-gray-600 mt-2">
          ↑ The skip link is not the first focusable element — the "Cookie Preferences" button comes
          before it in tab order.
        </p>
      </div>

      <div id="sl-main-content" className="p-4 border rounded">
        <h2>Main Content</h2>
        <p>
          This is the main content area. Keyboard-only users had to tab through all the navigation
          links and interactive elements above to reach this content.
        </p>
        <p className="mt-2">
          A proper skip link should be the very first focusable element, become visible on focus,
          and point to a valid target ID.
        </p>
      </div>

      {/* CORRECT: Proper skip link example description */}
      <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded">
        <h3>Correct Skip Link Pattern</h3>
        <p className="text-sm text-gray-700">
          A correct skip link is: (1) the first focusable element in the DOM, (2) visually hidden
          until focused (<code>sr-only + focus:not-sr-only</code>), (3) targets a valid ID on the
          main content area. The site's own Layout already implements this correctly in the header.
        </p>
      </div>
    </div>
  );
}
