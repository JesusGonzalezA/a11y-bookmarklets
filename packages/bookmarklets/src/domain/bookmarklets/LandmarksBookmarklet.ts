/**
 * Landmarks bookmarklet — audits semantic landmark regions.
 *
 * WCAG: 1.3.1 Info and Relationships, 2.4.1 Bypass Blocks
 */

import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { queryAll, uniqueSelector, truncatedHtml } from "../../infrastructure/dom/DomUtils.js";
import { addLabel, addOutline, showPanel } from "../../infrastructure/overlay/OverlayManager.js";
import { LANDMARKS_CATALOG } from "../../catalog/landmarks.js";

interface LandmarkData {
  role: string;
  label: string;
  selector: string;
}

const LANDMARK_COLORS: Record<string, string> = {
  banner: "#e74c3c",
  navigation: "#e67e22",
  main: "#2ecc71",
  complementary: "#3498db",
  contentinfo: "#9b59b6",
  form: "#1abc9c",
  search: "#f39c12",
  region: "#95a5a6",
};

const TAG_TO_ROLE: Record<string, string> = {
  header: "banner",
  nav: "navigation",
  main: "main",
  aside: "complementary",
  footer: "contentinfo",
  form: "form",
  search: "search",
};

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

function getAccessibleName(el: Element): string {
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;

  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy) {
    return labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
      .join(" ");
  }

  return "";
}

export class LandmarksBookmarklet extends Bookmarklet<LandmarkData[]> {
  constructor() {
    super(LANDMARKS_CATALOG);
  }

  protected audit(): AuditOutput<LandmarkData[]> {
    const candidates = queryAll(
      'header, nav, main, aside, footer, form, section, search, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="form"], [role="search"], [role="region"]',
    );

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

      issues.push({
        severity: "info",
        message: `${role}${label ? `: "${label}"` : ""}`,
        selector,
        html: truncatedHtml(el),
        wcag: "1.3.1",
        data: { role, label },
      });
    }

    if (!roleCounts["main"]) {
      issues.push({
        severity: "error",
        message: "No main landmark found.",
        selector: "html",
        html: "",
        wcag: "2.4.1",
        suggestion: "Add a <main> element to wrap the primary content.",
      });
    }

    if ((roleCounts["main"] ?? 0) > 1) {
      issues.push({
        severity: "warning",
        message: `Multiple main landmarks found (${roleCounts["main"]}).`,
        selector: "html",
        html: "",
        wcag: "1.3.1",
        suggestion: "Use a single <main> element for the primary content.",
      });
    }

    for (const [role, count] of Object.entries(roleCounts)) {
      if (count > 1) {
        const withoutName = landmarks.filter((l) => l.role === role && !l.label);
        if (withoutName.length > 0) {
          const el = document.querySelector(withoutName[0].selector);
          issues.push({
            severity: "warning",
            message: `Multiple "${role}" landmarks (${count}) — ${withoutName.length} without accessible name.`,
            selector: withoutName[0].selector,
            html: el ? truncatedHtml(el) : "",
            wcag: "1.3.1",
            suggestion: `Add aria-label or aria-labelledby to distinguish duplicate ${role} landmarks.`,
          });
        }
      }
    }

    if (!roleCounts["navigation"]) {
      issues.push({
        severity: "info",
        message: "No navigation landmark found.",
        selector: "html",
        html: "",
        wcag: "2.4.1",
      });
    }

    return { issues, data: landmarks };
  }

  protected render(landmarks: LandmarkData[]): void {
    for (const lm of landmarks) {
      const el = document.querySelector(lm.selector);
      if (!el) continue;

      const color = LANDMARK_COLORS[lm.role] ?? "#666";
      const labelText = lm.label ? `${lm.role} ("${lm.label}")` : lm.role;

      addOutline(el, color);
      addLabel(el, { text: labelText, bgColor: color });
    }

    const summary = landmarks
      .map((l) => `  ${l.role}${l.label ? ` — "${l.label}"` : ""}`)
      .join("\n");

    showPanel(`
      <strong>Landmarks (${landmarks.length})</strong>
      <pre style="font-size:11px; margin:8px 0 0; white-space:pre-wrap;">${summary}</pre>
    `);
  }
}
