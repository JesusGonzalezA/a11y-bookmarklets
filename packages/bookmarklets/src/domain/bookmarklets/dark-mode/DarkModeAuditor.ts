import {
  countInaccessibleStylesheets,
  findMediaRules,
} from "../../../infrastructure/css/CssMediaQueryUtils.js";
import { truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { createIssue, inaccessibleSheetsIssue } from "../shared/issue-helpers.js";
import type { DarkModeData } from "./types.js";

export function auditDarkMode(): AuditOutput<DarkModeData> {
  const issues: Issue[] = [];

  const darkMatches = findMediaRules("prefers-color-scheme: dark");
  const lightMatches = findMediaRules("prefers-color-scheme: light");
  const inaccessibleSheets = countInaccessibleStylesheets();

  const metaTag = document.querySelector('meta[name="color-scheme"]');
  const hasColorSchemeMeta = !!metaTag;
  const metaContent = metaTag?.getAttribute("content") ?? "";

  const rootColorScheme = getComputedStyle(document.documentElement)
    .getPropertyValue("color-scheme")
    .trim();
  const hasColorSchemeCSS = rootColorScheme !== "" && rootColorScheme !== "normal";

  const data: DarkModeData = {
    darkRules: darkMatches.length,
    lightRules: lightMatches.length,
    hasColorSchemeMeta,
    hasColorSchemeCSS,
    inaccessibleSheets,
  };

  // Dark mode rules
  if (darkMatches.length > 0) {
    issues.push(
      createIssue(
        "pass",
        `Found ${darkMatches.length} @media (prefers-color-scheme: dark) rule(s) across stylesheets.`,
        { wcag: "1.4.3", data: { darkRules: darkMatches.length } },
      ),
    );

    for (const match of darkMatches) {
      issues.push(
        createIssue(
          "info",
          `Dark mode rule: "${match.conditionText}" with ${match.ruleCount} declaration(s)${match.stylesheetHref ? ` in ${match.stylesheetHref}` : ""}`,
          {
            wcag: "1.4.3",
            data: { conditionText: match.conditionText, ruleCount: match.ruleCount },
          },
        ),
      );
    }
  } else {
    issues.push(
      createIssue(
        "warning",
        "No @media (prefers-color-scheme: dark) rules found. The page may not adapt to the user's dark mode preference.",
        {
          wcag: "1.4.3",
          suggestion:
            "Add @media (prefers-color-scheme: dark) { … } rules to adapt colors for dark mode users.",
        },
      ),
    );
  }

  if (lightMatches.length > 0) {
    issues.push(
      createIssue(
        "info",
        `Found ${lightMatches.length} @media (prefers-color-scheme: light) rule(s).`,
        {
          wcag: "1.4.3",
          data: { lightRules: lightMatches.length },
        },
      ),
    );
  }

  // Color scheme meta/CSS
  if (hasColorSchemeMeta && metaTag) {
    issues.push(
      createIssue(
        "pass",
        `<meta name="color-scheme" content="${metaContent}"> found — browser knows which schemes the page supports.`,
        { selector: uniqueSelector(metaTag), html: truncatedHtml(metaTag), wcag: "1.4.3" },
      ),
    );
  }

  if (hasColorSchemeCSS) {
    issues.push(
      createIssue(
        "pass",
        `CSS color-scheme: "${rootColorScheme}" set on :root — browser adapts form controls and scrollbars.`,
        { wcag: "1.4.3" },
      ),
    );
  }

  if (!hasColorSchemeMeta && !hasColorSchemeCSS && darkMatches.length > 0) {
    issues.push(
      createIssue(
        "warning",
        "Dark mode CSS rules exist but no color-scheme declaration found. The browser cannot adapt UI controls (scrollbars, form fields) automatically.",
        {
          wcag: "1.4.3",
          suggestion:
            'Add <meta name="color-scheme" content="light dark"> or set color-scheme: light dark on :root.',
        },
      ),
    );
  }

  if (!hasColorSchemeMeta && !hasColorSchemeCSS && darkMatches.length === 0) {
    issues.push(
      createIssue("info", "No color-scheme declaration found (meta tag or CSS property).", {
        wcag: "1.4.3",
        suggestion:
          'Consider adding <meta name="color-scheme" content="light dark"> if you support dark mode.',
      }),
    );
  }

  const sheetsIssue = inaccessibleSheetsIssue(inaccessibleSheets);
  if (sheetsIssue) issues.push(sheetsIssue);

  return { issues, data };
}
