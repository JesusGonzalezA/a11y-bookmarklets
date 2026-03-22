import { truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { createIssue } from "../shared/issue-helpers.js";
import { loadAxeCore } from "./AxeCoreLoader.js";
import type { AxeCoreData, AxeCoreNode, AxeCoreViolation } from "./types.js";

/** Parse WCAG criteria from axe-core tags like "wcag412" → "4.1.2", "wcag21a" → "2.1 A". */
function parseWcagTags(tags: string[]): string[] {
  const wcagRe = /^wcag(\d)(\d)(\d+)$/;
  const criteria: string[] = [];
  for (const tag of tags) {
    const m = wcagRe.exec(tag);
    if (m) criteria.push(`${m[1]}.${m[2]}.${m[3]}`);
  }
  return criteria;
}

/** Map an axe-core impact string to our severity. */
function impactToSeverity(impact?: string): "error" | "warning" {
  if (impact === "critical" || impact === "serious") return "error";
  return "warning";
}

export async function auditAxeCore(): Promise<AuditOutput<AxeCoreData>> {
  await loadAxeCore();

  const axeResult = await window.axe!.run(document, {
    resultTypes: ["violations", "incomplete", "passes", "inapplicable"],
  });

  const issues: Issue[] = [];
  const violations: AxeCoreViolation[] = [];

  for (const v of axeResult.violations) {
    const wcag = parseWcagTags(v.tags);
    const nodes: AxeCoreNode[] = v.nodes.map((n) => {
      const selectorStr = n.target.join(" ");
      let el: Element | null = null;
      try {
        el = document.querySelector(selectorStr);
      } catch {
        // invalid selector — fall back to target string
      }
      return {
        selector: el ? uniqueSelector(el) : selectorStr,
        html: el ? truncatedHtml(el) : n.html,
        failureSummary: n.failureSummary ?? "",
      };
    });

    violations.push({
      ruleId: v.id,
      description: v.description,
      impact: v.impact ?? "moderate",
      helpUrl: v.helpUrl,
      wcag,
      nodes,
    });

    for (const node of nodes) {
      issues.push(
        createIssue(impactToSeverity(v.impact), `[${v.id}] ${v.description}`, {
          selector: node.selector,
          html: node.html,
          wcag: wcag[0],
          suggestion: `${node.failureSummary} — ${v.helpUrl}`,
          data: { ruleId: v.id, impact: v.impact, helpUrl: v.helpUrl },
        }),
      );
    }
  }

  for (const inc of axeResult.incomplete) {
    const wcag = parseWcagTags(inc.tags);
    for (const node of inc.nodes) {
      const selectorStr = node.target.join(" ");
      let el: Element | null = null;
      try {
        el = document.querySelector(selectorStr);
      } catch {
        // invalid selector
      }
      issues.push(
        createIssue("warning", `[${inc.id}] ${inc.description} (needs review)`, {
          selector: el ? uniqueSelector(el) : selectorStr,
          html: el ? truncatedHtml(el) : node.html,
          wcag: wcag[0],
          suggestion: `Manual review needed — ${inc.helpUrl}`,
          data: { ruleId: inc.id, impact: inc.impact, helpUrl: inc.helpUrl },
        }),
      );
    }
  }

  // Record passes as pass-severity issues (one per rule, not per node)
  for (const p of axeResult.passes) {
    issues.push(
      createIssue("pass", `[${p.id}] ${p.description}`, {
        data: { ruleId: p.id, nodeCount: p.nodes.length },
      }),
    );
  }

  const data: AxeCoreData = {
    violations,
    passCount: axeResult.passes.length,
    incompleteCount: axeResult.incomplete.length,
    inapplicableCount: axeResult.inapplicable.length,
  };

  return { issues, data };
}
