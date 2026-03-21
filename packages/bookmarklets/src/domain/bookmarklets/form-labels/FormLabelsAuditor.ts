import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { createIssue, noElementsIssue } from "../shared/issue-helpers.js";
import type { FormLabelData, NameSource } from "./types.js";

const CONTROL_SELECTOR =
  'input:not([type="hidden"]), select, textarea, [role="textbox"], [role="combobox"], [role="listbox"], [role="searchbox"], [role="spinbutton"]';

function resolveNameSource(el: Element): { source: NameSource; name: string } {
  // 1. aria-labelledby
  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy) {
    const name = labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
      .join(" ")
      .trim();
    if (name) return { source: "aria-labelledby", name };
  }

  // 2. aria-label
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel?.trim()) return { source: "aria-label", name: ariaLabel.trim() };

  // 3. label[for] explicit
  const id = el.getAttribute("id");
  if (id) {
    const label = document.querySelector(`label[for="${CSS.escape(id)}"]`);
    if (label?.textContent?.trim()) {
      return { source: "label-for", name: label.textContent.trim() };
    }
  }

  // 4. label wrapping (implicit)
  const wrappingLabel = el.closest("label");
  if (wrappingLabel?.textContent?.trim()) {
    return { source: "label-wrap", name: wrappingLabel.textContent.trim() };
  }

  // 5. title
  const title = el.getAttribute("title");
  if (title?.trim()) return { source: "title", name: title.trim() };

  // 6. placeholder (not sufficient alone)
  const placeholder = el.getAttribute("placeholder");
  if (placeholder?.trim()) return { source: "placeholder", name: placeholder.trim() };

  return { source: "none", name: "" };
}

export function auditFormLabels(): AuditOutput<FormLabelData[]> {
  const controls = queryAll(CONTROL_SELECTOR);
  const issues: Issue[] = [];
  const data: FormLabelData[] = [];

  for (const el of controls) {
    const selector = uniqueSelector(el);
    const tagName = el.tagName.toLowerCase();
    const type = el.getAttribute("type") ?? tagName;
    const { source, name } = resolveNameSource(el);
    const hasPlaceholderOnly = source === "placeholder";

    data.push({
      selector,
      tagName,
      type,
      nameSource: source,
      accessibleName: name,
      hasPlaceholderOnly,
    });

    if (source === "none") {
      issues.push(
        createIssue(
          "error",
          `Form control <${tagName}${type !== tagName ? ` type="${type}"` : ""}> has no accessible name.`,
          {
            selector,
            html: truncatedHtml(el),
            wcag: "4.1.2",
            suggestion:
              "Add a <label>, aria-label, or aria-labelledby to provide an accessible name.",
            data: { tagName, type, nameSource: source },
          },
        ),
      );
    } else if (hasPlaceholderOnly) {
      issues.push(
        createIssue("warning", `Form control <${tagName}> relies only on placeholder: "${name}".`, {
          selector,
          html: truncatedHtml(el),
          wcag: "3.3.2",
          suggestion: "Placeholder text disappears on input. Add a visible <label> element.",
          data: { tagName, type, nameSource: source, accessibleName: name },
        }),
      );
    } else {
      issues.push(
        createIssue("pass", `Form control <${tagName}> has label via ${source}: "${name}"`, {
          selector,
          html: truncatedHtml(el),
          wcag: "4.1.2",
          data: { tagName, type, nameSource: source, accessibleName: name },
        }),
      );
    }
  }

  if (controls.length === 0) {
    issues.push(noElementsIssue("info", "form controls", "4.1.2"));
  }

  return { issues, data };
}
