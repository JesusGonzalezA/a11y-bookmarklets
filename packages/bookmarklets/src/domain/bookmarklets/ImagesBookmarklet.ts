/**
 * Images bookmarklet — audits images for alt text, decorative markers, and figcaption usage.
 *
 * WCAG: 1.1.1 Non-text Content
 */

import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { queryAll, uniqueSelector, truncatedHtml } from "../../infrastructure/dom/DomUtils.js";
import { addLabel, addOutline, showPanel } from "../../infrastructure/overlay/OverlayManager.js";
import { IMAGES_CATALOG } from "../../catalog/images.js";

interface ImageData {
  selector: string;
  alt: string | null;
  ariaLabel: string | null;
  isDecorative: boolean;
  hasFigcaption: boolean;
  src: string;
}

export class ImagesBookmarklet extends Bookmarklet<ImageData[]> {
  constructor() {
    super(IMAGES_CATALOG);
  }

  protected audit(): AuditOutput<ImageData[]> {
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

      if (isDecorative) {
        issues.push({
          severity: "pass",
          message: 'Decorative image (alt="" or aria-hidden).',
          selector,
          html: truncatedHtml(el),
          wcag: "1.1.1",
          data: { src, alt, isDecorative },
        });
        continue;
      }

      const effectiveAlt = alt ?? ariaLabel ?? "";

      const suspicious =
        /^(image|photo|picture|img|icon|graphic|untitled|placeholder|dsc_?\d|img_?\d)/i;
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

    return { issues, data: images };
  }

  protected render(images: ImageData[]): void {
    for (const img of images) {
      const el = document.querySelector(img.selector);
      if (!el) continue;

      if (img.alt === null && !img.ariaLabel) {
        addOutline(el, "#e74c3c");
        addLabel(el, { text: "NO ALT", bgColor: "#e74c3c" });
      } else if (img.isDecorative) {
        addOutline(el, "#95a5a6");
        addLabel(el, { text: "decorative", bgColor: "#95a5a6" });
      } else {
        const alt = img.alt ?? img.ariaLabel ?? "";
        const display = alt.length > 30 ? alt.slice(0, 30) + "…" : alt;
        addOutline(el, "#2ecc71");
        addLabel(el, { text: `alt: "${display}"`, bgColor: "#2ecc71" });
      }
    }

    const missing = images.filter((i) => i.alt === null && !i.ariaLabel).length;
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
}
