import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay } from "../shared/accessibility.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { NewWindowLinkData } from "./types.js";

const NEW_WINDOW_PATTERN =
  /new (window|tab)|nueva (ventana|pestaña)|opens? (in|a)|se abre|external link/i;

function findWarningSource(el: Element): string | null {
  // Check aria-label
  const ariaLabel = el.getAttribute("aria-label") ?? "";
  if (NEW_WINDOW_PATTERN.test(ariaLabel)) return "aria-label";

  // Check title
  const title = el.getAttribute("title") ?? "";
  if (NEW_WINDOW_PATTERN.test(title)) return "title";

  // Check sr-only / visually-hidden text
  const srOnly = el.querySelector(".sr-only, .visually-hidden");
  if (srOnly && NEW_WINDOW_PATTERN.test(srOnly.textContent ?? "")) return "sr-only text";

  // Check nested element with aria-label (e.g., icon)
  const nestedLabeled = el.querySelector("[aria-label]");
  if (nestedLabeled && NEW_WINDOW_PATTERN.test(nestedLabeled.getAttribute("aria-label") ?? ""))
    return "nested aria-label";

  // Check visible text content
  if (NEW_WINDOW_PATTERN.test(el.textContent ?? "")) return "visible text";

  return null;
}

export function auditNewWindowLinks(): AuditOutput<NewWindowLinkData[]> {
  const links = queryAll('a[target="_blank"], a[target="_new"]');
  const issues: Issue[] = [];
  const data: NewWindowLinkData[] = [];

  for (const el of links) {
    if (isBookmarkletOverlay(el)) continue;

    const selector = uniqueSelector(el);
    const text = el.textContent?.trim() ?? el.getAttribute("aria-label") ?? "";
    const href = el.getAttribute("href") ?? "";
    const rel = el.getAttribute("rel") ?? "";
    const warningSource = findWarningSource(el);
    const hasWarning = warningSource !== null;
    const hasNoopener = rel.includes("noopener");

    data.push({ selector, text, href, hasWarning, hasNoopener, warningSource });

    if (!hasWarning) {
      issues.push(
        createIssue("warning", `Link "${text || href}" opens new window without warning.`, {
          selector,
          html: truncatedHtml(el),
          wcag: "3.2.5",
          suggestion:
            'Add "(opens in new tab)" text, aria-label, or sr-only span indicating new window.',
          data: { text, href },
        }),
      );
    } else {
      issues.push(
        createIssue("pass", `Link "${text}" warns about new window via ${warningSource}.`, {
          selector,
          html: truncatedHtml(el),
          wcag: "3.2.5",
          data: { text, href, warningSource },
        }),
      );
    }

    if (!hasNoopener) {
      issues.push(
        createIssue("info", `Link missing rel="noopener" (security best practice).`, {
          selector,
          html: truncatedHtml(el),
          suggestion: 'Add rel="noopener noreferrer" to target="_blank" links.',
          data: { href, rel },
        }),
      );
    }
  }

  if (links.length === 0) {
    issues.push(
      createIssue("pass", "No links opening in new windows/tabs found.", {
        wcag: "3.2.5",
      }),
    );
  }

  return { issues, data };
}
