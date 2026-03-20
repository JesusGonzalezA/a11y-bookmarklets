/**
 * Headings bookmarklet — audits heading structure (h1–h6).
 *
 * WCAG: 1.3.1 Info and Relationships, 2.4.6 Headings and Labels
 */

import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { queryAll, uniqueSelector, truncatedHtml } from "../../infrastructure/dom/DomUtils.js";
import { addLabel, addOutline, showPanel } from "../../infrastructure/overlay/OverlayManager.js";
import { HEADINGS_CATALOG } from "../../catalog/headings.js";

interface HeadingData {
  level: number;
  text: string;
  selector: string;
}

const COLORS: Record<string, string> = {
  h1: "#e74c3c",
  h2: "#e67e22",
  h3: "#f1c40f",
  h4: "#2ecc71",
  h5: "#3498db",
  h6: "#9b59b6",
};

function getHeadingLevel(tag: string): number {
  return parseInt(tag.charAt(1), 10);
}

export class HeadingsBookmarklet extends Bookmarklet<HeadingData[]> {
  constructor() {
    super(HEADINGS_CATALOG);
  }

  protected audit(): AuditOutput<HeadingData[]> {
    const headingElements = queryAll("h1, h2, h3, h4, h5, h6");
    const issues: Issue[] = [];
    const headings: HeadingData[] = [];

    let previousLevel = 0;
    let h1Count = 0;

    for (const el of headingElements) {
      const tag = el.tagName.toLowerCase();
      const level = getHeadingLevel(tag);
      const text = el.textContent?.trim() ?? "";
      const selector = uniqueSelector(el);

      headings.push({ level, text, selector });

      if (!text) {
        issues.push({
          severity: "error",
          message: `Empty ${tag} heading`,
          selector,
          html: truncatedHtml(el),
          wcag: "2.4.6",
          suggestion: "Add text content to the heading or remove it if unnecessary.",
          data: { level, text },
        });
      }

      if (previousLevel > 0 && level > previousLevel + 1) {
        issues.push({
          severity: "warning",
          message: `Heading level skipped: h${previousLevel} → ${tag} (expected h${previousLevel + 1})`,
          selector,
          html: truncatedHtml(el),
          wcag: "1.3.1",
          suggestion: `Use h${previousLevel + 1} instead, or add the missing intermediate heading.`,
          data: { level, previousLevel, text },
        });
      }

      if (level === 1) h1Count++;

      issues.push({
        severity: "info",
        message: `${tag}: "${text}"`,
        selector,
        html: truncatedHtml(el),
        wcag: "1.3.1",
        data: { level, text },
      });

      previousLevel = level;
    }

    if (h1Count > 1) {
      issues.push({
        severity: "warning",
        message: `Multiple h1 elements found (${h1Count}). Best practice is to have a single h1.`,
        selector: uniqueSelector(headingElements[0]),
        html: truncatedHtml(headingElements[0]),
        wcag: "1.3.1",
        suggestion: "Consider using a single h1 for the main page title.",
        data: { h1Count },
      });
    }

    if (h1Count === 0 && headingElements.length > 0) {
      issues.push({
        severity: "warning",
        message: "No h1 heading found on the page.",
        selector: "html",
        html: "",
        wcag: "2.4.6",
        suggestion: "Add an h1 heading that describes the main topic of the page.",
      });
    }

    if (headingElements.length === 0) {
      issues.push({
        severity: "warning",
        message: "No headings found on the page.",
        selector: "html",
        html: "",
        wcag: "2.4.6",
        suggestion: "Add headings to structure the page content.",
      });
    }

    return { issues, data: headings };
  }

  protected render(headings: HeadingData[]): void {
    for (const h of headings) {
      const el = document.querySelector(h.selector);
      if (!el) continue;

      const tag = `h${h.level}`;
      const color = COLORS[tag] ?? "#999";

      addOutline(el, color);
      addLabel(el, { text: tag.toUpperCase(), bgColor: color });
    }

    const outline = headings
      .map((h) => `${"  ".repeat(h.level - 1)}h${h.level}: ${h.text || "(empty)"}`)
      .join("\n");

    showPanel(`
      <strong>Headings (${headings.length})</strong>
      <pre style="font-size:11px; margin:8px 0 0; white-space:pre-wrap;">${outline}</pre>
    `);
  }
}
