import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay, isElementVisible } from "../shared/accessibility.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { CognitiveLoadBreakdown, CognitiveLoadData, CognitiveLoadElement } from "./types.js";

function isAboveFold(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight;
}

function countWordsAboveFold(): number {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let count = 0;
  let node: Node | null;

  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent) continue;
    if (isBookmarkletOverlay(parent)) continue;

    const style = getComputedStyle(parent);
    if (style.display === "none" || style.visibility === "hidden") continue;

    const rect = parent.getBoundingClientRect();
    if (rect.top >= window.innerHeight) continue;

    const text = node.textContent?.trim() ?? "";
    if (text) {
      count += text.split(/\s+/).length;
    }
  }

  return count;
}

function findInfiniteAnimations(): Element[] {
  const results: Element[] = [];

  for (const el of queryAll("*")) {
    if (isBookmarkletOverlay(el)) continue;
    const style = getComputedStyle(el);
    if (style.animationIterationCount === "infinite" && style.animationName !== "none") {
      results.push(el);
    }
  }

  // Also check Web Animations API
  if (typeof document.getAnimations === "function") {
    for (const anim of document.getAnimations()) {
      if (anim.effect instanceof KeyframeEffect && anim.effect.target) {
        const timing = anim.effect.getComputedTiming();
        if (timing.iterations === Infinity) {
          const target = anim.effect.target as Element;
          if (!results.includes(target) && !isBookmarkletOverlay(target)) {
            results.push(target);
          }
        }
      }
    }
  }

  return results;
}

function findAutoplayMedia(): Element[] {
  return queryAll("video[autoplay], audio[autoplay]").filter(
    (el) => !(el as HTMLMediaElement).muted,
  );
}

const MODAL_SELECTOR = [
  "[role='dialog']",
  "[role='alertdialog']",
  "dialog[open]",
  "[aria-modal='true']",
  ".modal:not([style*='display: none']):not([style*='display:none'])",
  ".popup:not([style*='display: none']):not([style*='display:none'])",
].join(", ");

function findVisibleModals(): Element[] {
  return queryAll(MODAL_SELECTOR).filter(
    (el) => isElementVisible(el) && !isBookmarkletOverlay(el),
  );
}

const CAROUSEL_SELECTOR = [
  "[data-carousel]",
  "[data-slider]",
  "[data-slick]",
  "[data-swiper]",
  ".carousel",
  ".slider",
  ".swiper",
  ".slick-slider",
  ".owl-carousel",
].join(", ");

function findAutoCarousels(): Element[] {
  return queryAll(CAROUSEL_SELECTOR).filter((el) => {
    if (!isElementVisible(el) || isBookmarkletOverlay(el)) return false;
    // Check for auto-rotation attributes
    const dataset = (el as HTMLElement).dataset;
    return (
      dataset.autoplay !== undefined ||
      dataset.auto !== undefined ||
      el.hasAttribute("data-interval") ||
      el.querySelector("[data-autoslide], [data-autoplay]") !== null
    );
  });
}

const CTA_SELECTOR = [
  "a[href]:not([role='navigation'] a)",
  "button:not([type='reset']):not([type='button'])",
  "[role='button']",
  "input[type='submit']",
].join(", ");

function countCTAsAboveFold(): Element[] {
  return queryAll(CTA_SELECTOR).filter((el) => {
    if (!isElementVisible(el) || isBookmarkletOverlay(el)) return false;
    if (!isAboveFold(el)) return false;

    // Filter to "prominent" CTAs: large enough to be a call to action
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const hasBackground = style.backgroundColor !== "rgba(0, 0, 0, 0)" && style.backgroundColor !== "transparent";
    const isLargeEnough = rect.width >= 80 && rect.height >= 30;

    return hasBackground && isLargeEnough;
  });
}

export function auditCognitiveLoad(): AuditOutput<CognitiveLoadData> {
  const issues: Issue[] = [];
  const elements: CognitiveLoadElement[] = [];

  const infiniteAnims = findInfiniteAnimations();
  const autoplay = findAutoplayMedia();
  const modals = findVisibleModals();
  const carousels = findAutoCarousels();
  const ctas = countCTAsAboveFold();
  const wordCount = countWordsAboveFold();

  const breakdown: CognitiveLoadBreakdown = {
    infiniteAnimations: infiniteAnims.length,
    autoplayMedia: autoplay.length,
    visibleModals: modals.length,
    autoCarousels: carousels.length,
    ctaAboveFold: ctas.length,
    wordsAboveFold: wordCount,
  };

  // Calculate score (0–100, lower is better)
  let score = 0;
  score += infiniteAnims.length * 10;
  score += autoplay.length * 15;
  score += modals.length * 10;
  score += carousels.length * 10;
  score += Math.max(0, ctas.length - 3) * 5;
  if (wordCount > 800) score += 10;
  score = Math.min(100, score);

  // Report infinite animations
  for (const el of infiniteAnims) {
    const selector = uniqueSelector(el);
    elements.push({ selector, type: "infinite-animation", label: el.tagName.toLowerCase() });
    issues.push(
      createIssue("warning", `Infinite CSS animation on ${el.tagName.toLowerCase()}`, {
        selector,
        html: truncatedHtml(el),
        wcag: "2.2.2",
        suggestion: "Provide a mechanism to pause, stop, or hide the animation.",
        data: { type: "infinite-animation" },
      }),
    );
  }

  // Report autoplay media
  for (const el of autoplay) {
    const selector = uniqueSelector(el);
    elements.push({ selector, type: "autoplay-media", label: el.tagName.toLowerCase() });
    issues.push(
      createIssue("error", `Autoplay ${el.tagName.toLowerCase()} with audio`, {
        selector,
        html: truncatedHtml(el),
        wcag: "1.4.2",
        suggestion: "Remove autoplay, mute by default, or provide a mechanism to stop/pause within 3 seconds.",
        data: { type: "autoplay-media" },
      }),
    );
  }

  // Report modals
  for (const el of modals) {
    const selector = uniqueSelector(el);
    elements.push({ selector, type: "modal", label: el.tagName.toLowerCase() });
    issues.push(
      createIssue("info", `Visible modal/popup: ${el.tagName.toLowerCase()}`, {
        selector,
        html: truncatedHtml(el),
        data: { type: "modal" },
      }),
    );
  }

  // Report carousels
  for (const el of carousels) {
    const selector = uniqueSelector(el);
    elements.push({ selector, type: "auto-carousel", label: el.tagName.toLowerCase() });
    issues.push(
      createIssue("warning", "Automatic carousel/slider detected", {
        selector,
        html: truncatedHtml(el),
        wcag: "2.2.2",
        suggestion: "Provide pause/stop controls and disable auto-rotation on user interaction.",
        data: { type: "auto-carousel" },
      }),
    );
  }

  // Report competing CTAs
  if (ctas.length > 3) {
    issues.push(
      createIssue(
        "warning",
        `${ctas.length} competing calls-to-action above the fold (>3 is excessive).`,
        {
          suggestion: "Reduce the number of prominent CTAs to help users focus on the primary action.",
          data: { ctaCount: ctas.length },
        },
      ),
    );
  }

  // Report text density
  if (wordCount > 800) {
    issues.push(
      createIssue("warning", `High text density above fold: ${wordCount} words.`, {
        suggestion: "Consider breaking content into sections or using progressive disclosure.",
        data: { wordsAboveFold: wordCount },
      }),
    );
  }

  // Overall score issue
  const severity = score === 0 ? "pass" : score <= 20 ? "pass" : score <= 50 ? "warning" : "error";
  issues.push(
    createIssue(
      severity,
      `Cognitive load score: ${score}/100 (${score <= 20 ? "low" : score <= 50 ? "moderate" : "high"})`,
      {
        data: { score, breakdown },
      },
    ),
  );

  return {
    issues,
    data: { score, breakdown, elements },
  };
}
