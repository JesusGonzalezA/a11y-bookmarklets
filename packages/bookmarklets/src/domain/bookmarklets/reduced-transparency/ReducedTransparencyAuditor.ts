import {
  countInaccessibleStylesheets,
  findMediaRules,
} from "../../../infrastructure/css/CssMediaQueryUtils.js";
import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay } from "../shared/accessibility.js";
import {
  createIssue,
  inaccessibleSheetsIssue,
  mediaQueryFoundIssue,
  truncationIssue,
} from "../shared/issue-helpers.js";
import type { ReducedTransparencyData, TransparentElement } from "./types.js";

const MAX_REPORTED = 40;

function parseAlpha(color: string): number | null {
  const rgbaMatch = color.match(/rgba?\(\s*[\d.]+[\s,]+[\d.]+[\s,]+[\d.]+[\s,/]+\s*([\d.]+)\s*\)/);
  if (rgbaMatch) return parseFloat(rgbaMatch[1]);

  const hslaMatch = color.match(
    /hsla?\(\s*[\d.]+[\s,]+[\d.%]+[\s,]+[\d.%]+[\s,/]+\s*([\d.]+)\s*\)/,
  );
  if (hslaMatch) return parseFloat(hslaMatch[1]);

  return null;
}

export function auditReducedTransparency(): AuditOutput<ReducedTransparencyData> {
  const issues: Issue[] = [];

  const mediaMatches = findMediaRules("prefers-reduced-transparency");
  const inaccessibleSheets = countInaccessibleStylesheets();

  const transparentElements: TransparentElement[] = [];
  const allElements = queryAll("*");

  for (const el of allElements) {
    if (isBookmarkletOverlay(el)) continue;

    const computed = getComputedStyle(el);
    const selector = uniqueSelector(el);

    // Check opacity < 1
    const opacity = parseFloat(computed.opacity);
    if (!Number.isNaN(opacity) && opacity < 1 && opacity > 0) {
      transparentElements.push({ selector, property: "opacity", value: String(opacity) });
      continue;
    }

    // Check background-color with alpha
    const bgColor = computed.backgroundColor;
    if (bgColor) {
      const alpha = parseAlpha(bgColor);
      if (alpha !== null && alpha < 1 && alpha > 0) {
        transparentElements.push({
          selector,
          property: "background-color (alpha)",
          value: bgColor,
        });
        continue;
      }
    }

    // Check backdrop-filter
    const backdropFilter = computed.getPropertyValue("backdrop-filter");
    if (backdropFilter && backdropFilter !== "none") {
      transparentElements.push({ selector, property: "backdrop-filter", value: backdropFilter });
    }
  }

  const data: ReducedTransparencyData = {
    hasMediaQuery: mediaMatches.length > 0,
    mediaRuleCount: mediaMatches.length,
    transparentElements,
    inaccessibleSheets,
  };

  if (mediaMatches.length > 0) {
    issues.push(
      mediaQueryFoundIssue("prefers-reduced-transparency", mediaMatches.length, "1.4.11"),
    );
  }

  if (transparentElements.length > 0 && mediaMatches.length === 0) {
    issues.push(
      createIssue(
        "warning",
        `Found ${transparentElements.length} semi-transparent element(s) but no @media (prefers-reduced-transparency) fallback.`,
        {
          wcag: "1.4.11",
          suggestion:
            "Add @media (prefers-reduced-transparency: reduce) { … } to provide opaque alternatives for users who prefer reduced transparency.",
        },
      ),
    );
  }

  if (transparentElements.length === 0) {
    issues.push(
      createIssue("pass", "No semi-transparent elements detected on the page.", { wcag: "1.4.11" }),
    );
  }

  for (const entry of transparentElements.slice(0, MAX_REPORTED)) {
    const el = document.querySelector(entry.selector);
    issues.push(
      createIssue(
        mediaMatches.length > 0 ? "info" : "warning",
        `Element has ${entry.property}: ${entry.value}`,
        {
          selector: entry.selector,
          html: el ? truncatedHtml(el) : "",
          wcag: "1.4.11",
          suggestion:
            mediaMatches.length > 0
              ? undefined
              : `Provide an opaque fallback for this ${entry.property} in a prefers-reduced-transparency media query.`,
          data: { property: entry.property, value: entry.value },
        },
      ),
    );
  }

  const trunc = truncationIssue(transparentElements.length, MAX_REPORTED, "transparent element");
  if (trunc) issues.push(trunc);

  const sheetsIssue = inaccessibleSheetsIssue(inaccessibleSheets);
  if (sheetsIssue) issues.push(sheetsIssue);

  return { issues, data };
}
