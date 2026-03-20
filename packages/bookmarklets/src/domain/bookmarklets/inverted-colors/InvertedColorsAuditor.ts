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
import type { InvertedColorsData, VulnerableElement } from "./types.js";

const MAX_REPORTED = 30;

function hasInvertFilter(el: Element): boolean {
  const filter = getComputedStyle(el).filter;
  return filter.includes("invert(1)") || filter.includes("invert(100%)");
}

function getElementType(el: Element): string {
  const tag = el.tagName.toLowerCase();
  if (tag === "img") return "image";
  if (tag === "video") return "video";
  if (tag === "canvas") return "canvas";
  if (tag === "svg") return "SVG";
  return "background-image";
}

export function auditInvertedColors(): AuditOutput<InvertedColorsData> {
  const issues: Issue[] = [];

  const mediaMatches = findMediaRules("inverted-colors");
  const inaccessibleSheets = countInaccessibleStylesheets();

  const imgElements = queryAll("img, video, canvas, svg, picture");
  const vulnerableElements: VulnerableElement[] = [];

  for (const el of imgElements) {
    if (isBookmarkletOverlay(el)) continue;
    vulnerableElements.push({
      selector: uniqueSelector(el),
      type: getElementType(el),
      hasCompensation: hasInvertFilter(el),
    });
  }

  // Elements with background-image
  for (const el of queryAll("*")) {
    if (isBookmarkletOverlay(el)) continue;
    const tag = el.tagName.toLowerCase();
    if (["img", "video", "canvas", "svg", "picture"].includes(tag)) continue;

    const bgImage = getComputedStyle(el).backgroundImage;
    if (bgImage && bgImage !== "none") {
      vulnerableElements.push({
        selector: uniqueSelector(el),
        type: "background-image",
        hasCompensation: hasInvertFilter(el),
      });
    }
  }

  const data: InvertedColorsData = {
    hasMediaQuery: mediaMatches.length > 0,
    mediaRuleCount: mediaMatches.length,
    vulnerableElements,
    inaccessibleSheets,
  };

  // Media query status
  if (mediaMatches.length > 0) {
    issues.push(mediaQueryFoundIssue("inverted-colors", mediaMatches.length, "1.4.1"));
  } else if (vulnerableElements.length > 0) {
    issues.push(
      createIssue(
        "warning",
        `No @media (inverted-colors) rules found, but ${vulnerableElements.length} element(s) may break visually when colors are inverted.`,
        {
          wcag: "1.4.1",
          suggestion:
            "Add @media (inverted-colors: inverted) { img, video, svg { filter: invert(1); } } to compensate images and media.",
        },
      ),
    );
  } else {
    issues.push(
      createIssue(
        "info",
        "No @media (inverted-colors) rules found and no vulnerable media elements detected.",
        { wcag: "1.4.1" },
      ),
    );
  }

  // Report vulnerable elements
  const uncompensated = vulnerableElements.filter((v) => !v.hasCompensation);
  const compensated = vulnerableElements.filter((v) => v.hasCompensation);

  if (uncompensated.length > 0 && mediaMatches.length === 0) {
    for (const entry of uncompensated.slice(0, MAX_REPORTED)) {
      const el = document.querySelector(entry.selector);
      issues.push(
        createIssue(
          "warning",
          `${entry.type} element may appear incorrect when colors are inverted — no compensation found.`,
          {
            selector: entry.selector,
            html: el ? truncatedHtml(el) : "",
            wcag: "1.4.1",
            suggestion:
              "Add filter: invert(1) for this element inside @media (inverted-colors: inverted).",
            data: { type: entry.type },
          },
        ),
      );
    }
  } else {
    for (const entry of uncompensated.slice(0, MAX_REPORTED)) {
      const el = document.querySelector(entry.selector);
      issues.push(
        createIssue(
          "info",
          `${entry.type} element — no inline invert compensation (may be handled by the media query rules).`,
          {
            selector: entry.selector,
            html: el ? truncatedHtml(el) : "",
            wcag: "1.4.1",
            data: { type: entry.type },
          },
        ),
      );
    }
  }

  for (const entry of compensated) {
    const el = document.querySelector(entry.selector);
    issues.push(
      createIssue("pass", `${entry.type} element has filter: invert(1) compensation.`, {
        selector: entry.selector,
        html: el ? truncatedHtml(el) : "",
        wcag: "1.4.1",
        data: { type: entry.type, hasCompensation: true },
      }),
    );
  }

  const trunc = truncationIssue(vulnerableElements.length, MAX_REPORTED, "element");
  if (trunc) issues.push(trunc);

  const sheetsIssue = inaccessibleSheetsIssue(inaccessibleSheets);
  if (sheetsIssue) issues.push(sheetsIssue);

  return { issues, data };
}
