import type { AuditOutput, Issue } from "../../types.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { PageTitleData } from "./types.js";

const GENERIC_TITLES =
  /^(home|untitled|page|document|index|welcome|test|localhost|nueva pestaña|new tab|sin título|about:blank)$/i;

function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(a.toLowerCase().split(/\s+/));
  const setB = new Set(b.toLowerCase().split(/\s+/));
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

export function auditPageTitle(): AuditOutput<PageTitleData> {
  const issues: Issue[] = [];
  const title = document.title?.trim() ?? "";
  const isEmpty = !title;
  const isGeneric = GENERIC_TITLES.test(title);
  const h1 = document.querySelector("h1");
  const h1Text = h1?.textContent?.trim() ?? null;
  const h1TitleMatch = h1Text !== null && jaccardSimilarity(title, h1Text) > 0.3;

  const data: PageTitleData = {
    title,
    isEmpty,
    isGeneric,
    length: title.length,
    h1Text,
    h1TitleMatch,
  };

  if (isEmpty) {
    issues.push(
      createIssue("error", "Page has no <title> or title is empty.", {
        selector: "head",
        html: "<title></title>",
        wcag: "2.4.2",
        suggestion: "Add a descriptive <title> that identifies the page's purpose.",
      }),
    );
  } else if (isGeneric) {
    issues.push(
      createIssue("warning", `Page title is generic: "${title}".`, {
        selector: "head > title",
        html: `<title>${title}</title>`,
        wcag: "2.4.2",
        suggestion: "Use a descriptive title that identifies the page content and the site name.",
        data: { title },
      }),
    );
  } else {
    issues.push(
      createIssue("pass", `Page title: "${title}"`, {
        selector: "head > title",
        html: `<title>${title}</title>`,
        wcag: "2.4.2",
        data: { title, length: title.length },
      }),
    );
  }

  // Length check
  if (!isEmpty) {
    if (title.length < 10) {
      issues.push(
        createIssue("warning", `Title is very short (${title.length} chars).`, {
          selector: "head > title",
          html: `<title>${title}</title>`,
          wcag: "2.4.2",
          suggestion: "A good title is typically 30–60 characters and describes the page content.",
          data: { length: title.length },
        }),
      );
    } else if (title.length > 80) {
      issues.push(
        createIssue("info", `Title is long (${title.length} chars). Consider keeping under 60.`, {
          selector: "head > title",
          html: `<title>${title}</title>`,
          wcag: "2.4.2",
          data: { length: title.length },
        }),
      );
    }
  }

  // h1 coherence
  if (h1Text && !isEmpty) {
    if (h1TitleMatch) {
      issues.push(
        createIssue("pass", "Page title and h1 are coherent.", {
          wcag: "2.4.2",
          data: { title, h1Text },
        }),
      );
    } else {
      issues.push(
        createIssue("info", `Title "${title}" differs from h1 "${h1Text}". Consider aligning.`, {
          wcag: "2.4.2",
          data: { title, h1Text },
        }),
      );
    }
  }

  if (!h1 && !isEmpty) {
    issues.push(
      createIssue("info", "No h1 found to compare with page title.", {
        wcag: "2.4.2",
      }),
    );
  }

  return { issues, data };
}
