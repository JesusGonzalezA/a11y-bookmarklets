/**
 * Landmarks bookmarklet
 *
 * Audits semantic landmark regions (header, nav, main, aside, footer, form, search).
 *
 * WCAG: 1.3.1 Info and Relationships, 2.4.1 Bypass Blocks
 */

import type { AuditResult, BookmarkletOptions, Issue } from "@bookmarklets-a11y/core";
import {
  queryAll,
  uniqueSelector,
  truncatedHtml,
  buildResult,
  clearOverlays,
  addLabel,
  addOutline,
  showPanel,
} from "@bookmarklets-a11y/core";

const BOOKMARKLET_ID = "landmarks";

interface LandmarkInfo {
  role: string;
  label: string;
  selector: string;
  element: Element;
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

function getLandmarkRole(el: Element): string | null {
  const explicit = el.getAttribute("role");
  if (explicit) return explicit;

  const tag = el.tagName.toLowerCase();
  const map: Record<string, string> = {
    header: "banner",
    nav: "navigation",
    main: "main",
    aside: "complementary",
    footer: "contentinfo",
    form: "form",
    search: "search",
  };

  // header/footer inside article/aside/main/nav/section are NOT landmarks
  if (tag === "header" || tag === "footer") {
    const parent = el.parentElement;
    if (parent) {
      const parentTag = parent.tagName.toLowerCase();
      if (["article", "aside", "main", "nav", "section"].includes(parentTag)) {
        return null;
      }
    }
  }

  // form is only a landmark if it has an accessible name
  if (tag === "form") {
    if (!el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby")) {
      return null;
    }
  }

  // section is a landmark only with accessible name
  if (tag === "section") {
    if (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby")) {
      return "region";
    }
    return null;
  }

  return map[tag] ?? null;
}

function getAccessibleName(el: Element): string {
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;

  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy) {
    const parts = labelledBy.split(/\s+/).map((id) => {
      const ref = document.getElementById(id);
      return ref?.textContent?.trim() ?? "";
    });
    return parts.join(" ");
  }

  return "";
}

function auditLandmarks(): { issues: Issue[]; landmarks: LandmarkInfo[] } {
  // Select both semantic HTML elements and elements with explicit landmark roles
  const candidates = queryAll(
    'header, nav, main, aside, footer, form, section, search, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="form"], [role="search"], [role="region"]',
  );

  const issues: Issue[] = [];
  const landmarks: LandmarkInfo[] = [];
  const roleCounts: Record<string, number> = {};

  for (const el of candidates) {
    const role = getLandmarkRole(el);
    if (!role) continue;

    const label = getAccessibleName(el);
    const selector = uniqueSelector(el);

    landmarks.push({ role, label, selector, element: el });
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

  // Check: no main landmark
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

  // Check: multiple main landmarks
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

  // Check: duplicate roles without accessible names
  for (const [role, count] of Object.entries(roleCounts)) {
    if (count > 1) {
      const withoutName = landmarks.filter((l) => l.role === role && !l.label);
      if (withoutName.length > 0) {
        issues.push({
          severity: "warning",
          message: `Multiple "${role}" landmarks (${count}) — ${withoutName.length} without accessible name.`,
          selector: withoutName[0].selector,
          html: truncatedHtml(withoutName[0].element),
          wcag: "1.3.1",
          suggestion: `Add aria-label or aria-labelledby to distinguish duplicate ${role} landmarks.`,
        });
      }
    }
  }

  // Check: no navigation landmark
  if (!roleCounts["navigation"]) {
    issues.push({
      severity: "info",
      message: "No navigation landmark found.",
      selector: "html",
      html: "",
      wcag: "2.4.1",
    });
  }

  return { issues, landmarks };
}

function renderVisual(landmarks: LandmarkInfo[]): void {
  clearOverlays();

  for (const lm of landmarks) {
    const el = lm.element;
    const color = LANDMARK_COLORS[lm.role] ?? "#666";
    const labelText = lm.label ? `${lm.role} ("${lm.label}")` : lm.role;

    addOutline(el, color);
    addLabel(el, { text: labelText, bgColor: color });
  }

  const summary = landmarks.map((l) => `  ${l.role}${l.label ? ` — "${l.label}"` : ""}`).join("\n");
  showPanel(`
    <strong>Landmarks (${landmarks.length})</strong>
    <pre style="font-size:11px; margin:8px 0 0; white-space:pre-wrap;">${summary}</pre>
  `);
}

export function run(options: BookmarkletOptions = {}): AuditResult {
  const mode = options.mode ?? "both";
  const { issues, landmarks } = auditLandmarks();

  if (mode === "visual" || mode === "both") {
    renderVisual(landmarks);
  }

  const result = buildResult(BOOKMARKLET_ID, issues);

  (window as any).__a11y = (window as any).__a11y ?? {};
  (window as any).__a11y[BOOKMARKLET_ID] = { audit: () => run({ mode: "data" }), lastResult: result };

  return result;
}

run();
