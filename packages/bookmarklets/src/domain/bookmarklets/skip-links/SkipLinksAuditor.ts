import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay } from "../shared/accessibility.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { SkipLinkData } from "./types.js";

const SKIP_LINK_TEXT = /skip|saltar|ir al|jump to|go to.*(main|content|nav|contenido|principal)/i;

const FOCUSABLE_SELECTOR =
  'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]';

export function auditSkipLinks(): AuditOutput<SkipLinkData[]> {
  const issues: Issue[] = [];
  const data: SkipLinkData[] = [];

  // Find skip links: anchor links at the beginning of the DOM
  const allLinks = queryAll('a[href^="#"]');
  const skipCandidates = allLinks.filter((el) => {
    if (isBookmarkletOverlay(el)) return false;
    const text = el.textContent?.trim() ?? "";
    return SKIP_LINK_TEXT.test(text);
  });

  // Also check the first few links (even without skip text pattern)
  const firstLinks = allLinks.slice(0, 5).filter((el) => {
    if (isBookmarkletOverlay(el)) return false;
    const href = el.getAttribute("href") ?? "";
    return href.startsWith("#") && href.length > 1;
  });

  const candidates = [...new Set([...skipCandidates, ...firstLinks])];

  // Get first focusable element
  const allFocusable = queryAll(FOCUSABLE_SELECTOR).filter((el) => !isBookmarkletOverlay(el));
  const firstFocusable = allFocusable[0] ?? null;

  for (const el of candidates) {
    const href = el.getAttribute("href") ?? "";
    const targetId = href.slice(1);
    const text = el.textContent?.trim() ?? "";
    const selector = uniqueSelector(el);
    const targetExists = !!document.getElementById(targetId);
    const isFirstFocusable = firstFocusable === el;

    // Check visibility: visible or visible on focus
    const style = getComputedStyle(el as HTMLElement);
    const isHidden = style.display === "none" || style.visibility === "hidden";
    const hasVisuallyHiddenClass =
      (el as HTMLElement).classList.contains("sr-only") ||
      (el as HTMLElement).classList.contains("visually-hidden") ||
      style.position === "absolute";
    const isVisibleOnFocus = isHidden ? false : hasVisuallyHiddenClass || style.opacity !== "0";

    data.push({ selector, text, targetId, targetExists, isVisibleOnFocus, isFirstFocusable });

    if (SKIP_LINK_TEXT.test(text)) {
      if (!targetExists) {
        issues.push(
          createIssue(
            "error",
            `Skip link "${text}" points to "#${targetId}" but target doesn't exist.`,
            {
              selector,
              html: truncatedHtml(el),
              wcag: "2.4.1",
              suggestion: `Add id="${targetId}" to the main content container.`,
              data: { text, targetId },
            },
          ),
        );
      } else {
        issues.push(
          createIssue("pass", `Skip link found: "${text}" → #${targetId}`, {
            selector,
            html: truncatedHtml(el),
            wcag: "2.4.1",
            data: { text, targetId, isFirstFocusable },
          }),
        );
      }

      if (!isFirstFocusable) {
        issues.push(
          createIssue("warning", `Skip link "${text}" is not the first focusable element.`, {
            selector,
            html: truncatedHtml(el),
            wcag: "2.4.1",
            suggestion: "Move the skip link to be the very first focusable element in the DOM.",
          }),
        );
      }
    }
  }

  if (skipCandidates.length === 0) {
    issues.push(
      createIssue("warning", "No skip navigation link found.", {
        wcag: "2.4.1",
        suggestion:
          'Add a "Skip to main content" link as the first element in the page, pointing to the main content area.',
      }),
    );
  }

  return { issues, data };
}
