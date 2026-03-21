import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { getAccessibleName, isBookmarkletOverlay } from "../shared/accessibility.js";
import { createIssue, noElementsIssue } from "../shared/issue-helpers.js";
import type { CustomControlInfo, VideoControlData } from "./types.js";

/** Selectors for common custom player wrappers. */
const CUSTOM_PLAYER_SELECTOR =
  '[class*="player" i], [class*="video" i], [id*="player" i], [id*="video-player" i]';

/** Interactive roles expected in a custom player. */
const INTERACTIVE_ROLES = new Set(["button", "slider", "progressbar", "toolbar"]);

export function auditVideoControls(): AuditOutput<VideoControlData[]> {
  const mediaElements = queryAll("video, audio");
  const issues: Issue[] = [];
  const data: VideoControlData[] = [];

  for (const el of mediaElements) {
    if (isBookmarkletOverlay(el)) continue;

    const tagName = el.tagName.toLowerCase();
    const mediaEl = el as HTMLMediaElement;
    const hasNativeControls = mediaEl.hasAttribute("controls");
    const selector = uniqueSelector(el);
    const src = mediaEl.src || mediaEl.querySelector("source")?.src || "";
    const duration = Number.isFinite(mediaEl.duration) ? mediaEl.duration : null;

    // Detect custom controls near the media element
    const customControls = findCustomControls(el);
    const hasCustomControls = customControls.length > 0;

    const entry: VideoControlData = {
      selector,
      tagName,
      hasNativeControls,
      hasCustomControls,
      src,
      duration,
      customControlDetails: customControls,
    };
    data.push(entry);

    if (!hasNativeControls && !hasCustomControls) {
      issues.push(
        createIssue("error", `<${tagName}> has no controls — neither native nor custom.`, {
          selector,
          html: truncatedHtml(el),
          wcag: "2.1.1",
          suggestion:
            'Add the "controls" attribute for native controls, or provide accessible custom controls with proper ARIA roles and keyboard support.',
          data: { tagName, src },
        }),
      );
      continue;
    }

    if (hasNativeControls) {
      issues.push(
        createIssue("pass", `<${tagName}> has native controls attribute.`, {
          selector,
          html: truncatedHtml(el),
          wcag: "2.1.1",
          data: { tagName, src, hasNativeControls: true },
        }),
      );
    }

    if (hasCustomControls) {
      // Check custom controls for ARIA and keyboard support
      for (const ctrl of customControls) {
        const ctrlEl = document.querySelector(ctrl.selector);
        if (!ctrlEl) continue;

        if (!ctrl.role && ctrl.tagName !== "button") {
          issues.push(
            createIssue("warning", `Custom control <${ctrl.tagName}> has no ARIA role.`, {
              selector: ctrl.selector,
              html: ctrlEl ? truncatedHtml(ctrlEl) : "",
              wcag: "4.1.2",
              suggestion:
                'Add an appropriate role (e.g. role="button", role="slider") to custom media controls.',
              data: { controlSelector: ctrl.selector },
            }),
          );
        }

        const name = getAccessibleName(ctrlEl);
        if (!name && !ctrlEl.textContent?.trim()) {
          issues.push(
            createIssue("warning", `Custom control has no accessible name.`, {
              selector: ctrl.selector,
              html: ctrlEl ? truncatedHtml(ctrlEl) : "",
              wcag: "4.1.2",
              suggestion: "Add aria-label or visible text to describe the control's purpose.",
              data: { controlSelector: ctrl.selector },
            }),
          );
        }
      }
    }
  }

  if (mediaElements.length === 0) {
    issues.push(noElementsIssue("info", "video or audio elements", "1.2.1"));
  }

  return { issues, data };
}

/** Find interactive elements near a media element that look like custom controls. */
function findCustomControls(mediaEl: Element): CustomControlInfo[] {
  const controls: CustomControlInfo[] = [];
  const parent = mediaEl.parentElement;
  if (!parent) return controls;

  // Look for interactive elements inside the same parent or a nearby custom player wrapper
  const wrapper = mediaEl.closest(CUSTOM_PLAYER_SELECTOR) ?? parent;
  const candidates = queryAll(
    'button, [role="button"], [role="slider"], [role="progressbar"], input[type="range"], [tabindex]',
    wrapper,
  );

  for (const el of candidates) {
    if (isBookmarkletOverlay(el)) continue;
    if (el === mediaEl) continue;

    const role = el.getAttribute("role");
    const tagName = el.tagName.toLowerCase();
    const isInteractive =
      tagName === "button" ||
      tagName === "input" ||
      (role !== null && INTERACTIVE_ROLES.has(role)) ||
      el.hasAttribute("tabindex");

    if (!isInteractive) continue;

    controls.push({
      selector: uniqueSelector(el),
      role,
      ariaLabel: el.getAttribute("aria-label"),
      tabindex: el.getAttribute("tabindex"),
      tagName,
    });
  }

  return controls;
}
