import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { HeadingData } from "./types.js";
import { HEADING_COLORS } from "./types.js";

export function renderHeadings(headings: HeadingData[], issues: Issue[]): void {
  renderOverlays(
    headings.map((h) => {
      const tag = `h${h.level}`;
      return {
        selector: h.selector,
        color: HEADING_COLORS[tag] ?? "#999",
        label: tag.toUpperCase(),
      };
    }),
  );

  const outline = headings
    .map((h) => `${"  ".repeat(h.level - 1)}h${h.level}: ${h.text || "(empty)"}`)
    .join("\n");

  showResultPanel(`Headings (${headings.length})`, issues, {
    summaryHtml: `<pre style="margin:4px 0 0; white-space:pre-wrap;">${outline}</pre>`,
  });
}
