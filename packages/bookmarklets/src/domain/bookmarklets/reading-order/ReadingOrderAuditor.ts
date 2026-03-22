import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay, isElementVisible } from "../shared/accessibility.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { ReadingOrderData, ReadingOrderResult } from "./types.js";

const CONTENT_SELECTOR =
  "p, h1, h2, h3, h4, h5, h6, li, td, th, dt, dd, blockquote, figcaption, label, legend, summary, a, button, img, input, select, textarea";

interface ElementPosition {
  el: Element;
  domIndex: number;
  top: number;
  left: number;
}

function getVisibleContentElements(): ElementPosition[] {
  const elements = queryAll(CONTENT_SELECTOR);
  const result: ElementPosition[] = [];

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (isBookmarkletOverlay(el)) continue;
    if (!isElementVisible(el)) continue;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    result.push({
      el,
      domIndex: i,
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    });
  }

  return result;
}

function computeKendallTau(domOrder: number[], visualOrder: number[]): number {
  const n = domOrder.length;
  if (n < 2) return 1;

  let concordant = 0;
  let discordant = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const domDiff = domOrder[i] - domOrder[j];
      const visDiff = visualOrder[i] - visualOrder[j];
      const product = domDiff * visDiff;
      if (product > 0) concordant++;
      else if (product < 0) discordant++;
    }
  }

  const pairs = (n * (n - 1)) / 2;
  return (concordant - discordant) / pairs;
}

export function auditReadingOrder(): AuditOutput<ReadingOrderResult> {
  const positions = getVisibleContentElements();
  const issues: Issue[] = [];

  if (positions.length === 0) {
    issues.push(
      createIssue("info", "No visible content elements found to analyze reading order.", {
        wcag: "1.3.2",
      }),
    );
    return { issues, data: { items: [], kendallTau: 1, totalElements: 0 } };
  }

  // Visual order: sort by top, then left (reading flow: top-to-bottom, left-to-right)
  const visualSorted = [...positions].sort((a, b) => {
    const rowThreshold = 10; // Elements within 10px vertically are considered same row
    if (Math.abs(a.top - b.top) <= rowThreshold) return a.left - b.left;
    return a.top - b.top;
  });

  // Build index maps
  const domIndices = positions.map((_, i) => i);
  const visualIndexMap = new Map<Element, number>();
  for (let i = 0; i < visualSorted.length; i++) {
    visualIndexMap.set(visualSorted[i].el, i);
  }
  const visualIndices = positions.map((p) => visualIndexMap.get(p.el) ?? 0);

  const tau = computeKendallTau(domIndices, visualIndices);
  const displaced: ReadingOrderData[] = [];

  // Find elements with significant displacement
  for (let domIdx = 0; domIdx < positions.length; domIdx++) {
    const pos = positions[domIdx];
    const visIdx = visualIndexMap.get(pos.el) ?? domIdx;
    const displacement = Math.abs(domIdx - visIdx);

    if (displacement < 3) continue; // Skip minor displacements

    const style = getComputedStyle(pos.el);
    const cssOrder = style.order !== "0" ? style.order : null;
    const positionVal = style.position;
    const text = (pos.el.textContent?.trim() ?? "").slice(0, 60);
    const selector = uniqueSelector(pos.el);

    const item: ReadingOrderData = {
      selector,
      domIndex: domIdx,
      visualIndex: visIdx,
      tag: pos.el.tagName.toLowerCase(),
      text,
      cssOrder,
      position: positionVal,
      displaced: true,
    };
    displaced.push(item);

    const reason = cssOrder
      ? `CSS order: ${cssOrder}`
      : positionVal === "absolute" || positionVal === "fixed"
        ? `position: ${positionVal}`
        : "layout reflow";

    issues.push(
      createIssue(
        "warning",
        `DOM position #${domIdx + 1} appears visually at #${visIdx + 1} (${reason})`,
        {
          selector,
          html: truncatedHtml(pos.el),
          wcag: "1.3.2",
          suggestion:
            "Ensure DOM order matches visual order, or verify that the reading sequence is still meaningful.",
          data: { domIndex: domIdx, visualIndex: visIdx, displacement, reason },
        },
      ),
    );
  }

  // Check for positive tabindex
  const positiveTabindex = queryAll("[tabindex]").filter((el) => {
    const val = parseInt(el.getAttribute("tabindex") ?? "0", 10);
    return val > 0;
  });

  for (const el of positiveTabindex) {
    const val = el.getAttribute("tabindex");
    issues.push(
      createIssue("warning", `Positive tabindex="${val}" alters focus order.`, {
        selector: uniqueSelector(el),
        html: truncatedHtml(el),
        wcag: "2.4.3",
        suggestion: "Remove positive tabindex. Use DOM order to control tab sequence.",
        data: { tabindex: val },
      }),
    );
  }

  // Summary issue
  if (tau >= 0.7) {
    issues.push(
      createIssue(
        "pass",
        `Reading order correlation is good (Kendall τ = ${tau.toFixed(2)}).`,
        {
          wcag: "1.3.2",
          data: { kendallTau: tau, totalElements: positions.length, displacedCount: displaced.length },
        },
      ),
    );
  } else if (tau >= 0.3) {
    issues.push(
      createIssue(
        "warning",
        `Reading order has moderate discrepancies (Kendall τ = ${tau.toFixed(2)}).`,
        {
          wcag: "1.3.2",
          suggestion: "Review CSS ordering (flexbox order, grid placement, absolute positioning) to align DOM and visual order.",
          data: { kendallTau: tau, totalElements: positions.length, displacedCount: displaced.length },
        },
      ),
    );
  } else {
    issues.push(
      createIssue(
        "error",
        `Reading order significantly diverges from visual order (Kendall τ = ${tau.toFixed(2)}).`,
        {
          wcag: "1.3.2",
          suggestion: "Restructure the DOM to match visual presentation order, or ensure the reading sequence is still meaningful.",
          data: { kendallTau: tau, totalElements: positions.length, displacedCount: displaced.length },
        },
      ),
    );
  }

  // Check CSS order usage in flex/grid containers
  const reorderedContainers = queryAll("[style*='order'], *").filter((el) => {
    const style = getComputedStyle(el);
    return style.order !== "0" && style.order !== "";
  });

  if (reorderedContainers.length > 0) {
    issues.push(
      createIssue(
        "info",
        `${reorderedContainers.length} element(s) use CSS order property.`,
        {
          wcag: "1.3.2",
          data: { cssOrderCount: reorderedContainers.length },
        },
      ),
    );
  }

  return {
    issues,
    data: {
      items: displaced,
      kendallTau: tau,
      totalElements: positions.length,
    },
  };
}
