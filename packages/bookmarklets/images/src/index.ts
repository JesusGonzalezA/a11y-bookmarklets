/**
 * Images bookmarklet
 *
 * Audits images for alt text, decorative markers, and figcaption usage.
 *
 * WCAG: 1.1.1 Non-text Content
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

const BOOKMARKLET_ID = "images";

interface ImageInfo {
  selector: string;
  element: Element;
  alt: string | null;
  isDecorative: boolean;
  hasFigcaption: boolean;
  src: string;
  role: string | null;
}

function auditImages(): { issues: Issue[]; images: ImageInfo[] } {
  const imgElements = queryAll("img, [role='img'], svg[role='img']");
  const issues: Issue[] = [];
  const images: ImageInfo[] = [];

  for (const el of imgElements) {
    const alt = el.getAttribute("alt");
    const role = el.getAttribute("role");
    const ariaLabel = el.getAttribute("aria-label");
    const ariaHidden = el.getAttribute("aria-hidden");
    const src = (el as HTMLImageElement).src ?? el.getAttribute("src") ?? "";
    const isDecorative = alt === "" || ariaHidden === "true" || role === "presentation" || role === "none";
    const hasFigcaption = el.closest("figure")?.querySelector("figcaption") !== null;
    const selector = uniqueSelector(el);

    images.push({ selector, element: el, alt, isDecorative, hasFigcaption, src, role });

    // Missing alt attribute entirely
    if (alt === null && !ariaLabel && el.tagName.toLowerCase() === "img") {
      issues.push({
        severity: "error",
        message: "Image has no alt attribute.",
        selector,
        html: truncatedHtml(el),
        wcag: "1.1.1",
        suggestion: 'Add alt="description" or alt="" if decorative.',
        data: { src, alt, isDecorative },
      });
      continue;
    }

    // Decorative image
    if (isDecorative) {
      issues.push({
        severity: "pass",
        message: `Decorative image (alt="" or aria-hidden).`,
        selector,
        html: truncatedHtml(el),
        wcag: "1.1.1",
        data: { src, alt, isDecorative },
      });
      continue;
    }

    // Has alt text
    const effectiveAlt = alt ?? ariaLabel ?? "";

    // Suspicious alt text patterns
    const suspicious = /^(image|photo|picture|img|icon|graphic|untitled|placeholder|dsc_?\d|img_?\d)/i;
    if (suspicious.test(effectiveAlt)) {
      issues.push({
        severity: "warning",
        message: `Suspicious alt text: "${effectiveAlt}"`,
        selector,
        html: truncatedHtml(el),
        wcag: "1.1.1",
        suggestion: "Use descriptive alt text that conveys the image's purpose or content.",
        data: { src, alt: effectiveAlt },
      });
      continue;
    }

    // Very long alt text
    if (effectiveAlt.length > 150) {
      issues.push({
        severity: "warning",
        message: `Alt text is very long (${effectiveAlt.length} chars).`,
        selector,
        html: truncatedHtml(el),
        wcag: "1.1.1",
        suggestion: "Consider using a shorter alt and longdesc or a linked description.",
        data: { src, alt: effectiveAlt, length: effectiveAlt.length },
      });
      continue;
    }

    // All good
    issues.push({
      severity: "pass",
      message: `Image has alt text: "${effectiveAlt}"`,
      selector,
      html: truncatedHtml(el),
      wcag: "1.1.1",
      data: { src, alt: effectiveAlt, hasFigcaption },
    });
  }

  if (imgElements.length === 0) {
    issues.push({
      severity: "info",
      message: "No images found on the page.",
      selector: "html",
      html: "",
      wcag: "1.1.1",
    });
  }

  return { issues, images };
}

function renderVisual(images: ImageInfo[]): void {
  clearOverlays();

  for (const img of images) {
    const el = img.element;

    if (img.alt === null && !img.element.getAttribute("aria-label")) {
      // Missing alt — red
      addOutline(el, "#e74c3c");
      addLabel(el, { text: "NO ALT", bgColor: "#e74c3c" });
    } else if (img.isDecorative) {
      // Decorative — gray
      addOutline(el, "#95a5a6");
      addLabel(el, { text: "decorative", bgColor: "#95a5a6" });
    } else {
      // Has alt — green
      const alt = img.alt ?? img.element.getAttribute("aria-label") ?? "";
      const display = alt.length > 30 ? alt.slice(0, 30) + "…" : alt;
      addOutline(el, "#2ecc71");
      addLabel(el, { text: `alt: "${display}"`, bgColor: "#2ecc71" });
    }
  }

  const missing = images.filter((i) => i.alt === null && !i.element.getAttribute("aria-label")).length;
  const decorative = images.filter((i) => i.isDecorative).length;
  const withAlt = images.length - missing - decorative;

  showPanel(`
    <strong>Images (${images.length})</strong>
    <div style="font-size:12px; margin-top:6px;">
      <div style="color:#2ecc71">✓ With alt: ${withAlt}</div>
      <div style="color:#95a5a6">○ Decorative: ${decorative}</div>
      <div style="color:#e74c3c">✗ Missing alt: ${missing}</div>
    </div>
  `);
}

export function run(options: BookmarkletOptions = {}): AuditResult {
  const mode = options.mode ?? "both";
  const { issues, images } = auditImages();

  if (mode === "visual" || mode === "both") {
    renderVisual(images);
  }

  const result = buildResult(BOOKMARKLET_ID, issues);

  (window as any).__a11y = (window as any).__a11y ?? {};
  (window as any).__a11y[BOOKMARKLET_ID] = { audit: () => run({ mode: "data" }), lastResult: result };

  return result;
}

run();
