import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const VIEWPORT_ZOOM_CATALOG: BookmarkletCatalogEntry = {
  id: "viewport-zoom",
  name: "Viewport & Zoom",
  description:
    "Audit viewport meta tag for zoom restrictions: user-scalable, maximum-scale, minimum-scale, and responsive width configuration.",
  wcag: ["1.4.4", "1.4.10"],
  details:
    'Reads <meta name="viewport"> and analyzes its directives. Detects restrictions: user-scalable=no, maximum-scale < 2 (below 200% required by WCAG), minimum-scale = maximum-scale (locked zoom). Reports each directive and its accessibility impact.',
  tags: ["zoom", "mobile", "responsive"],
  checks: [
    "user-scalable=no or user-scalable=0 (zoom disabled — violation)",
    "maximum-scale < 2 (below 200% zoom — violation)",
    "maximum-scale 2–5 (limited zoom — warning)",
    "minimum-scale = maximum-scale (locked zoom — violation)",
    "width=device-width for responsive reflow (1.4.10)",
    "Fixed pixel width that may cause horizontal scroll",
  ],
  dataReturned:
    "Object with `{ hasViewportMeta, content, directives: [{ key, value }], userScalable, maximumScale, minimumScale, initialScale, width }`.",
};
