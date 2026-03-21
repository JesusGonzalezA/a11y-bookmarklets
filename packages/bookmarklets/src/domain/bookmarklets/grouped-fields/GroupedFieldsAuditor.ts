import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { getAccessibleName } from "../shared/accessibility.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { GroupedFieldsData } from "./types.js";

export function auditGroupedFields(): AuditOutput<GroupedFieldsData[]> {
  const issues: Issue[] = [];
  const data: GroupedFieldsData[] = [];

  // Check radio groups by name
  const radios = queryAll('input[type="radio"]') as HTMLInputElement[];
  const radioGroups = new Map<string, Element[]>();
  for (const radio of radios) {
    const name = radio.name || "(unnamed)";
    const group = radioGroups.get(name) ?? [];
    group.push(radio);
    radioGroups.set(name, group);
  }

  for (const [name, elements] of radioGroups) {
    if (elements.length < 2) continue;

    const firstEl = elements[0];
    const group = firstEl.closest('fieldset, [role="radiogroup"], [role="group"]');

    if (group) {
      const selector = uniqueSelector(group);
      const legend =
        group.tagName.toLowerCase() === "fieldset"
          ? (group.querySelector("legend")?.textContent?.trim() ?? "")
          : getAccessibleName(group);
      const groupType =
        group.tagName.toLowerCase() === "fieldset"
          ? ("fieldset" as const)
          : group.getAttribute("role") === "radiogroup"
            ? ("role-radiogroup" as const)
            : ("role-group" as const);

      data.push({ selector, groupType, legend, controls: elements.length, name });

      if (!legend) {
        issues.push(
          createIssue(
            "warning",
            `Radio group "${name}" is in a ${groupType} but has no label/legend.`,
            {
              selector,
              html: truncatedHtml(group),
              wcag: "1.3.1",
              suggestion:
                groupType === "fieldset"
                  ? "Add a <legend> inside the <fieldset>."
                  : "Add aria-label or aria-labelledby to the group.",
              data: { name, groupType },
            },
          ),
        );
      } else {
        issues.push(
          createIssue(
            "pass",
            `Radio group "${name}" is properly grouped with legend: "${legend}"`,
            {
              selector,
              html: truncatedHtml(group),
              wcag: "1.3.1",
              data: { name, groupType, legend },
            },
          ),
        );
      }
    } else {
      const selector = uniqueSelector(firstEl);
      data.push({ selector, groupType: "ungrouped", legend: "", controls: elements.length, name });

      issues.push(
        createIssue(
          "error",
          `Radio group "${name}" (${elements.length} radios) is not inside a <fieldset> or role="radiogroup".`,
          {
            selector,
            html: truncatedHtml(firstEl),
            wcag: "1.3.1",
            suggestion:
              'Wrap the radios in <fieldset> with <legend>, or use role="radiogroup" with aria-label.',
            data: { name, count: elements.length },
          },
        ),
      );
    }
  }

  // Check fieldsets without legend
  const fieldsets = queryAll("fieldset");
  for (const fieldset of fieldsets) {
    const legend = fieldset.querySelector("legend")?.textContent?.trim() ?? "";
    const selector = uniqueSelector(fieldset);

    if (!legend && !getAccessibleName(fieldset)) {
      issues.push(
        createIssue("warning", "Fieldset without <legend> or accessible name.", {
          selector,
          html: truncatedHtml(fieldset),
          wcag: "1.3.1",
          suggestion: "Add a <legend> as the first child of the <fieldset>.",
        }),
      );
    }
  }

  // Check checkbox groups by name
  const checkboxes = queryAll('input[type="checkbox"]') as HTMLInputElement[];
  const checkboxGroups = new Map<string, Element[]>();
  for (const cb of checkboxes) {
    const name = cb.name || "";
    if (!name) continue;
    const group = checkboxGroups.get(name) ?? [];
    group.push(cb);
    checkboxGroups.set(name, group);
  }

  for (const [name, elements] of checkboxGroups) {
    if (elements.length < 2) continue;

    const firstEl = elements[0];
    const group = firstEl.closest('fieldset, [role="group"]');

    if (!group) {
      const selector = uniqueSelector(firstEl);
      data.push({ selector, groupType: "ungrouped", legend: "", controls: elements.length, name });

      issues.push(
        createIssue(
          "warning",
          `Checkbox group "${name}" (${elements.length} checkboxes) is not inside a <fieldset> or role="group".`,
          {
            selector,
            html: truncatedHtml(firstEl),
            wcag: "1.3.1",
            suggestion:
              'Wrap the checkboxes in <fieldset> with <legend>, or use role="group" with aria-label.',
            data: { name, count: elements.length },
          },
        ),
      );
    }
  }

  if (radioGroups.size === 0 && fieldsets.length === 0 && checkboxGroups.size === 0) {
    issues.push(
      createIssue("info", "No radio groups, checkbox groups, or fieldsets found.", {
        wcag: "1.3.1",
      }),
    );
  }

  return { issues, data };
}
