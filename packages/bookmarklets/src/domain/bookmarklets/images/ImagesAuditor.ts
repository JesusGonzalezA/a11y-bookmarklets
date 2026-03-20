import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { createIssue, noElementsIssue } from "../shared/issue-helpers.js";
import type { ImageData } from "./types.js";

const SUSPICIOUS_ALT =
  /^(image|photo|picture|img|icon|graphic|untitled|placeholder|dsc_?\d|img_?\d)/i;

export function auditImages(): AuditOutput<ImageData[]> {
  const imgElements = queryAll("img, [role='img'], svg[role='img']");
  const issues: Issue[] = [];
  const images: ImageData[] = [];

  for (const el of imgElements) {
    const alt = el.getAttribute("alt");
    const role = el.getAttribute("role");
    const ariaLabel = el.getAttribute("aria-label");
    const ariaHidden = el.getAttribute("aria-hidden");
    const src = (el as HTMLImageElement).src ?? el.getAttribute("src") ?? "";
    const isDecorative =
      alt === "" || ariaHidden === "true" || role === "presentation" || role === "none";
    const hasFigcaption = el.closest("figure")?.querySelector("figcaption") !== null;
    const selector = uniqueSelector(el);

    images.push({ selector, alt, ariaLabel, isDecorative, hasFigcaption, src });

    if (alt === null && !ariaLabel && el.tagName.toLowerCase() === "img") {
      issues.push(
        createIssue("error", "Image has no alt attribute.", {
          selector,
          html: truncatedHtml(el),
          wcag: "1.1.1",
          suggestion: 'Add alt="description" or alt="" if decorative.',
          data: { src, alt, isDecorative },
        }),
      );
      continue;
    }

    if (isDecorative) {
      issues.push(
        createIssue("pass", 'Decorative image (alt="" or aria-hidden).', {
          selector,
          html: truncatedHtml(el),
          wcag: "1.1.1",
          data: { src, alt, isDecorative },
        }),
      );
      continue;
    }

    const effectiveAlt = alt ?? ariaLabel ?? "";

    if (SUSPICIOUS_ALT.test(effectiveAlt)) {
      issues.push(
        createIssue("warning", `Suspicious alt text: "${effectiveAlt}"`, {
          selector,
          html: truncatedHtml(el),
          wcag: "1.1.1",
          suggestion: "Use descriptive alt text that conveys the image's purpose or content.",
          data: { src, alt: effectiveAlt },
        }),
      );
      continue;
    }

    if (effectiveAlt.length > 150) {
      issues.push(
        createIssue("warning", `Alt text is very long (${effectiveAlt.length} chars).`, {
          selector,
          html: truncatedHtml(el),
          wcag: "1.1.1",
          suggestion: "Consider using a shorter alt and longdesc or a linked description.",
          data: { src, alt: effectiveAlt, length: effectiveAlt.length },
        }),
      );
      continue;
    }

    issues.push(
      createIssue("pass", `Image has alt text: "${effectiveAlt}"`, {
        selector,
        html: truncatedHtml(el),
        wcag: "1.1.1",
        data: { src, alt: effectiveAlt, hasFigcaption },
      }),
    );
  }

  if (imgElements.length === 0) {
    issues.push(noElementsIssue("info", "images", "1.1.1"));
  }

  return { issues, data: images };
}
