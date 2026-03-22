import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay, isElementVisible } from "../shared/accessibility.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { TextSpacingData } from "./types.js";

/**
 * WCAG 1.4.12 Text Spacing values:
 * - Line height: at least 1.5× font size
 * - Paragraph spacing: at least 2× font size
 * - Letter spacing: at least 0.12× font size
 * - Word spacing: at least 0.16× font size
 */
const SPACING_CSS = `
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
`;

const PARAGRAPH_SPACING_CSS = `
  margin-bottom: 2em !important;
`;

function hasOverflow(el: Element): boolean {
  return el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2;
}

function clipsContent(el: Element): boolean {
  const style = getComputedStyle(el);
  return (
    style.overflow === "hidden" || style.overflowX === "hidden" || style.overflowY === "hidden"
  );
}

function hasDirectText(el: Element): boolean {
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim().length > 0) {
      return true;
    }
  }
  return false;
}

export function auditTextSpacing(): AuditOutput<TextSpacingData[]> {
  const issues: Issue[] = [];
  const data: TextSpacingData[] = [];

  // Find containers with overflow:hidden that contain text
  const containers = queryAll("*");
  const clippingContainers: Element[] = [];

  for (const el of containers) {
    if (isBookmarkletOverlay(el)) continue;
    if (!isElementVisible(el)) continue;
    if (!clipsContent(el)) continue;

    // Only check elements that are not tiny (likely icons)
    const rect = el.getBoundingClientRect();
    if (rect.width < 20 || rect.height < 10) continue;

    // Must have text content
    const text = (el.textContent ?? "").trim();
    if (text.length < 2) continue;

    clippingContainers.push(el);
  }

  // Record overflow state BEFORE applying spacing
  const overflowBefore = new Map<Element, boolean>();
  for (const el of clippingContainers) {
    overflowBefore.set(el, hasOverflow(el));
  }

  // Apply WCAG 1.4.12 text spacing
  const styleId = "__a11y_text_spacing_test__";
  let styleEl = document.getElementById(styleId);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.textContent = `
      * { ${SPACING_CSS} }
      p, [role="paragraph"] { ${PARAGRAPH_SPACING_CSS} }
    `;
    document.head.appendChild(styleEl);
  }

  // Check for content loss after spacing is applied
  for (const el of clippingContainers) {
    const overflowsBefore = overflowBefore.get(el) ?? false;
    const overflowsAfter = hasOverflow(el);
    const clips = clipsContent(el);
    const selector = uniqueSelector(el);
    const text = (el.textContent ?? "").trim().slice(0, 60);

    const entry: TextSpacingData = {
      selector,
      tagName: el.tagName.toLowerCase(),
      overflowsBefore: overflowsBefore,
      overflowsAfter,
      clipsContent: clips,
      text,
    };
    data.push(entry);

    // Content overflows AFTER spacing change and container clips → content loss
    if (!overflowsBefore && overflowsAfter && clips) {
      issues.push(
        createIssue("error", `Content clipped when text spacing is increased.`, {
          selector,
          html: truncatedHtml(el),
          wcag: "1.4.12",
          suggestion:
            "Avoid fixed heights with overflow:hidden on text containers. Use min-height or allow overflow.",
          data: { tagName: entry.tagName },
        }),
      );
    } else if (overflowsAfter && clips) {
      // Was already overflowing before
      issues.push(
        createIssue("warning", `Container clips overflow both before and after spacing change.`, {
          selector,
          html: truncatedHtml(el),
          wcag: "1.4.12",
          data: { tagName: entry.tagName },
        }),
      );
    }

    if (data.length >= 200) {
      issues.push(createIssue("info", "Stopped after 200 containers. Page may have more."));
      break;
    }
  }

  // Keep the stylesheet applied so users can see the spacing changes.
  // It will be cleaned up when overlays are cleared (see TextSpacingRenderer).

  // Also check for text containers that use fixed line-height in px
  const textElements = queryAll("p, li, td, th, dd, blockquote, figcaption");
  let fixedLineHeightCount = 0;
  for (const el of textElements) {
    if (isBookmarkletOverlay(el)) continue;
    if (!isElementVisible(el)) continue;
    if (!hasDirectText(el)) continue;

    const style = getComputedStyle(el);
    const lineHeight = style.lineHeight;
    const fontSize = Number.parseFloat(style.fontSize);

    // If line-height is in px and less than 1.5x font size
    if (lineHeight.endsWith("px")) {
      const lhPx = Number.parseFloat(lineHeight);
      if (lhPx < fontSize * 1.5) {
        fixedLineHeightCount++;
        if (fixedLineHeightCount <= 5) {
          issues.push(
            createIssue(
              "warning",
              `Line height (${lineHeight}) is less than 1.5× font size (${fontSize}px).`,
              {
                selector: uniqueSelector(el),
                html: truncatedHtml(el),
                wcag: "1.4.12",
                suggestion: "Use line-height: 1.5 or greater relative to font size.",
                data: { lineHeight, fontSize },
              },
            ),
          );
        }
      }
    }
  }

  if (fixedLineHeightCount > 5) {
    issues.push(
      createIssue(
        "warning",
        `${fixedLineHeightCount - 5} more elements with tight line-height not shown.`,
      ),
    );
  }

  if (data.length === 0 && fixedLineHeightCount === 0) {
    issues.push(
      createIssue(
        "pass",
        "No text spacing issues detected. Content appears resilient to WCAG 1.4.12 spacing changes.",
        { wcag: "1.4.12" },
      ),
    );
  }

  return { issues, data };
}
