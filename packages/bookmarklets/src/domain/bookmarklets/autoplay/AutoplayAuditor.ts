import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay } from "../shared/accessibility.js";
import { createIssue, noElementsIssue } from "../shared/issue-helpers.js";
import type { AutoplayData } from "./types.js";

/** Minimum duration (seconds) that triggers WCAG 1.4.2 requirements. */
const AUDIO_DURATION_THRESHOLD = 3;

/** Patterns for pause/stop/mute controls near a media element. */
const PAUSE_CONTROL_PATTERN = /pause|stop|mute|unmute|silenc/i;
const VOLUME_CONTROL_PATTERN = /volume|vol/i;

export function auditAutoplay(): AuditOutput<AutoplayData[]> {
  const mediaElements = queryAll("video, audio");
  const issues: Issue[] = [];
  const data: AutoplayData[] = [];

  for (const el of mediaElements) {
    if (isBookmarkletOverlay(el)) continue;

    const tagName = el.tagName.toLowerCase();
    const mediaEl = el as HTMLMediaElement;
    const hasAutoplay = mediaEl.hasAttribute("autoplay") || mediaEl.autoplay;
    const isMuted = mediaEl.muted || mediaEl.hasAttribute("muted");
    const duration = Number.isFinite(mediaEl.duration) ? mediaEl.duration : null;
    const selector = uniqueSelector(el);
    const src = mediaEl.src || mediaEl.querySelector("source")?.src || "";

    const hasPauseControl = findNearbyControl(el, PAUSE_CONTROL_PATTERN);
    const hasVolumeControl = findNearbyControl(el, VOLUME_CONTROL_PATTERN);

    const entry: AutoplayData = {
      selector,
      tagName,
      hasAutoplay,
      isMuted,
      duration,
      hasPauseControl,
      hasVolumeControl,
      src,
    };
    data.push(entry);

    if (!hasAutoplay) {
      issues.push(
        createIssue("pass", `<${tagName}> does not autoplay.`, {
          selector,
          html: truncatedHtml(el),
          wcag: "1.4.2",
          data: { tagName, src, hasAutoplay: false },
        }),
      );
      continue;
    }

    // Autoplay + muted is generally acceptable
    if (isMuted) {
      issues.push(
        createIssue("pass", `<${tagName}> autoplays but is muted.`, {
          selector,
          html: truncatedHtml(el),
          wcag: "1.4.2",
          data: { tagName, src, hasAutoplay: true, isMuted: true },
        }),
      );
      continue;
    }

    // Autoplay + not muted + duration > 3s + no pause = violation
    const isLongDuration = duration === null || duration > AUDIO_DURATION_THRESHOLD;

    if (isLongDuration && !hasPauseControl) {
      issues.push(
        createIssue(
          "error",
          `<${tagName}> autoplays with audio${duration !== null ? ` (${duration.toFixed(1)}s)` : ""} and has no visible pause/stop/mute control.`,
          {
            selector,
            html: truncatedHtml(el),
            wcag: "1.4.2",
            suggestion:
              "Add a visible pause, stop, or mute button, or mute the autoplay. WCAG 1.4.2 requires a mechanism to pause or control volume for audio that plays automatically for more than 3 seconds.",
            data: { tagName, src, duration, isMuted: false, hasPauseControl: false },
          },
        ),
      );
    } else if (isLongDuration && hasPauseControl) {
      issues.push(
        createIssue(
          "warning",
          `<${tagName}> autoplays with audio${duration !== null ? ` (${duration.toFixed(1)}s)` : ""}. Pause control detected nearby — verify it is keyboard accessible.`,
          {
            selector,
            html: truncatedHtml(el),
            wcag: "1.4.2",
            suggestion:
              "Ensure the pause/mute control is reachable via keyboard and announced by screen readers.",
            data: { tagName, src, duration, isMuted: false, hasPauseControl: true },
          },
        ),
      );
    } else {
      // Short duration (<= 3s) with audio
      issues.push(
        createIssue(
          "info",
          `<${tagName}> autoplays with audio but duration is ≤ ${AUDIO_DURATION_THRESHOLD}s.`,
          {
            selector,
            html: truncatedHtml(el),
            wcag: "1.4.2",
            data: { tagName, src, duration, isMuted: false },
          },
        ),
      );
    }
  }

  if (mediaElements.length === 0) {
    issues.push(noElementsIssue("info", "video or audio elements", "1.4.2"));
  }

  return { issues, data };
}

/** Search sibling/parent area for a control matching the given pattern. */
function findNearbyControl(mediaEl: Element, pattern: RegExp): boolean {
  const parent = mediaEl.parentElement;
  if (!parent) return false;

  const wrapper =
    mediaEl.closest('[class*="player" i], [class*="video" i], [id*="player" i]') ?? parent;
  const candidates = queryAll("button, [role='button'], a, input", wrapper);

  for (const el of candidates) {
    const text = el.textContent?.trim() ?? "";
    const label = el.getAttribute("aria-label") ?? "";
    const title = el.getAttribute("title") ?? "";
    const className = el.className ?? "";

    if (
      pattern.test(text) ||
      pattern.test(label) ||
      pattern.test(title) ||
      pattern.test(className)
    ) {
      return true;
    }
  }

  return false;
}
