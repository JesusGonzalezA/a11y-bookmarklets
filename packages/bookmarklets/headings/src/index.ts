/**
 * Headings bookmarklet
 *
 * Audits the heading structure (h1–h6) of the current page.
 *
 * Visual mode: labels each heading with its level and highlights issues.
 * Data mode:   returns structured JSON with heading hierarchy and issues.
 *
 * WCAG: 1.3.1 Info and Relationships, 2.4.6 Headings and Labels
 */

import type { AuditResult, BookmarkletOptions, Issue } from "@bookmarklets-a11y/core";
import {
  queryAll,
  uniqueSelector,
  truncatedHtml,
  buildResult,
  clearOverlays,
  addLabel,
  addOutline,
  showPanel,
} from "@bookmarklets-a11y/core";

const BOOKMARKLET_ID = "headings";

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

function auditHeadings(): { issues: Issue[]; headings: { level: number; text: string; selector: string }[] } {
  const headingElements = queryAll("h1, h2, h3, h4, h5, h6");
  const issues: Issue[] = [];
  const headings: { level: number; text: string; selector: string }[] = [];

  let previousLevel = 0;
  let h1Count = 0;

  for (const el of headingElements) {
    const tag = el.tagName.toLowerCase();
    const level = getHeadingLevel(tag);
    const text = el.textContent?.trim() ?? "";
    const selector = uniqueSelector(el);

    headings.push({ level, text, selector });

    // Empty heading
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

    // Skipped heading level (e.g. h2 → h4)
    if (previousLevel > 0 && level > previousLevel + 1) {
      issues.push({
        severity: "warning",
        message: `Heading level skipped: ${`h${previousLevel}`} → ${tag} (expected h${previousLevel + 1})`,
        selector,
        html: truncatedHtml(el),
        wcag: "1.3.1",
        suggestion: `Use h${previousLevel + 1} instead, or add the missing intermediate heading.`,
        data: { level, previousLevel, text },
      });
    }

    // Count h1s
    if (level === 1) h1Count++;

    // Record as info for each heading found
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

  // Multiple h1s
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

  // No h1
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

  // No headings at all
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

  return { issues, headings };
}

function renderVisual(headings: { level: number; text: string; selector: string }[]): void {
  clearOverlays();

  for (const h of headings) {
    const el = document.querySelector(h.selector);
    if (!el) continue;

    const tag = `h${h.level}`;
    const color = COLORS[tag] ?? "#999";

    addOutline(el, color);
    addLabel(el, { text: `${tag.toUpperCase()}`, bgColor: color });
  }

  // Summary panel
  const levels = headings.map((h) => h.level);
  const outline = headings.map((h) => `${"  ".repeat(h.level - 1)}h${h.level}: ${h.text || "(empty)"}`).join("\n");

  showPanel(`
    <strong>Headings (${headings.length})</strong>
    <pre style="font-size:11px; margin:8px 0 0; white-space:pre-wrap;">${outline}</pre>
  `);
}

/**
 * Main entry point — executed when the bookmarklet runs.
 */
export function run(options: BookmarkletOptions = {}): AuditResult {
  const mode = options.mode ?? "both";
  const { issues, headings } = auditHeadings();

  if (mode === "visual" || mode === "both") {
    renderVisual(headings);
  }

  const result = buildResult(BOOKMARKLET_ID, issues);

  // Expose on window for programmatic access
  (window as any).__a11y = (window as any).__a11y ?? {};
  (window as any).__a11y[BOOKMARKLET_ID] = { audit: () => run({ mode: "data" }), lastResult: result };

  return result;
}

// Auto-execute when loaded as a bookmarklet
run();
