import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay, isElementVisible } from "../shared/accessibility.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { ColorContrastData } from "./types.js";

/**
 * Parse a CSS color to an RGB triple [0-255].
 * Handles rgb(), rgba(), and hex (#rgb, #rrggbb).
 */
function parseColor(color: string): [number, number, number] | null {
  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
  }

  // Hex
  const hexMatch = color.match(/^#([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    return [
      Number.parseInt(hex.slice(0, 2), 16),
      Number.parseInt(hex.slice(2, 4), 16),
      Number.parseInt(hex.slice(4, 6), 16),
    ];
  }

  return null;
}

/** sRGB relative luminance per WCAG 2.x formula. */
function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/** Contrast ratio between two colors (1:1 to 21:1). */
function contrastRatio(c1: [number, number, number], c2: [number, number, number]): number {
  const l1 = relativeLuminance(c1);
  const l2 = relativeLuminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Resolve the effective background color by walking up the DOM tree. */
function resolveBackground(el: Element): [number, number, number] | null {
  let current: Element | null = el;
  while (current) {
    const bg = getComputedStyle(current).backgroundColor;
    const parsed = parseColor(bg);
    if (parsed) {
      // Check alpha — skip transparent backgrounds
      const alphaMatch = bg.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/);
      if (!alphaMatch || Number(alphaMatch[1]) > 0.1) {
        return parsed;
      }
    }
    current = current.parentElement;
  }
  return [255, 255, 255]; // Fallback: white
}

/** Whether text counts as "large" for WCAG contrast thresholds. */
function isLargeText(fontSize: number, fontWeight: number): boolean {
  // 18pt = 24px or 14pt bold = 18.66px
  return fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
}

/** Get all text nodes in an element (direct children only). */
function hasDirectText(el: Element): boolean {
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim().length > 0) {
      return true;
    }
  }
  return false;
}

export function auditColorContrast(): AuditOutput<ColorContrastData[]> {
  const issues: Issue[] = [];
  const data: ColorContrastData[] = [];

  // Text-bearing elements
  const textSelectors =
    "p, span, a, button, li, td, th, label, h1, h2, h3, h4, h5, h6, dt, dd, figcaption, blockquote, cite, em, strong, small, b, i, u, abbr, code, pre, summary";
  const elements = queryAll(textSelectors);

  for (const el of elements) {
    if (isBookmarkletOverlay(el)) continue;
    if (!isElementVisible(el)) continue;
    if (!hasDirectText(el)) continue;

    const style = getComputedStyle(el);
    const fg = parseColor(style.color);
    if (!fg) continue;

    const bg = resolveBackground(el);
    if (!bg) continue;

    const ratio = contrastRatio(fg, bg);
    const fontSize = Number.parseFloat(style.fontSize);
    const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
    const large = isLargeText(fontSize, fontWeight);

    const reqAA = large ? 3 : 4.5;
    const reqAAA = large ? 4.5 : 7;
    const passAA = ratio >= reqAA;
    const passAAA = ratio >= reqAAA;

    const selector = uniqueSelector(el);
    const text = (el.textContent ?? "").trim().slice(0, 40);

    const entry: ColorContrastData = {
      selector,
      tagName: el.tagName.toLowerCase(),
      text,
      fontSize,
      fontWeight,
      foreground: style.color,
      background: `rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`,
      ratio: Math.round(ratio * 100) / 100,
      requiredAA: reqAA,
      requiredAAA: reqAAA,
      passesAA: passAA,
      passesAAA: passAAA,
      isLargeText: large,
    };
    data.push(entry);

    if (!passAA) {
      issues.push(
        createIssue(
          "error",
          `Contrast ratio ${entry.ratio}:1 fails AA (needs ${reqAA}:1). "${text}"`,
          {
            selector,
            html: truncatedHtml(el),
            wcag: "1.4.3",
            suggestion: `Increase contrast between foreground (${style.color}) and background (${entry.background}). Required: ${reqAA}:1.`,
            data: { ratio: entry.ratio, required: reqAA },
          },
        ),
      );
    } else if (!passAAA) {
      issues.push(
        createIssue(
          "warning",
          `Contrast ratio ${entry.ratio}:1 passes AA but fails AAA (needs ${reqAAA}:1). "${text}"`,
          {
            selector,
            html: truncatedHtml(el),
            wcag: "1.4.6",
            data: { ratio: entry.ratio, required: reqAAA },
          },
        ),
      );
    }

    // Cap results to avoid performance issues
    if (data.length >= 300) {
      issues.push(
        createIssue("info", "Stopped after 300 elements. Page may have more text to check."),
      );
      break;
    }
  }

  if (data.length === 0) {
    issues.push(createIssue("info", "No text elements found to check contrast."));
  } else {
    const failCount = data.filter((d) => !d.passesAA).length;
    const passCount = data.filter((d) => d.passesAA).length;
    if (failCount === 0) {
      issues.push(
        createIssue("pass", `All ${passCount} checked elements pass AA contrast requirements.`, {
          wcag: "1.4.3",
        }),
      );
    }
  }

  return { issues, data };
}
