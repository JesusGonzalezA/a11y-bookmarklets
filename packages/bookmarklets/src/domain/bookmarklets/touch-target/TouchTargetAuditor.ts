import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import {
  getAccessibleName,
  isBookmarkletOverlay,
  isElementVisible,
} from "../shared/accessibility.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { TouchTargetData } from "./types.js";
import { TARGET_SIZE_AA, TARGET_SIZE_AAA } from "./types.js";

const INTERACTIVE_SELECTOR =
  'a[href], button, input:not([type="hidden"]), select, textarea, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="tab"], [role="menuitem"], [role="switch"], [role="option"], summary, [tabindex]:not([tabindex="-1"])';

export function auditTouchTargets(): AuditOutput<TouchTargetData[]> {
  const issues: Issue[] = [];
  const data: TouchTargetData[] = [];

  const elements = queryAll(INTERACTIVE_SELECTOR);

  for (const el of elements) {
    if (isBookmarkletOverlay(el)) continue;
    if (!isElementVisible(el)) continue;

    const rect = el.getBoundingClientRect();
    const width = Math.round(rect.width * 100) / 100;
    const height = Math.round(rect.height * 100) / 100;

    // Skip elements with zero dimensions (likely hidden)
    if (width === 0 || height === 0) continue;

    const selector = uniqueSelector(el);
    const label =
      getAccessibleName(el) ||
      (el.textContent ?? "").trim().slice(0, 30) ||
      el.tagName.toLowerCase();
    const passesAA = width >= TARGET_SIZE_AA && height >= TARGET_SIZE_AA;
    const passesAAA = width >= TARGET_SIZE_AAA && height >= TARGET_SIZE_AAA;

    const entry: TouchTargetData = {
      selector,
      tagName: el.tagName.toLowerCase(),
      width,
      height,
      label,
      passesAA,
      passesAAA,
    };
    data.push(entry);

    if (!passesAA) {
      issues.push(
        createIssue(
          "error",
          `Touch target too small: ${width}×${height}px (minimum ${TARGET_SIZE_AA}×${TARGET_SIZE_AA}px). "${label}"`,
          {
            selector,
            html: truncatedHtml(el),
            wcag: "2.5.8",
            suggestion: `Increase the clickable area to at least ${TARGET_SIZE_AA}×${TARGET_SIZE_AA} CSS pixels. Use padding or min-width/min-height.`,
            data: { width, height, required: TARGET_SIZE_AA },
          },
        ),
      );
    } else if (!passesAAA) {
      issues.push(
        createIssue(
          "warning",
          `Touch target ${width}×${height}px passes AA but fails AAA (${TARGET_SIZE_AAA}×${TARGET_SIZE_AAA}px). "${label}"`,
          {
            selector,
            html: truncatedHtml(el),
            wcag: "2.5.5",
            data: { width, height, required: TARGET_SIZE_AAA },
          },
        ),
      );
    }

    if (data.length >= 300) {
      issues.push(
        createIssue("info", "Stopped after 300 interactive elements. Page may have more."),
      );
      break;
    }
  }

  if (data.length === 0) {
    issues.push(createIssue("info", "No interactive elements found on this page."));
  } else {
    const failCount = data.filter((d) => !d.passesAA).length;
    if (failCount === 0) {
      issues.push(
        createIssue(
          "pass",
          `All ${data.length} interactive elements meet the ${TARGET_SIZE_AA}×${TARGET_SIZE_AA}px minimum.`,
          {
            wcag: "2.5.8",
          },
        ),
      );
    }
  }

  return { issues, data };
}
