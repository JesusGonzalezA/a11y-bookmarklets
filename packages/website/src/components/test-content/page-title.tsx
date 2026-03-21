import { useEffect } from "react";

export default function PageTitleTest() {
  useEffect(() => {
    const originalTitle = document.title;

    // ERROR: Set a generic, non-descriptive title
    document.title = "Page";

    return () => {
      document.title = originalTitle;
    };
  }, []);

  return (
    <div>
      {/* ERROR: h1 doesn't match the page title ("Page") */}
      <h1>Welcome to Our Amazing E-Commerce Platform for Buying and Selling Products Online</h1>

      <div className="my-4 p-4 bg-red-50 border border-red-200 rounded">
        <h3>⚠ Page title issues active</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>
            <code>document.title</code> has been set to <strong>"Page"</strong> — too generic and
            non-descriptive.
          </li>
          <li>
            The <code>&lt;h1&gt;</code> is excessively long and does not match the title.
          </li>
          <li>Title should be 30-60 characters and descriptive of the page content.</li>
        </ul>
      </div>

      <div className="my-4">
        <h2>Product Categories</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <h3>Electronics</h3>
            <p>Phones, laptops, tablets and more.</p>
          </div>
          <div className="p-4 border rounded">
            <h3>Clothing</h3>
            <p>Fashion for every season.</p>
          </div>
          <div className="p-4 border rounded">
            <h3>Home &amp; Garden</h3>
            <p>Everything for your living space.</p>
          </div>
        </div>
      </div>

      <div className="my-4">
        <h2>About This Test</h2>
        <p>
          The page title is critical for screen reader users — it's the first thing announced when a
          page loads. A generic title like "Page" or "Untitled" provides no context about the page
          content.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          WCAG 2.4.2 requires that web pages have titles that describe topic or purpose.
        </p>
      </div>
    </div>
  );
}
