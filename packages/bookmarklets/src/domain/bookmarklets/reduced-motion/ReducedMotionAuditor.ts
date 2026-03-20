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
  truncationIssue,
} from "../shared/issue-helpers.js";
import type { AnimationEntry, ReducedMotionData } from "./types.js";

const MAX_REPORTED_ELEMENTS = 50;

export function auditReducedMotion(): AuditOutput<ReducedMotionData> {
  const issues: Issue[] = [];

  const mediaMatches = findMediaRules("prefers-reduced-motion");
  const inaccessibleSheets = countInaccessibleStylesheets();

  const animatedElements: AnimationEntry[] = [];
  const allElements = queryAll("*");

  for (const el of allElements) {
    if (isBookmarkletOverlay(el)) continue;

    const computed = getComputedStyle(el);

    const animation = computed.animation || computed.getPropertyValue("animation");
    if (animation && animation !== "none" && animation !== "" && !animation.startsWith("0s")) {
      animatedElements.push({
        selector: uniqueSelector(el),
        property: "animation",
        value: animation,
      });
    }

    const transition = computed.transition || computed.getPropertyValue("transition");
    if (
      transition &&
      transition !== "none" &&
      transition !== "" &&
      !transition.startsWith("all 0s")
    ) {
      const hasRealDuration = /[1-9]\d*(\.\d+)?(ms|s)/.test(transition);
      if (hasRealDuration) {
        animatedElements.push({
          selector: uniqueSelector(el),
          property: "transition",
          value: transition,
        });
      }
    }
  }

  let webAnimationsCount = 0;
  if (typeof document.getAnimations === "function") {
    webAnimationsCount = document.getAnimations().length;
  }

  const data: ReducedMotionData = {
    hasMediaQuery: mediaMatches.length > 0,
    mediaRuleCount: mediaMatches.length,
    animatedElements,
    webAnimationsCount,
    inaccessibleSheets,
  };

  if (mediaMatches.length > 0) {
    issues.push(mediaQueryFoundIssue("prefers-reduced-motion", mediaMatches.length, "2.3.3"));
  }

  if (animatedElements.length > 0 && mediaMatches.length === 0) {
    issues.push(
      createIssue(
        "warning",
        `Found ${animatedElements.length} element(s) with CSS animations/transitions but no @media (prefers-reduced-motion) fallback.`,
        {
          wcag: "2.3.3",
          suggestion:
            "Add @media (prefers-reduced-motion: reduce) { … } to disable or simplify animations for users who prefer reduced motion.",
        },
      ),
    );
  }

  if (animatedElements.length === 0 && webAnimationsCount === 0) {
    issues.push(
      createIssue("pass", "No CSS animations, transitions, or Web Animations found on the page.", {
        wcag: "2.3.3",
      }),
    );
  }

  for (const entry of animatedElements.slice(0, MAX_REPORTED_ELEMENTS)) {
    const el = document.querySelector(entry.selector);
    issues.push(
      createIssue(
        mediaMatches.length > 0 ? "info" : "warning",
        `Element has ${entry.property}: ${entry.value.slice(0, 80)}${entry.value.length > 80 ? "…" : ""}`,
        {
          selector: entry.selector,
          html: el ? truncatedHtml(el) : "",
          wcag: "2.3.3",
          suggestion:
            mediaMatches.length > 0
              ? undefined
              : `Ensure this ${entry.property} is disabled or simplified in a prefers-reduced-motion media query.`,
          data: { property: entry.property, value: entry.value },
        },
      ),
    );
  }

  const trunc = truncationIssue(animatedElements.length, MAX_REPORTED_ELEMENTS, "animated element");
  if (trunc) issues.push(trunc);

  if (webAnimationsCount > 0) {
    issues.push(
      createIssue(
        mediaMatches.length > 0 ? "info" : "warning",
        `${webAnimationsCount} Web Animation(s) detected via document.getAnimations(). Verify they respect prefers-reduced-motion.`,
        {
          wcag: "2.3.3",
          suggestion:
            "Check that JavaScript animations use window.matchMedia('(prefers-reduced-motion: reduce)') to disable or simplify motion.",
        },
      ),
    );
  }

  const sheetsIssue = inaccessibleSheetsIssue(inaccessibleSheets);
  if (sheetsIssue) issues.push(sheetsIssue);

  return { issues, data };
}
