/**
 * Tab Order bookmarklet — visualizes tab order and detects keyboard issues.
 *
 * WCAG: 2.4.3 Focus Order, 2.1.1 Keyboard
 */

import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { queryAll, uniqueSelector, truncatedHtml } from "../../infrastructure/dom/DomUtils.js";
import { addLabel, addOutline, showPanel } from "../../infrastructure/overlay/OverlayManager.js";

interface FocusableData {
  index: number;
  tabindex: number | null;
  selector: string;
  tag: string;
  role: string | null;
  label: string;
  visible: boolean;
}

const FOCUSABLE_SELECTOR = [
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
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;

  const text = el.textContent?.trim() ?? "";
  return text.length > 40 ? text.slice(0, 40) + "…" : text;
}

export class TabOrderBookmarklet extends Bookmarklet<FocusableData[]> {
  readonly id = "tab-order";
  readonly name = "Tab Order";
  readonly description =
    "Visualize and audit keyboard tab order: positive tabindex, hidden focusable elements.";
  readonly wcagCriteria = ["2.4.3", "2.1.1"];

  protected audit(): AuditOutput<FocusableData[]> {
    const elements = queryAll(FOCUSABLE_SELECTOR);
    const issues: Issue[] = [];
    const focusable: FocusableData[] = [];

    for (const el of elements) {
      const tabindexAttr = el.getAttribute("tabindex");
      const tabindex = tabindexAttr !== null ? parseInt(tabindexAttr, 10) : null;

      if (tabindex !== null && tabindex < 0) continue;
      if ((el as HTMLInputElement).disabled) continue;

      focusable.push({
        index: 0,
        tabindex,
        selector: uniqueSelector(el),
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute("role"),
        label: getLabel(el),
        visible: isVisible(el),
      });
    }

    // Sort: positive tabindex first (ascending), then natural DOM order
    const withPositive = focusable.filter((f) => f.tabindex !== null && f.tabindex > 0);
    const withNatural = focusable.filter((f) => f.tabindex === null || f.tabindex === 0);
    withPositive.sort((a, b) => a.tabindex! - b.tabindex!);

    const sorted = [...withPositive, ...withNatural];
    sorted.forEach((f, i) => (f.index = i + 1));

    for (const f of sorted) {
      if (f.tabindex !== null && f.tabindex > 0) {
        issues.push({
          severity: "warning",
          message: `Element has positive tabindex="${f.tabindex}" — alters natural tab order.`,
          selector: f.selector,
          html: truncatedHtml(document.querySelector(f.selector)!),
          wcag: "2.4.3",
          suggestion: "Remove positive tabindex. Use DOM order to control tab sequence.",
          data: { tabindex: f.tabindex, index: f.index, tag: f.tag },
        });
      }

      if (!f.visible) {
        issues.push({
          severity: "warning",
          message: `Hidden element is in tab order: ${f.tag}`,
          selector: f.selector,
          html: truncatedHtml(document.querySelector(f.selector)!),
          wcag: "2.1.1",
          suggestion: 'Add tabindex="-1" or aria-hidden="true" to remove from tab order.',
          data: { index: f.index, tag: f.tag },
        });
      }

      issues.push({
        severity: "info",
        message: `Tab #${f.index}: ${f.tag}${f.role ? `[role="${f.role}"]` : ""} — "${f.label}"`,
        selector: f.selector,
        html: truncatedHtml(document.querySelector(f.selector)!),
        wcag: "2.4.3",
        data: { index: f.index, tag: f.tag, role: f.role, label: f.label, tabindex: f.tabindex },
      });
    }

    if (sorted.length === 0) {
      issues.push({
        severity: "warning",
        message: "No focusable elements found.",
        selector: "html",
        html: "",
        wcag: "2.1.1",
        suggestion: "Ensure interactive elements are keyboard accessible.",
      });
    }

    return { issues, data: sorted };
  }

  protected render(elements: FocusableData[]): void {
    for (const f of elements) {
      if (!f.visible) continue;

      const el = document.querySelector(f.selector);
      if (!el) continue;

      const hasIssue = f.tabindex !== null && f.tabindex > 0;
      const color = hasIssue ? "#e74c3c" : "#3498db";

      addOutline(el, color);
      addLabel(el, { text: `${f.index}`, bgColor: color });
    }

    showPanel(`
      <strong>Tab Order (${elements.length} elements)</strong>
      <div style="font-size:11px; margin-top:8px;">
        ${elements
          .slice(0, 20)
          .map((f) => `<div>#${f.index} ${f.tag} — ${f.label || "(no label)"}</div>`)
          .join("")}
        ${elements.length > 20 ? `<div>…and ${elements.length - 20} more</div>` : ""}
      </div>
    `);
  }
}
