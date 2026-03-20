import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { getElementLabel, isElementVisible } from "../shared/accessibility.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { FocusableData } from "./types.js";
import { FOCUSABLE_SELECTOR } from "./types.js";

export function auditTabOrder(): AuditOutput<FocusableData[]> {
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
      label: getElementLabel(el),
      visible: isElementVisible(el),
    });
  }

  // Sort: positive tabindex first (ascending), then natural DOM order
  const withPositive = focusable.filter((f) => f.tabindex !== null && f.tabindex > 0);
  const withNatural = focusable.filter((f) => f.tabindex === null || f.tabindex === 0);
  withPositive.sort((a, b) => (a.tabindex ?? 0) - (b.tabindex ?? 0));

  const sorted = [...withPositive, ...withNatural];
  for (let i = 0; i < sorted.length; i++) {
    sorted[i].index = i + 1;
  }

  for (const f of sorted) {
    if (f.tabindex !== null && f.tabindex > 0) {
      issues.push(
        createIssue(
          "warning",
          `Element has positive tabindex="${f.tabindex}" — alters natural tab order.`,
          {
            selector: f.selector,
            html: truncatedHtml(document.querySelector(f.selector) as Element),
            wcag: "2.4.3",
            suggestion: "Remove positive tabindex. Use DOM order to control tab sequence.",
            data: { tabindex: f.tabindex, index: f.index, tag: f.tag },
          },
        ),
      );
    }

    if (!f.visible) {
      issues.push(
        createIssue("warning", `Hidden element is in tab order: ${f.tag}`, {
          selector: f.selector,
          html: truncatedHtml(document.querySelector(f.selector) as Element),
          wcag: "2.1.1",
          suggestion: 'Add tabindex="-1" or aria-hidden="true" to remove from tab order.',
          data: { index: f.index, tag: f.tag },
        }),
      );
    }

    issues.push(
      createIssue(
        "info",
        `Tab #${f.index}: ${f.tag}${f.role ? `[role="${f.role}"]` : ""} — "${f.label}"`,
        {
          selector: f.selector,
          html: truncatedHtml(document.querySelector(f.selector) as Element),
          wcag: "2.4.3",
          data: { index: f.index, tag: f.tag, role: f.role, label: f.label, tabindex: f.tabindex },
        },
      ),
    );
  }

  if (sorted.length === 0) {
    issues.push(
      createIssue("warning", "No focusable elements found.", {
        wcag: "2.1.1",
        suggestion: "Ensure interactive elements are keyboard accessible.",
      }),
    );
  }

  return { issues, data: sorted };
}
