import {
  countInaccessibleStylesheets,
  findMediaRules,
} from "../../../infrastructure/css/CssMediaQueryUtils.js";
import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay } from "../shared/accessibility.js";
import {
  createIssue,
  inaccessibleSheetsIssue,
  mediaQueryFoundIssue,
  mediaQueryMissingIssue,
  truncationIssue,
} from "../shared/issue-helpers.js";
import type { AffectedElement, ForcedColorsData } from "./types.js";
import { FORCED_RESET_PROPERTIES, SYSTEM_COLORS } from "./types.js";

const MAX_REPORTED = 30;

function isSystemColor(value: string): boolean {
  return SYSTEM_COLORS.has(value.toLowerCase().trim());
}

function isTransparentOrDefault(value: string): boolean {
  const v = value.toLowerCase().trim();
  return v === "transparent" || v === "none" || v === "rgba(0, 0, 0, 0)" || v === "";
}

export function auditForcedColors(): AuditOutput<ForcedColorsData> {
  const issues: Issue[] = [];

  const forcedColorsMatches = findMediaRules("forced-colors");
  const prefersContrastMatches = findMediaRules("prefers-contrast");
  const inaccessibleSheets = countInaccessibleStylesheets();

  const isForcedColorsActive =
    typeof matchMedia !== "undefined" && matchMedia("(forced-colors: active)").matches;

  const interactiveSelector =
    "a, button, input, select, textarea, [role='button'], [role='link'], [role='tab']";
  const interactiveElements = queryAll(interactiveSelector);
  const decorativeElements = queryAll(
    "div, span, section, article, aside, header, footer, nav, main, li, td, th",
  );
  const candidates = [...interactiveElements, ...decorativeElements];

  const affectedElements: AffectedElement[] = [];
  let forcedColorAdjustElements = 0;
  const seen = new Set<string>();

  for (const el of candidates) {
    if (isBookmarkletOverlay(el)) continue;

    const selector = uniqueSelector(el);
    if (seen.has(selector)) continue;
    seen.add(selector);

    const computed = getComputedStyle(el);

    const fca = computed.getPropertyValue("forced-color-adjust");
    if (fca === "none") forcedColorAdjustElements++;

    const affectedProps: string[] = [];

    for (const prop of FORCED_RESET_PROPERTIES) {
      const value = computed.getPropertyValue(prop);
      if (value && !isTransparentOrDefault(value) && !isSystemColor(value)) {
        if (prop === "background-color") {
          const rgb = value.toLowerCase();
          if (rgb === "rgba(0, 0, 0, 0)" || rgb === "rgb(255, 255, 255)") continue;
        }
        affectedProps.push(prop);
      }
    }

    const boxShadow = computed.boxShadow;
    if (boxShadow && boxShadow !== "none" && !affectedProps.includes("box-shadow")) {
      affectedProps.push("box-shadow");
    }

    if (affectedProps.length > 0) {
      affectedElements.push({
        selector,
        properties: affectedProps,
        hasForcedColorAdjust: fca === "none",
      });
    }
  }

  const data: ForcedColorsData = {
    hasForcedColorsQuery: forcedColorsMatches.length > 0,
    hasPrefersContrastQuery: prefersContrastMatches.length > 0,
    forcedColorsRuleCount: forcedColorsMatches.length,
    prefersContrastRuleCount: prefersContrastMatches.length,
    isForcedColorsActive,
    affectedElements,
    forcedColorAdjustElements,
    inaccessibleSheets,
  };

  // Forced colors media query
  if (forcedColorsMatches.length > 0) {
    issues.push(mediaQueryFoundIssue("forced-colors", forcedColorsMatches.length, "1.4.11"));
  } else {
    issues.push(
      mediaQueryMissingIssue(
        "forced-colors: active",
        "1.4.11",
        "Add @media (forced-colors: active) { … } rules to handle High Contrast Mode. Use CSS system colors (Canvas, CanvasText, LinkText, etc.).",
        "The page may not adapt to Windows High Contrast Mode.",
      ),
    );
  }

  // Prefers contrast media query
  if (prefersContrastMatches.length > 0) {
    issues.push(mediaQueryFoundIssue("prefers-contrast", prefersContrastMatches.length, "1.4.3"));
  } else {
    issues.push(
      createIssue("info", "No @media (prefers-contrast) rules found.", {
        wcag: "1.4.3",
        suggestion:
          "Consider adding @media (prefers-contrast: more) { … } rules for users who prefer higher contrast.",
      }),
    );
  }

  if (isForcedColorsActive) {
    issues.push(
      createIssue("info", "Forced colors mode is currently ACTIVE on this system.", {
        wcag: "1.4.11",
      }),
    );
  }

  if (forcedColorAdjustElements > 0) {
    issues.push(
      createIssue(
        "info",
        `${forcedColorAdjustElements} element(s) use forced-color-adjust: none (opt out of forced colors).`,
        {
          wcag: "1.4.11",
          suggestion:
            "Verify these elements maintain sufficient contrast in forced-colors mode since they keep their custom colors.",
        },
      ),
    );
  }

  // Significant affected elements (2+ custom properties)
  const significant = affectedElements.filter((e) => e.properties.length >= 2);
  for (const entry of significant.slice(0, MAX_REPORTED)) {
    const el = document.querySelector(entry.selector);
    issues.push(
      createIssue(
        forcedColorsMatches.length > 0 ? "info" : "warning",
        `Element uses custom ${entry.properties.join(", ")} — these will be overridden in forced-colors mode.${entry.hasForcedColorAdjust ? " (has forced-color-adjust: none)" : ""}`,
        {
          selector: entry.selector,
          html: el ? truncatedHtml(el) : "",
          wcag: "1.4.11",
          suggestion:
            forcedColorsMatches.length > 0
              ? undefined
              : "Ensure this element remains usable in High Contrast Mode. Consider using CSS system colors or transparent borders.",
          data: { properties: entry.properties },
        },
      ),
    );
  }

  const trunc = truncationIssue(significant.length, MAX_REPORTED, "affected element");
  if (trunc) issues.push(trunc);

  const sheetsIssue = inaccessibleSheetsIssue(inaccessibleSheets);
  if (sheetsIssue) issues.push(sheetsIssue);

  return { issues, data };
}
