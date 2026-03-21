import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isElementVisible } from "../shared/accessibility.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { FormErrorData } from "./types.js";

export function auditFormErrors(): AuditOutput<FormErrorData[]> {
  const issues: Issue[] = [];
  const data: FormErrorData[] = [];

  // Check elements with aria-invalid
  const invalidElements = queryAll("[aria-invalid]");

  for (const el of invalidElements) {
    const isInvalid = el.getAttribute("aria-invalid") === "true";
    const selector = uniqueSelector(el);
    const tagName = el.tagName.toLowerCase();

    // Check for aria-errormessage
    const errorMsgId = el.getAttribute("aria-errormessage");
    let errorMsgText = "";
    let hasErrorMessage = false;

    if (errorMsgId) {
      const errorEl = document.getElementById(errorMsgId);
      if (errorEl) {
        errorMsgText = errorEl.textContent?.trim() ?? "";
        hasErrorMessage = !!errorMsgText && isElementVisible(errorEl);
      }
    }

    // Check aria-describedby for error messages
    if (!hasErrorMessage) {
      const describedBy = el.getAttribute("aria-describedby");
      if (describedBy) {
        const ids = describedBy.split(/\s+/);
        for (const id of ids) {
          const descEl = document.getElementById(id);
          if (descEl?.textContent?.trim()) {
            errorMsgText = descEl.textContent.trim();
            hasErrorMessage = true;
            break;
          }
        }
      }
    }

    // Check for live region
    const hasLiveRegion = !!el.closest("[aria-live], [role='alert'], [role='status']");

    data.push({
      selector,
      tagName,
      isInvalid,
      hasErrorMessage,
      errorMessageId: errorMsgId,
      errorMessageText: errorMsgText,
      hasLiveRegion,
    });

    if (isInvalid && !hasErrorMessage) {
      issues.push(
        createIssue("error", `Invalid field <${tagName}> has no visible error message.`, {
          selector,
          html: truncatedHtml(el),
          wcag: "3.3.1",
          suggestion:
            "Add aria-errormessage pointing to a visible error description, or use aria-describedby.",
          data: { tagName, isInvalid, errorMsgId },
        }),
      );
    } else if (isInvalid && hasErrorMessage) {
      issues.push(
        createIssue("pass", `Invalid field <${tagName}> has error message: "${errorMsgText}"`, {
          selector,
          html: truncatedHtml(el),
          wcag: "3.3.1",
          data: { tagName, errorMsgText },
        }),
      );
    }

    if (errorMsgId && !document.getElementById(errorMsgId)) {
      issues.push(
        createIssue("error", `aria-errormessage references missing ID: "${errorMsgId}".`, {
          selector,
          html: truncatedHtml(el),
          wcag: "3.3.1",
          suggestion: `Add an element with id="${errorMsgId}" containing the error description.`,
          data: { errorMsgId },
        }),
      );
    }
  }

  // Check for alert/status regions
  const alertRegions = queryAll('[role="alert"], [aria-live="assertive"]');
  for (const region of alertRegions) {
    const text = region.textContent?.trim() ?? "";
    const selector = uniqueSelector(region);
    issues.push(
      createIssue("info", `Alert region found: ${text ? `"${text.slice(0, 60)}"` : "(empty)"}`, {
        selector,
        html: truncatedHtml(region),
        wcag: "3.3.1",
        data: { role: "alert", hasContent: !!text },
      }),
    );
  }

  if (invalidElements.length === 0 && alertRegions.length === 0) {
    issues.push(
      createIssue("info", "No aria-invalid fields or alert regions found on the page.", {
        wcag: "3.3.1",
        suggestion:
          "Submit a form with empty required fields to trigger error states, then re-run.",
      }),
    );
  }

  return { issues, data };
}
