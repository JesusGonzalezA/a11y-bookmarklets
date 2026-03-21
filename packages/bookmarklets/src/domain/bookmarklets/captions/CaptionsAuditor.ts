import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay } from "../shared/accessibility.js";
import { createIssue, noElementsIssue } from "../shared/issue-helpers.js";
import type { CaptionsData, TrackInfo } from "./types.js";

const CAPTION_KINDS = new Set(["captions", "subtitles"]);

/** Detect embedded video sources (YouTube, Vimeo, etc.) */
const EMBED_PATTERNS: Array<{ pattern: RegExp; name: string }> = [
  { pattern: /youtube\.com|youtu\.be/i, name: "YouTube" },
  { pattern: /vimeo\.com/i, name: "Vimeo" },
  { pattern: /dailymotion\.com/i, name: "Dailymotion" },
  { pattern: /wistia\.com|wistia\.net/i, name: "Wistia" },
];

export function auditCaptions(): AuditOutput<CaptionsData[]> {
  const issues: Issue[] = [];
  const data: CaptionsData[] = [];

  // Audit native <video> elements
  const videos = queryAll("video");
  for (const el of videos) {
    if (isBookmarkletOverlay(el)) continue;
    auditVideoElement(el as HTMLVideoElement, issues, data);
  }

  // Audit embedded video iframes
  const iframes = queryAll("iframe");
  for (const el of iframes) {
    if (isBookmarkletOverlay(el)) continue;
    auditEmbeddedVideo(el as HTMLIFrameElement, issues, data);
  }

  if (videos.length === 0 && data.length === 0) {
    issues.push(noElementsIssue("info", "video elements", "1.2.2"));
  }

  return { issues, data };
}

function auditVideoElement(el: HTMLVideoElement, issues: Issue[], data: CaptionsData[]): void {
  const selector = uniqueSelector(el);
  const src = el.src || el.querySelector("source")?.src || "";
  const trackElements = queryAll("track", el);
  const tracks: TrackInfo[] = [];

  for (const track of trackElements) {
    const kind = track.getAttribute("kind") ?? "";
    const trackSrc = track.getAttribute("src") ?? "";
    const srclang = track.getAttribute("srclang") ?? "";
    const label = track.getAttribute("label") ?? "";

    let isValid = true;
    let validationError: string | null = null;

    if (!trackSrc) {
      isValid = false;
      validationError = "Track has no src attribute.";
    } else if (!srclang && CAPTION_KINDS.has(kind)) {
      isValid = false;
      validationError = "Caption/subtitle track has no srclang attribute.";
    }

    tracks.push({ kind, src: trackSrc, srclang, label, isValid, validationError });
  }

  const captionTracks = tracks.filter((t) => CAPTION_KINDS.has(t.kind));

  data.push({ selector, src, tracks, isEmbedded: false, embedType: null });

  if (captionTracks.length === 0) {
    issues.push(
      createIssue("error", "Video has no caption or subtitle tracks.", {
        selector,
        html: truncatedHtml(el),
        wcag: "1.2.2",
        suggestion:
          'Add <track kind="captions" src="captions.vtt" srclang="en" label="English"> inside the <video> element.',
        data: { src, trackCount: tracks.length },
      }),
    );
  } else {
    for (const track of captionTracks) {
      if (!track.isValid) {
        issues.push(
          createIssue("warning", `Caption track issue: ${track.validationError}`, {
            selector,
            html: truncatedHtml(el),
            wcag: "1.2.2",
            suggestion: "Ensure each caption track has a valid src and srclang attribute.",
            data: { trackKind: track.kind, trackSrc: track.src, srclang: track.srclang },
          }),
        );
      } else {
        issues.push(
          createIssue("pass", `Video has ${track.kind} track: "${track.label || track.srclang}"`, {
            selector,
            html: truncatedHtml(el),
            wcag: "1.2.2",
            data: { trackKind: track.kind, srclang: track.srclang, label: track.label },
          }),
        );
      }
    }
  }

  // Check for non-caption tracks info
  const otherTracks = tracks.filter((t) => !CAPTION_KINDS.has(t.kind));
  if (otherTracks.length > 0) {
    issues.push(
      createIssue(
        "info",
        `Video also has ${otherTracks.length} non-caption track(s): ${otherTracks.map((t) => t.kind).join(", ")}`,
        { selector, wcag: "1.2.2", data: { otherTracks: otherTracks.map((t) => t.kind) } },
      ),
    );
  }
}

function auditEmbeddedVideo(el: HTMLIFrameElement, issues: Issue[], data: CaptionsData[]): void {
  const src = el.src || "";
  const embedMatch = EMBED_PATTERNS.find((p) => p.pattern.test(src));
  if (!embedMatch) return;

  const selector = uniqueSelector(el);

  data.push({
    selector,
    src,
    tracks: [],
    isEmbedded: true,
    embedType: embedMatch.name,
  });

  issues.push(
    createIssue(
      "info",
      `Embedded ${embedMatch.name} video — captions cannot be verified programmatically. Check the platform's caption settings.`,
      {
        selector,
        html: truncatedHtml(el),
        wcag: "1.2.2",
        suggestion: `Verify that captions are enabled in ${embedMatch.name}'s player settings or that the video has uploaded caption tracks.`,
        data: { embedType: embedMatch.name, src },
      },
    ),
  );
}
