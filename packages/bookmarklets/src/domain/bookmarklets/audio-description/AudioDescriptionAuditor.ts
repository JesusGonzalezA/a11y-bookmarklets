import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay } from "../shared/accessibility.js";
import { createIssue, noElementsIssue } from "../shared/issue-helpers.js";
import type { AudioDescriptionData } from "./types.js";

/**
 * Pattern to detect links to audio-described versions of a video.
 * Matches common English and Spanish terms.
 */
const AD_LINK_PATTERN =
  /audio\s*descri|described\s*version|\bAD\b.*version|audiodescripci[oó]n|versi[oó]n\s*(con\s*)?audio\s*descri/i;

/** Minimum duration (seconds) to flag a video as likely needing audio description. */
const MIN_DURATION_FOR_AD = 5;

export function auditAudioDescription(): AuditOutput<AudioDescriptionData[]> {
  const videos = queryAll("video");
  const issues: Issue[] = [];
  const data: AudioDescriptionData[] = [];

  for (const el of videos) {
    if (isBookmarkletOverlay(el)) continue;

    const videoEl = el as HTMLVideoElement;
    const selector = uniqueSelector(el);
    const src = videoEl.src || videoEl.querySelector("source")?.src || "";
    const duration = Number.isFinite(videoEl.duration) ? videoEl.duration : null;
    const isMuted = videoEl.muted || videoEl.hasAttribute("muted");

    // Check for <track kind="descriptions">
    const descTracks = queryAll('track[kind="descriptions"]', el);
    const hasDescriptionTrack = descTracks.length > 0;

    // Look for nearby links to an audio-described version
    const { found, text } = findAlternativeLink(el);

    const entry: AudioDescriptionData = {
      selector,
      src,
      hasDescriptionTrack,
      hasAlternativeLink: found,
      alternativeLinkText: text,
      duration,
      isMuted,
    };
    data.push(entry);

    if (hasDescriptionTrack) {
      issues.push(
        createIssue("pass", 'Video has <track kind="descriptions"> for audio description.', {
          selector,
          html: truncatedHtml(el),
          wcag: "1.2.5",
          data: { src, descTrackCount: descTracks.length },
        }),
      );
      continue;
    }

    if (found) {
      issues.push(
        createIssue("pass", `Video has a nearby link to an audio-described version: "${text}"`, {
          selector,
          html: truncatedHtml(el),
          wcag: "1.2.5",
          data: { src, alternativeLinkText: text },
        }),
      );
      continue;
    }

    // Flag videos that likely need audio description
    const likelyNeedsAD = !isMuted && (duration === null || duration > MIN_DURATION_FOR_AD);

    if (likelyNeedsAD) {
      issues.push(
        createIssue(
          "warning",
          `Video has no audio description track or alternative link${duration !== null ? ` (${duration.toFixed(1)}s)` : ""}.`,
          {
            selector,
            html: truncatedHtml(el),
            wcag: "1.2.5",
            suggestion:
              'Add <track kind="descriptions" src="descriptions.vtt" srclang="en"> or provide a link to an audio-described version of the video.',
            data: { src, duration, isMuted },
          },
        ),
      );
    } else {
      issues.push(
        createIssue(
          "info",
          `Video without audio description${isMuted ? " (muted)" : ""}${duration !== null && duration <= MIN_DURATION_FOR_AD ? ` (${duration.toFixed(1)}s — short)` : ""}.`,
          {
            selector,
            html: truncatedHtml(el),
            wcag: "1.2.5",
            data: { src, duration, isMuted },
          },
        ),
      );
    }
  }

  if (videos.length === 0) {
    issues.push(noElementsIssue("info", "video elements", "1.2.5"));
  }

  return { issues, data };
}

/** Search siblings and parent for a link to an audio-described version. */
function findAlternativeLink(videoEl: Element): { found: boolean; text: string | null } {
  const parent = videoEl.parentElement;
  if (!parent) return { found: false, text: null };

  // Search within the parent container and the figure wrapper
  const searchRoot = videoEl.closest("figure") ?? parent;
  const links = queryAll("a", searchRoot);

  for (const link of links) {
    const text = link.textContent?.trim() ?? "";
    const ariaLabel = link.getAttribute("aria-label") ?? "";
    const title = link.getAttribute("title") ?? "";

    if (
      AD_LINK_PATTERN.test(text) ||
      AD_LINK_PATTERN.test(ariaLabel) ||
      AD_LINK_PATTERN.test(title)
    ) {
      return { found: true, text: text || ariaLabel || title };
    }
  }

  return { found: false, text: null };
}
