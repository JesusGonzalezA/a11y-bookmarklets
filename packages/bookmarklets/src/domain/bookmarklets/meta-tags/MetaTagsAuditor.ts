import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { MetaTagInfo, MetaTagsData } from "./types.js";

export function auditMetaTags(): AuditOutput<MetaTagsData> {
  const issues: Issue[] = [];
  const allMetaTags: MetaTagInfo[] = [];

  const metaElements = queryAll("meta");
  let charset: string | null = null;
  let description: string | null = null;
  let colorScheme: string | null = null;
  let themeColor: string | null = null;
  let httpRefresh: string | null = null;

  for (const el of metaElements) {
    const name =
      el.getAttribute("name") ?? el.getAttribute("http-equiv") ?? el.getAttribute("charset") ?? "";
    const content = el.getAttribute("content") ?? "";
    const selector = uniqueSelector(el);

    if (name || content) {
      allMetaTags.push({ name, content, selector });
    }

    // Charset
    if (el.hasAttribute("charset")) {
      charset = el.getAttribute("charset");
    }
    if (el.getAttribute("http-equiv")?.toLowerCase() === "content-type") {
      const match = content.match(/charset=([^\s;]+)/i);
      if (match) charset = match[1];
    }

    // Description
    if (el.getAttribute("name")?.toLowerCase() === "description") {
      description = content;
    }

    // Color scheme
    if (el.getAttribute("name")?.toLowerCase() === "color-scheme") {
      colorScheme = content;
    }

    // Theme color
    if (el.getAttribute("name")?.toLowerCase() === "theme-color") {
      themeColor = content;
    }

    // HTTP refresh
    if (el.getAttribute("http-equiv")?.toLowerCase() === "refresh") {
      httpRefresh = content;
    }
  }

  const data: MetaTagsData = {
    charset,
    description,
    colorScheme,
    themeColor,
    httpRefresh,
    allMetaTags,
  };

  // Charset check
  if (!charset) {
    issues.push(
      createIssue("warning", 'No charset declaration found. Add <meta charset="UTF-8">.', {
        selector: "head",
        html: "<head>",
        suggestion: 'Add <meta charset="UTF-8"> as the first element in <head>.',
      }),
    );
  } else if (charset.toUpperCase() !== "UTF-8") {
    issues.push(
      createIssue("warning", `Charset is "${charset}". UTF-8 is recommended for accessibility.`, {
        suggestion: 'Change to <meta charset="UTF-8"> for proper character support.',
        data: { charset },
      }),
    );
  } else {
    issues.push(
      createIssue("pass", "Charset is UTF-8.", {
        data: { charset },
      }),
    );
  }

  // HTTP refresh check (WCAG 2.2.1)
  if (httpRefresh) {
    const refreshTime = Number.parseInt(httpRefresh, 10);
    if (!Number.isNaN(refreshTime) && refreshTime > 0 && refreshTime < 72000) {
      const refreshMeta = metaElements.find(
        (el) => el.getAttribute("http-equiv")?.toLowerCase() === "refresh",
      );
      issues.push(
        createIssue(
          "error",
          `Page uses meta refresh with ${refreshTime}s timeout. This can disorient users.`,
          {
            selector: refreshMeta ? uniqueSelector(refreshMeta) : "head",
            html: refreshMeta ? truncatedHtml(refreshMeta) : "",
            wcag: "2.2.1",
            suggestion: "Remove meta refresh. Use server-side redirects (HTTP 301/302) instead.",
            data: { httpRefresh, refreshTime },
          },
        ),
      );
    }
  } else {
    issues.push(
      createIssue("pass", "No meta refresh found.", {
        wcag: "2.2.1",
      }),
    );
  }

  // Color scheme
  if (colorScheme) {
    issues.push(
      createIssue("pass", `color-scheme meta tag found: "${colorScheme}".`, {
        data: { colorScheme },
      }),
    );
  } else {
    issues.push(
      createIssue("info", "No color-scheme meta tag. Consider declaring dark/light support.", {
        suggestion: 'Add <meta name="color-scheme" content="light dark"> if you support both.',
        data: { colorScheme: null },
      }),
    );
  }

  // Description
  if (description) {
    issues.push(
      createIssue("pass", `Meta description found (${description.length} chars).`, {
        data: { description },
      }),
    );
  } else {
    issues.push(
      createIssue("info", "No meta description found.", {
        suggestion: "Add a meta description for better context in search results and AT.",
      }),
    );
  }

  // Summary
  issues.push(
    createIssue("info", `Found ${allMetaTags.length} meta tag(s) in total.`, {
      data: { totalMetaTags: allMetaTags.length },
    }),
  );

  return { issues, data };
}
