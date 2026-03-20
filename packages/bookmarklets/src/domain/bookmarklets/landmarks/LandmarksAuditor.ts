import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { getAccessibleName } from "../shared/accessibility.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { LandmarkData } from "./types.js";
import { TAG_TO_ROLE } from "./types.js";

function getLandmarkRole(el: Element): string | null {
  const explicit = el.getAttribute("role");
  if (explicit) return explicit;

  const tag = el.tagName.toLowerCase();

  if (tag === "header" || tag === "footer") {
    const parent = el.parentElement;
    if (parent) {
      const parentTag = parent.tagName.toLowerCase();
      if (["article", "aside", "main", "nav", "section"].includes(parentTag)) {
        return null;
      }
    }
  }

  if (tag === "form") {
    if (!el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby")) {
      return null;
    }
  }

  if (tag === "section") {
    if (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby")) {
      return "region";
    }
    return null;
  }

  return TAG_TO_ROLE[tag] ?? null;
}

const LANDMARK_SELECTOR =
  'header, nav, main, aside, footer, form, section, search, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="form"], [role="search"], [role="region"]';

export function auditLandmarks(): AuditOutput<LandmarkData[]> {
  const candidates = queryAll(LANDMARK_SELECTOR);
  const issues: Issue[] = [];
  const landmarks: LandmarkData[] = [];
  const roleCounts: Record<string, number> = {};

  for (const el of candidates) {
    const role = getLandmarkRole(el);
    if (!role) continue;

    const label = getAccessibleName(el);
    const selector = uniqueSelector(el);

    landmarks.push({ role, label, selector });
    roleCounts[role] = (roleCounts[role] ?? 0) + 1;

    issues.push(
      createIssue("info", `${role}${label ? `: "${label}"` : ""}`, {
        selector,
        html: truncatedHtml(el),
        wcag: "1.3.1",
        data: { role, label },
      }),
    );
  }

  if (!roleCounts.main) {
    issues.push(
      createIssue("error", "No main landmark found.", {
        wcag: "2.4.1",
        suggestion: "Add a <main> element to wrap the primary content.",
      }),
    );
  }

  if ((roleCounts.main ?? 0) > 1) {
    issues.push(
      createIssue("warning", `Multiple main landmarks found (${roleCounts.main}).`, {
        wcag: "1.3.1",
        suggestion: "Use a single <main> element for the primary content.",
      }),
    );
  }

  for (const [role, count] of Object.entries(roleCounts)) {
    if (count > 1) {
      const withoutName = landmarks.filter((l) => l.role === role && !l.label);
      if (withoutName.length > 0) {
        const el = document.querySelector(withoutName[0].selector);
        issues.push(
          createIssue(
            "warning",
            `Multiple "${role}" landmarks (${count}) — ${withoutName.length} without accessible name.`,
            {
              selector: withoutName[0].selector,
              html: el ? truncatedHtml(el) : "",
              wcag: "1.3.1",
              suggestion: `Add aria-label or aria-labelledby to distinguish duplicate ${role} landmarks.`,
            },
          ),
        );
      }
    }
  }

  if (!roleCounts.navigation) {
    issues.push(createIssue("info", "No navigation landmark found.", { wcag: "2.4.1" }));
  }

  return { issues, data: landmarks };
}
