import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay } from "../shared/accessibility.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { HiddenContentData, HidingMethod } from "./types.js";

const FOCUSABLE_SELECTOR =
  'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

function getComputedHidingMethod(el: Element): HidingMethod | null {
  const style = getComputedStyle(el);
  if (style.display === "none") return "display-none";
  if (style.visibility === "hidden") return "visibility-hidden";
  if (style.opacity === "0") return "opacity-0";

  // sr-only / clip-rect patterns
  const clip = style.getPropertyValue("clip");
  const clipPath = style.getPropertyValue("clip-path");
  if (clip === "rect(0px, 0px, 0px, 0px)" || clipPath === "inset(50%)") return "clip-rect";

  // Offscreen positioning
  const left = Number.parseFloat(style.left);
  const top = Number.parseFloat(style.top);
  if (
    (style.position === "absolute" || style.position === "fixed") &&
    (left < -9000 || top < -9000)
  )
    return "offscreen";

  // Common sr-only pattern: overflow hidden + dimensions
  const w = Number.parseFloat(style.width);
  const h = Number.parseFloat(style.height);
  if (style.overflow === "hidden" && w <= 1 && h <= 1) return "sr-only";

  return null;
}

function hasFocusableDescendants(el: Element): boolean {
  return el.querySelectorAll(FOCUSABLE_SELECTOR).length > 0;
}

export function auditHiddenContent(): AuditOutput<HiddenContentData[]> {
  const issues: Issue[] = [];
  const data: HiddenContentData[] = [];
  const seen = new Set<Element>();

  // 1. aria-hidden="true" elements
  for (const el of queryAll('[aria-hidden="true"]')) {
    if (isBookmarkletOverlay(el) || seen.has(el)) continue;
    seen.add(el);
    const hasFocusable = hasFocusableDescendants(el);
    const entry: HiddenContentData = {
      selector: uniqueSelector(el),
      tagName: el.tagName.toLowerCase(),
      method: "aria-hidden",
      hasFocusable,
      text: (el.textContent ?? "").trim().slice(0, 80),
    };
    data.push(entry);

    if (hasFocusable) {
      issues.push(
        createIssue("error", `aria-hidden="true" hides focusable content.`, {
          selector: entry.selector,
          html: truncatedHtml(el),
          wcag: "4.1.2",
          suggestion: 'Remove aria-hidden or set tabindex="-1" on focusable descendants.',
          data: { method: "aria-hidden" },
        }),
      );
    } else {
      issues.push(
        createIssue("info", `aria-hidden="true" hides content from assistive tech.`, {
          selector: entry.selector,
          html: truncatedHtml(el),
          wcag: "4.1.2",
          data: { method: "aria-hidden" },
        }),
      );
    }
  }

  // 2. [hidden] attribute
  for (const el of queryAll("[hidden]")) {
    if (isBookmarkletOverlay(el) || seen.has(el)) continue;
    seen.add(el);
    const entry: HiddenContentData = {
      selector: uniqueSelector(el),
      tagName: el.tagName.toLowerCase(),
      method: "hidden-attr",
      hasFocusable: hasFocusableDescendants(el),
      text: (el.textContent ?? "").trim().slice(0, 80),
    };
    data.push(entry);
    issues.push(
      createIssue("info", `Element hidden via [hidden] attribute.`, {
        selector: entry.selector,
        html: truncatedHtml(el),
        wcag: "1.3.2",
        data: { method: "hidden-attr" },
      }),
    );
  }

  // 3. CSS-hidden elements (display:none, visibility:hidden, etc.)
  // We check common patterns: elements with significant text that are hidden via CSS.
  const allElements = queryAll("body *");
  for (const el of allElements) {
    if (isBookmarkletOverlay(el) || seen.has(el)) continue;
    if (el.getAttribute("aria-hidden") === "true" || el.hasAttribute("hidden")) continue;

    const method = getComputedHidingMethod(el);
    if (!method) continue;

    // Only report elements with meaningful content
    const text = (el.textContent ?? "").trim();
    if (text.length < 2) continue;

    // Skip children of already-hidden ancestors
    const parentHidden = el.closest('[hidden], [aria-hidden="true"]');
    if (parentHidden && parentHidden !== el) continue;

    seen.add(el);
    const hasFocusable =
      method === "sr-only" || method === "clip-rect" || method === "offscreen"
        ? false // These techniques are intentional AT-visible patterns
        : hasFocusableDescendants(el);

    const entry: HiddenContentData = {
      selector: uniqueSelector(el),
      tagName: el.tagName.toLowerCase(),
      method,
      hasFocusable,
      text: text.slice(0, 80),
    };
    data.push(entry);

    const severity = ["sr-only", "clip-rect", "offscreen"].includes(method)
      ? ("pass" as const)
      : ("info" as const);
    issues.push(
      createIssue(severity, `Content hidden via ${method}.`, {
        selector: entry.selector,
        html: truncatedHtml(el),
        wcag: "1.3.2",
        data: { method },
      }),
    );

    // Cap to avoid performance issues on large pages
    if (data.length >= 200) {
      issues.push(createIssue("info", "Stopped after 200 hidden elements. Page may contain more."));
      break;
    }
  }

  if (data.length === 0) {
    issues.push(createIssue("info", "No hidden content detected on this page."));
  }

  return { issues, data };
}
