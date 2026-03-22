import {
  countInaccessibleStylesheets,
  findMediaRules,
} from "../../../infrastructure/css/CssMediaQueryUtils.js";
import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay, isElementVisible } from "../shared/accessibility.js";
import { createIssue, inaccessibleSheetsIssue } from "../shared/issue-helpers.js";
import type { PrintStyleElement, PrintStylesData } from "./types.js";

function findPrintHiddenElements(): { rule: CSSMediaRule; selectors: string[] }[] {
  const results: { rule: CSSMediaRule; selectors: string[] }[] = [];

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }

    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSMediaRule)) continue;
      if (!rule.conditionText.toLowerCase().includes("print")) continue;

      const hiddenSelectors: string[] = [];
      for (const inner of Array.from(rule.cssRules)) {
        if (!(inner instanceof CSSStyleRule)) continue;
        const display = inner.style.display;
        const visibility = inner.style.visibility;
        if (display === "none" || visibility === "hidden") {
          hiddenSelectors.push(inner.selectorText);
        }
      }

      if (hiddenSelectors.length > 0) {
        results.push({ rule, selectors: hiddenSelectors });
      }
    }
  }

  return results;
}

function checkLinkUrlRevelation(): boolean {
  // Check if any print rule reveals link URLs via CSS content
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }

    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSMediaRule)) continue;
      if (!rule.conditionText.toLowerCase().includes("print")) continue;

      for (const inner of Array.from(rule.cssRules)) {
        if (!(inner instanceof CSSStyleRule)) continue;
        // Look for content: " (" attr(href) ")" patterns
        if (
          inner.selectorText.includes("a[href]") &&
          inner.style.content &&
          inner.style.content.includes("attr(href)")
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function findBackgroundImages(): Element[] {
  const results: Element[] = [];

  for (const el of queryAll("*")) {
    if (isBookmarkletOverlay(el)) continue;
    if (!isElementVisible(el)) continue;

    const style = getComputedStyle(el);
    if (style.backgroundImage && style.backgroundImage !== "none") {
      // Check if this element has no text content — background image might carry meaning
      const text = el.textContent?.trim() ?? "";
      if (text.length === 0) {
        results.push(el);
      }
    }
  }

  return results;
}

export function auditPrintStyles(): AuditOutput<PrintStylesData> {
  const issues: Issue[] = [];
  const elements: PrintStyleElement[] = [];

  const printRules = findMediaRules("print");
  const hasPrintRules = printRules.length > 0;
  const printRuleCount = printRules.reduce((sum, r) => sum + r.ruleCount, 0);
  const inaccessibleSheets = countInaccessibleStylesheets();

  if (!hasPrintRules) {
    issues.push(
      createIssue("warning", "No @media print rules found. The page may not be optimized for printing.", {
        wcag: "1.3.2",
        suggestion: "Add @media print styles to hide navigation, reveal link URLs, and optimize layout for print.",
      }),
    );
  } else {
    issues.push(
      createIssue("pass", `Found ${printRules.length} @media print block(s) with ${printRuleCount} rule(s).`, {
        data: { printRuleCount, blockCount: printRules.length },
      }),
    );

    // Check for content hidden in print
    const hiddenInPrint = findPrintHiddenElements();
    for (const { selectors } of hiddenInPrint) {
      for (const sel of selectors) {
        const matchedEls = queryAll(sel);
        for (const el of matchedEls) {
          if (isBookmarkletOverlay(el)) continue;
          const selector = uniqueSelector(el);
          elements.push({ selector, type: "hidden-in-print", detail: `Matched by: ${sel}` });
          issues.push(
            createIssue("info", `Element hidden in print: ${sel}`, {
              selector,
              html: truncatedHtml(el),
              data: { printSelector: sel },
            }),
          );
        }
      }
    }

    // Check if link URLs are revealed
    const linksRevealed = checkLinkUrlRevelation();
    if (!linksRevealed) {
      const externalLinks = queryAll('a[href^="http"]');
      if (externalLinks.length > 0) {
        issues.push(
          createIssue("warning", `${externalLinks.length} external link(s) — URLs not revealed in print styles.`, {
            suggestion: 'Add `@media print { a[href^="http"]::after { content: " (" attr(href) ")"; } }` to show URLs.',
            data: { externalLinkCount: externalLinks.length },
          }),
        );
      }
    } else {
      issues.push(
        createIssue("pass", "Print styles reveal link URLs via CSS content.", {}),
      );
    }
  }

  // Check for background images carrying meaning
  const bgImages = findBackgroundImages();
  if (bgImages.length > 0) {
    const shown = bgImages.slice(0, 10);
    for (const el of shown) {
      const selector = uniqueSelector(el);
      elements.push({ selector, type: "background-image", detail: "Empty element with background-image" });
      issues.push(
        createIssue("warning", "Element with background-image and no text — may lose meaning in print.", {
          selector,
          html: truncatedHtml(el),
          wcag: "1.1.1",
          suggestion: "Use <img> with alt text instead, or ensure print styles provide a text alternative.",
          data: { type: "background-image" },
        }),
      );
    }
  }

  // Check for nav elements not hidden in print
  if (hasPrintRules) {
    const navElements = queryAll("nav, [role='navigation']");
    for (const nav of navElements) {
      if (isBookmarkletOverlay(nav)) continue;
      const selector = uniqueSelector(nav);
      // Check if any print rule hides this element
      const isHiddenInPrint = elements.some(
        (e) => e.type === "hidden-in-print" && e.selector === selector,
      );
      if (!isHiddenInPrint) {
        elements.push({ selector, type: "nav-visible-in-print", detail: "Navigation visible in print" });
        issues.push(
          createIssue("info", "Navigation element is not hidden in print styles.", {
            selector,
            html: truncatedHtml(nav),
            suggestion: "Consider hiding navigation in print to reduce clutter.",
            data: { type: "nav-visible-in-print" },
          }),
        );
      }
    }
  }

  // Inaccessible sheets warning
  const sheetIssue = inaccessibleSheetsIssue(inaccessibleSheets);
  if (sheetIssue) issues.push(sheetIssue);

  return {
    issues,
    data: {
      hasPrintRules,
      printRuleCount,
      elements,
      inaccessibleSheets,
    },
  };
}
