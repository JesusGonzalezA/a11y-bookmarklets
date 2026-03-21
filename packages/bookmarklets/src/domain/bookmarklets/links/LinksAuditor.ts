import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay } from "../shared/accessibility.js";
import { createIssue, noElementsIssue } from "../shared/issue-helpers.js";
import type { LinkData } from "./types.js";

const GENERIC_LINK_TEXT =
  /^(click here|read more|more|learn more|here|link|leer más|más|ver más|aquí|saber más|info|details|continue|see more|view|go)$/i;

const NEW_WINDOW_INDICATOR =
  /new (window|tab)|nueva (ventana|pestaña)|opens? (in|a)|se abre|external/i;

function getEffectiveLinkText(el: Element): string {
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel?.trim()) return ariaLabel.trim();

  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy) {
    const name = labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
      .join(" ")
      .trim();
    if (name) return name;
  }

  // Check for img alt inside the link
  const img = el.querySelector("img[alt]");
  if (img) {
    const alt = img.getAttribute("alt")?.trim();
    if (alt) return alt;
  }

  return el.textContent?.trim() ?? "";
}

function hasNewWindowIndication(el: Element): boolean {
  const ariaLabel = el.getAttribute("aria-label") ?? "";
  const title = el.getAttribute("title") ?? "";
  const srOnly = el.querySelector(".sr-only, .visually-hidden")?.textContent ?? "";
  const combined = `${ariaLabel} ${title} ${srOnly} ${el.textContent ?? ""}`;
  return NEW_WINDOW_INDICATOR.test(combined);
}

export function auditLinks(): AuditOutput<LinkData[]> {
  const linkElements = queryAll('a, [role="link"]');
  const issues: Issue[] = [];
  const data: LinkData[] = [];

  for (const el of linkElements) {
    if (isBookmarkletOverlay(el)) continue;

    const selector = uniqueSelector(el);
    const text = getEffectiveLinkText(el);
    const href = el.getAttribute("href") ?? "";
    const target = el.getAttribute("target");
    const isEmpty = !text;
    const isGeneric = GENERIC_LINK_TEXT.test(text);
    const opensNewWindow = target === "_blank" || target === "_new";
    const hasNewWindowWarning = opensNewWindow && hasNewWindowIndication(el);
    const isFauxLink =
      href === "#" || href === "javascript:void(0)" || href.startsWith("javascript:");

    data.push({
      selector,
      text,
      href,
      isGeneric,
      isEmpty,
      opensNewWindow,
      hasNewWindowWarning,
      isFauxLink,
    });

    if (isEmpty) {
      issues.push(
        createIssue("error", "Link has no accessible text.", {
          selector,
          html: truncatedHtml(el),
          wcag: "2.4.4",
          suggestion: "Add visible text, aria-label, or an img with alt text inside the link.",
          data: { href },
        }),
      );
    } else if (isGeneric) {
      issues.push(
        createIssue("warning", `Link has generic text: "${text}".`, {
          selector,
          html: truncatedHtml(el),
          wcag: "2.4.4",
          suggestion: "Use descriptive text that conveys the link's destination or purpose.",
          data: { text, href },
        }),
      );
    } else {
      issues.push(
        createIssue("pass", `Link: "${text}"`, {
          selector,
          html: truncatedHtml(el),
          wcag: "2.4.4",
          data: { text, href },
        }),
      );
    }

    if (isFauxLink) {
      issues.push(
        createIssue("warning", `Link uses "${href}" — not a real destination.`, {
          selector,
          html: truncatedHtml(el),
          wcag: "2.1.1",
          suggestion: "Use a <button> for actions, or provide a real href for navigation.",
          data: { href },
        }),
      );
    }

    if (!el.hasAttribute("href") && el.tagName.toLowerCase() === "a") {
      issues.push(
        createIssue("warning", "Anchor element without href is not keyboard focusable.", {
          selector,
          html: truncatedHtml(el),
          wcag: "2.1.1",
          suggestion: 'Add an href attribute or use tabindex="0" with keyboard event handlers.',
        }),
      );
    }

    if (opensNewWindow && !hasNewWindowWarning) {
      issues.push(
        createIssue("warning", `Link opens new window but doesn't indicate it: "${text}".`, {
          selector,
          html: truncatedHtml(el),
          wcag: "3.2.5",
          suggestion: 'Add "(opens in new tab)" text or an aria-label indicating new window.',
          data: { text, target },
        }),
      );
    }
  }

  if (linkElements.length === 0) {
    issues.push(noElementsIssue("info", "links", "2.4.4"));
  }

  return { issues, data };
}
