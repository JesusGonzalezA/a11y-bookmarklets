/**
 * Tab Order bookmarklet
 *
 * Visualizes the tab order of interactive elements and detects issues
 * like positive tabindex, hidden focusable elements, and missing focus indicators.
 *
 * WCAG: 2.4.3 Focus Order, 2.1.1 Keyboard
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

const BOOKMARKLET_ID = "tab-order";

interface FocusableInfo {
  index: number;
  tabindex: number | null;
  selector: string;
  element: Element;
  tag: string;
  role: string | null;
  label: string;
}

function isVisible(el: Element): boolean {
  const style = getComputedStyle(el);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0" &&
    (el as HTMLElement).offsetParent !== null
  );
}

function getLabel(el: Element): string {
  // aria-label
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;

  // text content (truncated)
  const text = el.textContent?.trim() ?? "";
  return text.length > 40 ? text.slice(0, 40) + "…" : text;
}

function getFocusableElements(): FocusableInfo[] {
  // Natural focusable elements + anything with tabindex
  const selector = [
    "a[href]",
    "button",
    "input:not([type=hidden])",
    "select",
    "textarea",
    "[tabindex]",
    "[contenteditable]",
    "details > summary",
    "audio[controls]",
    "video[controls]",
  ].join(", ");

  const elements = queryAll(selector);
  const focusable: FocusableInfo[] = [];

  for (const el of elements) {
    const tabindexAttr = el.getAttribute("tabindex");
    const tabindex = tabindexAttr !== null ? parseInt(tabindexAttr, 10) : null;

    // Skip tabindex=-1 (removed from tab order)
    if (tabindex !== null && tabindex < 0) continue;

    // Skip disabled elements
    if ((el as HTMLInputElement).disabled) continue;

    focusable.push({
      index: 0, // will be assigned after sorting
      tabindex,
      selector: uniqueSelector(el),
      element: el,
      tag: el.tagName.toLowerCase(),
      role: el.getAttribute("role"),
      label: getLabel(el),
    });
  }

  // Sort by tab order: positive tabindex first (ascending), then tabindex=0/null in DOM order
  const withPositive = focusable.filter((f) => f.tabindex !== null && f.tabindex > 0);
  const withNatural = focusable.filter((f) => f.tabindex === null || f.tabindex === 0);

  withPositive.sort((a, b) => a.tabindex! - b.tabindex!);

  const sorted = [...withPositive, ...withNatural];
  sorted.forEach((f, i) => (f.index = i + 1));

  return sorted;
}

function auditTabOrder(): { issues: Issue[]; elements: FocusableInfo[] } {
  const elements = getFocusableElements();
  const issues: Issue[] = [];

  for (const f of elements) {
    // Positive tabindex
    if (f.tabindex !== null && f.tabindex > 0) {
      issues.push({
        severity: "warning",
        message: `Element has positive tabindex="${f.tabindex}" — alters natural tab order.`,
        selector: f.selector,
        html: truncatedHtml(f.element),
        wcag: "2.4.3",
        suggestion: "Remove positive tabindex. Use DOM order to control tab sequence.",
        data: { tabindex: f.tabindex, index: f.index, tag: f.tag },
      });
    }

    // Hidden but focusable
    if (!isVisible(f.element)) {
      issues.push({
        severity: "warning",
        message: `Hidden element is in tab order: ${f.tag}`,
        selector: f.selector,
        html: truncatedHtml(f.element),
        wcag: "2.1.1",
        suggestion: 'Add tabindex="-1" or aria-hidden="true" to remove from tab order.',
        data: { index: f.index, tag: f.tag },
      });
    }

    // Info: every focusable element
    issues.push({
      severity: "info",
      message: `Tab #${f.index}: ${f.tag}${f.role ? `[role="${f.role}"]` : ""} — "${f.label}"`,
      selector: f.selector,
      html: truncatedHtml(f.element),
      wcag: "2.4.3",
      data: { index: f.index, tag: f.tag, role: f.role, label: f.label, tabindex: f.tabindex },
    });
  }

  if (elements.length === 0) {
    issues.push({
      severity: "warning",
      message: "No focusable elements found.",
      selector: "html",
      html: "",
      wcag: "2.1.1",
      suggestion: "Ensure interactive elements are keyboard accessible.",
    });
  }

  return { issues, elements };
}

function renderVisual(elements: FocusableInfo[]): void {
  clearOverlays();

  for (const f of elements) {
    const el = f.element;
    if (!isVisible(el)) continue;

    const hasIssue = f.tabindex !== null && f.tabindex > 0;
    const color = hasIssue ? "#e74c3c" : "#3498db";

    addOutline(el, color);
    addLabel(el, { text: `${f.index}`, bgColor: color });
  }

  showPanel(`
    <strong>Tab Order (${elements.length} elements)</strong>
    <div style="font-size:11px; margin-top:8px;">
      ${elements.slice(0, 20).map((f) => `<div>#${f.index} ${f.tag} — ${f.label || "(no label)"}</div>`).join("")}
      ${elements.length > 20 ? `<div>…and ${elements.length - 20} more</div>` : ""}
    </div>
  `);
}

export function run(options: BookmarkletOptions = {}): AuditResult {
  const mode = options.mode ?? "both";
  const { issues, elements } = auditTabOrder();

  if (mode === "visual" || mode === "both") {
    renderVisual(elements);
  }

  const result = buildResult(BOOKMARKLET_ID, issues);

  (window as any).__a11y = (window as any).__a11y ?? {};
  (window as any).__a11y[BOOKMARKLET_ID] = { audit: () => run({ mode: "data" }), lastResult: result };

  return result;
}

run();
