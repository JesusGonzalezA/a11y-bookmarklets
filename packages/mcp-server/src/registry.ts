/**
 * Bookmarklet registry — maps bookmarklet IDs to their JS source code.
 *
 * In production, these are loaded from the compiled dist/ files.
 * For now, they provide the JS code that gets injected into the browser
 * via Playwright's page.evaluate().
 */

export interface BookmarkletEntry {
  id: string;
  name: string;
  description: string;
  wcag: string[];
}

export const BOOKMARKLET_REGISTRY: BookmarkletEntry[] = [
  {
    id: "headings",
    name: "Headings",
    description: "Audit heading structure (h1-h6): hierarchy, skipped levels, empty headings, multiple h1s.",
    wcag: ["1.3.1", "2.4.6"],
  },
  {
    id: "landmarks",
    name: "Landmarks",
    description: "Audit semantic landmark regions: main, nav, banner, complementary, contentinfo, search.",
    wcag: ["1.3.1", "2.4.1"],
  },
  {
    id: "tab-order",
    name: "Tab Order",
    description: "Visualize and audit keyboard tab order: positive tabindex, hidden focusable elements.",
    wcag: ["2.4.3", "2.1.1"],
  },
  {
    id: "images",
    name: "Images",
    description: "Audit image alt text: missing alt, decorative images, suspicious alt text patterns.",
    wcag: ["1.1.1"],
  },
];

/**
 * Get the JavaScript code for a bookmarklet that can be injected via page.evaluate().
 * The code is read from the compiled dist/bookmarklets/ directory.
 */
export function getBookmarkletSource(distDir: string, id: string): string | null {
  try {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const path = join(distDir, `${id}.min.js`);
    return readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}
