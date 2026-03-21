import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay } from "../shared/accessibility.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { LiveRegionData } from "./types.js";

/** Roles that implicitly create live regions. */
const LIVE_ROLES: Record<string, string> = {
  alert: "assertive",
  status: "polite",
  log: "polite",
  marquee: "off",
  timer: "off",
};

const VALID_LIVE_VALUES = new Set(["off", "polite", "assertive"]);
const VALID_RELEVANT_TOKENS = new Set(["additions", "removals", "text", "all"]);

export function auditLiveRegions(): AuditOutput<LiveRegionData[]> {
  const issues: Issue[] = [];
  const data: LiveRegionData[] = [];
  const seen = new Set<Element>();

  // 1. Explicit aria-live
  for (const el of queryAll("[aria-live]")) {
    if (isBookmarkletOverlay(el) || seen.has(el)) continue;
    seen.add(el);

    const liveValue = el.getAttribute("aria-live") ?? "";
    const role = el.getAttribute("role");
    const atomic = el.getAttribute("aria-atomic");
    const relevant = el.getAttribute("aria-relevant");
    const hasContent = (el.textContent ?? "").trim().length > 0;
    const selector = uniqueSelector(el);

    data.push({
      selector,
      tagName: el.tagName.toLowerCase(),
      liveValue,
      role,
      atomic,
      relevant,
      hasContent,
    });

    if (!VALID_LIVE_VALUES.has(liveValue)) {
      issues.push(
        createIssue("error", `Invalid aria-live="${liveValue}".`, {
          selector,
          html: truncatedHtml(el),
          wcag: "4.1.3",
          suggestion: "Use one of: off, polite, assertive.",
          data: { liveValue },
        }),
      );
    } else if (liveValue === "assertive") {
      issues.push(
        createIssue(
          "warning",
          `aria-live="assertive" interrupts the user. Use "polite" unless urgent.`,
          {
            selector,
            html: truncatedHtml(el),
            wcag: "4.1.3",
            suggestion: 'Prefer aria-live="polite" unless the update is time-critical.',
            data: { liveValue },
          },
        ),
      );
    } else if (liveValue === "polite") {
      issues.push(
        createIssue("pass", `aria-live="polite" live region found.`, {
          selector,
          html: truncatedHtml(el),
          wcag: "4.1.3",
          data: { liveValue },
        }),
      );
    }

    // Validate aria-relevant tokens
    if (relevant) {
      const tokens = relevant.split(/\s+/);
      const invalid = tokens.filter((t) => !VALID_RELEVANT_TOKENS.has(t));
      if (invalid.length > 0) {
        issues.push(
          createIssue("error", `Invalid aria-relevant token(s): ${invalid.join(", ")}.`, {
            selector,
            html: truncatedHtml(el),
            wcag: "4.1.3",
            suggestion: "Valid tokens: additions, removals, text, all.",
            data: { invalidTokens: invalid },
          }),
        );
      }
    }
  }

  // 2. Implicit live regions via role
  for (const [role, implicitLive] of Object.entries(LIVE_ROLES)) {
    for (const el of queryAll(`[role="${role}"]`)) {
      if (isBookmarkletOverlay(el) || seen.has(el)) continue;
      seen.add(el);

      const explicitLive = el.getAttribute("aria-live");
      const atomic = el.getAttribute("aria-atomic");
      const relevant = el.getAttribute("aria-relevant");
      const hasContent = (el.textContent ?? "").trim().length > 0;
      const selector = uniqueSelector(el);

      data.push({
        selector,
        tagName: el.tagName.toLowerCase(),
        liveValue: explicitLive ?? implicitLive,
        role,
        atomic,
        relevant,
        hasContent,
      });

      if (explicitLive && explicitLive !== implicitLive) {
        issues.push(
          createIssue(
            "warning",
            `role="${role}" has implicit live="${implicitLive}" but explicit aria-live="${explicitLive}".`,
            {
              selector,
              html: truncatedHtml(el),
              wcag: "4.1.3",
              suggestion: `Consider removing aria-live since role="${role}" implies live="${implicitLive}".`,
              data: { role, implicitLive, explicitLive },
            },
          ),
        );
      } else {
        issues.push(
          createIssue("pass", `role="${role}" creates an implicit live region (${implicitLive}).`, {
            selector,
            html: truncatedHtml(el),
            wcag: "4.1.3",
            data: { role, implicitLive },
          }),
        );
      }
    }
  }

  // 3. Native <output> element (implicit status role)
  for (const el of queryAll("output")) {
    if (isBookmarkletOverlay(el) || seen.has(el)) continue;
    seen.add(el);

    const selector = uniqueSelector(el);
    data.push({
      selector,
      tagName: "output",
      liveValue: el.getAttribute("aria-live") ?? "polite",
      role: "status",
      atomic: el.getAttribute("aria-atomic"),
      relevant: el.getAttribute("aria-relevant"),
      hasContent: (el.textContent ?? "").trim().length > 0,
    });
    issues.push(
      createIssue("pass", "<output> element found (implicit role=status, live=polite).", {
        selector,
        html: truncatedHtml(el),
        wcag: "4.1.3",
        data: { role: "status" },
      }),
    );
  }

  if (data.length === 0) {
    issues.push(createIssue("info", "No live regions found on this page.", { wcag: "4.1.3" }));
  }

  return { issues, data };
}
