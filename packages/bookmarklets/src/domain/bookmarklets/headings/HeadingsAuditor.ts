import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { HeadingData } from "./types.js";

function getHeadingLevel(tag: string): number {
  return parseInt(tag.charAt(1), 10);
}

export function auditHeadings(): AuditOutput<HeadingData[]> {
  const headingElements = queryAll("h1, h2, h3, h4, h5, h6");
  const issues: Issue[] = [];
  const headings: HeadingData[] = [];

  let previousLevel = 0;
  let h1Count = 0;

  for (const el of headingElements) {
    const tag = el.tagName.toLowerCase();
    const level = getHeadingLevel(tag);
    const text = el.textContent?.trim() ?? "";
    const selector = uniqueSelector(el);

    headings.push({ level, text, selector });

    if (!text) {
      issues.push(
        createIssue("error", `Empty ${tag} heading`, {
          selector,
          html: truncatedHtml(el),
          wcag: "2.4.6",
          suggestion: "Add text content to the heading or remove it if unnecessary.",
          data: { level, text },
        }),
      );
    }

    if (previousLevel > 0 && level > previousLevel + 1) {
      issues.push(
        createIssue(
          "warning",
          `Heading level skipped: h${previousLevel} → ${tag} (expected h${previousLevel + 1})`,
          {
            selector,
            html: truncatedHtml(el),
            wcag: "1.3.1",
            suggestion: `Use h${previousLevel + 1} instead, or add the missing intermediate heading.`,
            data: { level, previousLevel, text },
          },
        ),
      );
    }

    if (level === 1) h1Count++;

    issues.push(
      createIssue("info", `${tag}: "${text}"`, {
        selector,
        html: truncatedHtml(el),
        wcag: "1.3.1",
        data: { level, text },
      }),
    );

    previousLevel = level;
  }

  if (h1Count > 1) {
    issues.push(
      createIssue(
        "warning",
        `Multiple h1 elements found (${h1Count}). Best practice is to have a single h1.`,
        {
          selector: uniqueSelector(headingElements[0]),
          html: truncatedHtml(headingElements[0]),
          wcag: "1.3.1",
          suggestion: "Consider using a single h1 for the main page title.",
          data: { h1Count },
        },
      ),
    );
  }

  if (h1Count === 0 && headingElements.length > 0) {
    issues.push(
      createIssue("warning", "No h1 heading found on the page.", {
        wcag: "2.4.6",
        suggestion: "Add an h1 heading that describes the main topic of the page.",
      }),
    );
  }

  if (headingElements.length === 0) {
    issues.push(
      createIssue("warning", "No headings found on the page.", {
        wcag: "2.4.6",
        suggestion: "Add headings to structure the page content.",
      }),
    );
  }

  return { issues, data: headings };
}
