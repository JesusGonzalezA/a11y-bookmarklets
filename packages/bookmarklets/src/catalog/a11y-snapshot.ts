import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const A11Y_SNAPSHOT_CATALOG: BookmarkletCatalogEntry = {
  id: "a11y-snapshot",
  name: "A11y Snapshot",
  description:
    "Generate a comprehensive JSON snapshot of the page's accessibility state for holistic AI analysis.",
  wcag: ["1.1.1", "1.3.1", "2.4.1", "2.4.2", "2.4.4", "3.1.1", "4.1.2"],
  details:
    "Meta-bookmarklet that collects a complete accessibility snapshot including: heading tree, landmark map, images with alt text, form controls with labels, links and buttons with accessible names, live regions, ARIA roles, lang attributes, meta tags, media elements, and general statistics. Produces no visual overlay — purely data-oriented for AI consumption.",
  checks: [
    "Heading hierarchy summary",
    "Landmark structure",
    "Image alt text inventory",
    "Form control label coverage",
    "Link and button accessible names",
    "Live region presence",
    "ARIA role usage",
    "Language declarations",
    "Meta tag configuration",
    "Media element inventory",
    "Page statistics (total elements, interactive, hidden)",
  ],
  dataReturned:
    "`{ url, timestamp, lang, title, headings[], landmarks[], images[], forms[], links[], buttons[], liveRegions[], ariaRoles[], media[], metaTags[], stats{} }` — complete page accessibility snapshot.",
  tags: ["meta", "snapshot", "ai", "data"],
};
