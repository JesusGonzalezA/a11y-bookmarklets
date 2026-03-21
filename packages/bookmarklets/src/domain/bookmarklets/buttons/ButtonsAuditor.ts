import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { getAccessibleName, isBookmarkletOverlay } from "../shared/accessibility.js";
import { createIssue, noElementsIssue } from "../shared/issue-helpers.js";
import type { ButtonData } from "./types.js";

const BUTTON_SELECTOR =
  'button, [role="button"], input[type="button"], input[type="submit"], input[type="reset"]';

function getVisibleText(el: Element): string {
  if (el.tagName.toLowerCase() === "input") {
    return (el as HTMLInputElement).value || el.getAttribute("value") || "";
  }
  return el.textContent?.trim() ?? "";
}

function getButtonAccessibleName(el: Element): string {
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel?.trim()) return ariaLabel.trim();

  const name = getAccessibleName(el);
  if (name) return name;

  const title = el.getAttribute("title");
  if (title?.trim()) return title.trim();

  return getVisibleText(el);
}

function checkLabelInName(ariaLabel: string | null, visibleText: string): boolean {
  if (!ariaLabel || !visibleText) return false;
  return !ariaLabel.toLowerCase().includes(visibleText.toLowerCase());
}

export function auditButtons(): AuditOutput<ButtonData[]> {
  const buttons = queryAll(BUTTON_SELECTOR);
  const issues: Issue[] = [];
  const data: ButtonData[] = [];

  for (const el of buttons) {
    if (isBookmarkletOverlay(el)) continue;

    const selector = uniqueSelector(el);
    const tagName = el.tagName.toLowerCase();
    const role = el.getAttribute("role");
    const ariaLabel = el.getAttribute("aria-label");
    const visibleText = getVisibleText(el);
    const accessibleName = getButtonAccessibleName(el);
    const isEmpty = !accessibleName;
    const isDisabled = el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true";
    const labelInNameViolation =
      !!ariaLabel && !!visibleText && checkLabelInName(ariaLabel, visibleText);
    const isFauxButton = false;

    data.push({
      selector,
      tagName,
      role,
      accessibleName,
      visibleText,
      isEmpty,
      isFauxButton,
      labelInNameViolation,
      isDisabled,
    });

    if (isEmpty) {
      issues.push(
        createIssue("error", `Button <${tagName}> has no accessible name.`, {
          selector,
          html: truncatedHtml(el),
          wcag: "4.1.2",
          suggestion: "Add visible text, aria-label, or title to the button.",
        }),
      );
    } else if (labelInNameViolation) {
      issues.push(
        createIssue(
          "error",
          `Button aria-label "${ariaLabel}" does not contain visible text "${visibleText}".`,
          {
            selector,
            html: truncatedHtml(el),
            wcag: "2.5.3",
            suggestion: `Ensure aria-label includes the visible text. E.g. aria-label="${visibleText} — additional context".`,
            data: { ariaLabel, visibleText },
          },
        ),
      );
    } else {
      issues.push(
        createIssue("pass", `Button: "${accessibleName}"`, {
          selector,
          html: truncatedHtml(el),
          wcag: "4.1.2",
          data: { accessibleName, tagName },
        }),
      );
    }
  }

  // Detect faux buttons: elements with onclick but no role="button"
  const fauxButtons = queryAll("[onclick]:not(button):not(a):not([role])");
  for (const el of fauxButtons) {
    if (isBookmarkletOverlay(el)) continue;

    const selector = uniqueSelector(el);
    const tagName = el.tagName.toLowerCase();
    const text = el.textContent?.trim() ?? "";

    data.push({
      selector,
      tagName,
      role: null,
      accessibleName: text,
      visibleText: text,
      isEmpty: !text,
      isFauxButton: true,
      labelInNameViolation: false,
      isDisabled: false,
    });

    issues.push(
      createIssue(
        "error",
        `<${tagName}> with onclick handler but no role="button" or keyboard support.`,
        {
          selector,
          html: truncatedHtml(el),
          wcag: "2.1.1",
          suggestion:
            'Use a <button> element, or add role="button", tabindex="0", and keydown handler.',
          data: { tagName, text },
        },
      ),
    );
  }

  if (buttons.length === 0 && fauxButtons.length === 0) {
    issues.push(noElementsIssue("info", "buttons", "4.1.2"));
  }

  return { issues, data };
}
