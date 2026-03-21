import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { isBookmarkletOverlay } from "../shared/accessibility.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { AriaData } from "./types.js";

/** WAI-ARIA 1.2 valid roles. */
const VALID_ROLES = new Set([
  "alert",
  "alertdialog",
  "application",
  "article",
  "banner",
  "blockquote",
  "button",
  "caption",
  "cell",
  "checkbox",
  "code",
  "columnheader",
  "combobox",
  "command",
  "complementary",
  "composite",
  "contentinfo",
  "definition",
  "deletion",
  "dialog",
  "directory",
  "document",
  "emphasis",
  "feed",
  "figure",
  "form",
  "generic",
  "grid",
  "gridcell",
  "group",
  "heading",
  "img",
  "input",
  "insertion",
  "landmark",
  "link",
  "list",
  "listbox",
  "listitem",
  "log",
  "main",
  "mark",
  "marquee",
  "math",
  "menu",
  "menubar",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "meter",
  "navigation",
  "none",
  "note",
  "option",
  "paragraph",
  "presentation",
  "progressbar",
  "radio",
  "radiogroup",
  "range",
  "region",
  "roletype",
  "row",
  "rowgroup",
  "rowheader",
  "scrollbar",
  "search",
  "searchbox",
  "section",
  "sectionhead",
  "select",
  "separator",
  "slider",
  "spinbutton",
  "status",
  "strong",
  "structure",
  "subscript",
  "superscript",
  "switch",
  "tab",
  "table",
  "tablist",
  "tabpanel",
  "term",
  "textbox",
  "time",
  "timer",
  "toolbar",
  "tooltip",
  "tree",
  "treegrid",
  "treeitem",
  "widget",
  "window",
]);

/** Implicit roles (subset) — elements with implicit ARIA roles. */
const IMPLICIT_ROLES: Record<string, string> = {
  a: "link",
  button: "button",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  h5: "heading",
  h6: "heading",
  input: "textbox",
  img: "img",
  nav: "navigation",
  main: "main",
  header: "banner",
  footer: "contentinfo",
  aside: "complementary",
  select: "listbox",
  textarea: "textbox",
  ul: "list",
  ol: "list",
  li: "listitem",
  table: "table",
  tr: "row",
  td: "cell",
  th: "columnheader",
  form: "form",
  section: "region",
  article: "article",
  dialog: "dialog",
  details: "group",
  progress: "progressbar",
  meter: "meter",
  option: "option",
};

/** Required ARIA properties for specific roles. */
const REQUIRED_PROPS: Record<string, string[]> = {
  checkbox: ["aria-checked"],
  combobox: ["aria-expanded"],
  heading: ["aria-level"],
  meter: ["aria-valuenow"],
  option: ["aria-selected"],
  radio: ["aria-checked"],
  scrollbar: ["aria-controls", "aria-valuenow"],
  separator: [],
  slider: ["aria-valuenow"],
  spinbutton: ["aria-valuenow"],
  switch: ["aria-checked"],
};

const FOCUSABLE_INSIDE =
  'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

const REFERENCE_ATTRS = [
  "aria-labelledby",
  "aria-describedby",
  "aria-controls",
  "aria-owns",
  "aria-errormessage",
  "aria-flowto",
  "aria-activedescendant",
];

export function auditAria(): AuditOutput<AriaData[]> {
  const issues: Issue[] = [];
  const data: AriaData[] = [];

  // Check elements with role attribute
  const roleElements = queryAll("[role]");
  for (const el of roleElements) {
    if (isBookmarkletOverlay(el)) continue;

    const selector = uniqueSelector(el);
    const tagName = el.tagName.toLowerCase();
    const role = el.getAttribute("role") ?? "";

    // Invalid role
    if (!VALID_ROLES.has(role)) {
      data.push({ selector, tagName, role, issueType: "invalid-role", detail: role });
      issues.push(
        createIssue("error", `Invalid ARIA role: "${role}".`, {
          selector,
          html: truncatedHtml(el),
          wcag: "4.1.2",
          suggestion:
            "Use a valid WAI-ARIA 1.2 role. See w3.org/TR/wai-aria-1.2/#role_definitions.",
          data: { role, tagName },
        }),
      );
      continue;
    }

    // Redundant role
    const implicitRole = IMPLICIT_ROLES[tagName];
    if (implicitRole === role) {
      data.push({
        selector,
        tagName,
        role,
        issueType: "redundant-role",
        detail: `${tagName} already has implicit role="${role}"`,
      });
      issues.push(
        createIssue("info", `Redundant role="${role}" on <${tagName}> (already implicit).`, {
          selector,
          html: truncatedHtml(el),
          wcag: "4.1.2",
          suggestion: `Remove role="${role}" — <${tagName}> has this role by default.`,
          data: { role, tagName },
        }),
      );
      continue;
    }

    // Required properties check
    const required = REQUIRED_PROPS[role];
    if (required) {
      // Skip native elements that provide the property implicitly
      const isNative =
        implicitRole === role ||
        (tagName === "input" && ["checkbox", "radio"].includes(el.getAttribute("type") ?? ""));

      if (!isNative) {
        for (const prop of required) {
          if (!el.hasAttribute(prop)) {
            data.push({
              selector,
              tagName,
              role,
              issueType: "missing-required-prop",
              detail: prop,
            });
            issues.push(
              createIssue("error", `role="${role}" requires ${prop} but it's missing.`, {
                selector,
                html: truncatedHtml(el),
                wcag: "4.1.2",
                suggestion: `Add ${prop} attribute to the element with role="${role}".`,
                data: { role, missingProp: prop },
              }),
            );
          }
        }
      }
    }

    data.push({ selector, tagName, role, issueType: "valid", detail: "" });
  }

  // Check aria-hidden="true" with focusable descendants
  const ariaHidden = queryAll('[aria-hidden="true"]');
  for (const el of ariaHidden) {
    if (isBookmarkletOverlay(el)) continue;

    const focusables = el.querySelectorAll(FOCUSABLE_INSIDE);
    if (focusables.length > 0) {
      const selector = uniqueSelector(el);
      data.push({
        selector,
        tagName: el.tagName.toLowerCase(),
        role: null,
        issueType: "aria-hidden-focusable",
        detail: `${focusables.length} focusable(s)`,
      });
      issues.push(
        createIssue(
          "error",
          `aria-hidden="true" contains ${focusables.length} focusable element(s).`,
          {
            selector,
            html: truncatedHtml(el),
            wcag: "4.1.2",
            suggestion:
              'Remove aria-hidden="true" or set tabindex="-1" on all focusable descendants.',
            data: { focusableCount: focusables.length },
          },
        ),
      );
    }
  }

  // Check broken ID references
  for (const attr of REFERENCE_ATTRS) {
    const elements = queryAll(`[${attr}]`);
    for (const el of elements) {
      if (isBookmarkletOverlay(el)) continue;

      const value = el.getAttribute(attr) ?? "";
      const ids = value.split(/\s+/).filter(Boolean);
      for (const id of ids) {
        if (!document.getElementById(id)) {
          const selector = uniqueSelector(el);
          data.push({
            selector,
            tagName: el.tagName.toLowerCase(),
            role: el.getAttribute("role"),
            issueType: "broken-reference",
            detail: `${attr}="${id}"`,
          });
          issues.push(
            createIssue("error", `${attr} references ID "${id}" which does not exist.`, {
              selector,
              html: truncatedHtml(el),
              wcag: "1.3.1",
              suggestion: `Add an element with id="${id}" or fix the reference.`,
              data: { attr, id },
            }),
          );
        }
      }
    }
  }

  if (roleElements.length === 0 && ariaHidden.length === 0) {
    issues.push(
      createIssue("info", "No ARIA roles or aria-hidden elements found.", {
        wcag: "4.1.2",
      }),
    );
  }

  return { issues, data };
}
