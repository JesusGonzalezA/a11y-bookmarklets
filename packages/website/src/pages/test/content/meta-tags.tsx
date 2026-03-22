import { useEffect } from "react";

export default function MetaTagsTest() {
  useEffect(() => {
    const injected: HTMLElement[] = [];

    // ERROR: Add http-equiv=refresh that auto-redirects
    const refresh = document.createElement("meta");
    refresh.httpEquiv = "refresh";
    refresh.content = "30;url=https://example.com";
    refresh.dataset.testInjected = "true";
    document.head.appendChild(refresh);
    injected.push(refresh);

    // Remove existing meta description if present (to test missing description)
    const existingDesc = document.querySelector('meta[name="description"]');
    let removedDesc: { content: string } | null = null;
    if (existingDesc) {
      removedDesc = { content: existingDesc.getAttribute("content") ?? "" };
      existingDesc.remove();
    }

    return () => {
      for (const el of injected) el.remove();
      if (removedDesc) {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = removedDesc.content;
        document.head.appendChild(meta);
      }
    };
  }, []);

  return (
    <div>
      <h2>Company Website</h2>

      <div className="my-4 p-4 bg-red-50 border border-red-200 rounded">
        <h3>⚠ Meta tag issues active</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>
            <code>&lt;meta http-equiv="refresh"&gt;</code> injected — causes automatic redirect
            after 30 seconds. Violates WCAG 2.2.1 (Timing Adjustable) and 3.2.5 (Change on Request).
          </li>
          <li>
            <code>&lt;meta name="description"&gt;</code> removed — page has no description for
            search engines and assistive technologies.
          </li>
          <li>
            No <code>&lt;meta name="color-scheme"&gt;</code> tag — browser UI elements don't adapt
            to color preference.
          </li>
          <li>
            No <code>&lt;meta name="theme-color"&gt;</code> tag.
          </li>
        </ul>
      </div>

      <div className="my-4">
        <h2>Our Services</h2>
        <p>
          We provide world-class consulting services for businesses looking to improve their digital
          presence and reach new audiences.
        </p>
      </div>

      <div className="my-4">
        <h2>Latest News</h2>
        <div className="space-y-3">
          <article className="p-4 border rounded">
            <h3>Q4 Results Announced</h3>
            <p className="text-sm text-gray-600">
              Our quarterly results show strong growth across all segments...
            </p>
          </article>
          <article className="p-4 border rounded">
            <h3>New Partnership</h3>
            <p className="text-sm text-gray-600">
              We are excited to announce our new strategic partnership with...
            </p>
          </article>
        </div>
      </div>

      <div className="my-4">
        <h2>About This Test</h2>
        <p>
          Meta tags provide critical metadata for browsers, search engines, and assistive
          technologies. Missing or incorrect meta tags can cause timing issues, poor SEO, and
          reduced accessibility.
        </p>
      </div>
    </div>
  );
}
