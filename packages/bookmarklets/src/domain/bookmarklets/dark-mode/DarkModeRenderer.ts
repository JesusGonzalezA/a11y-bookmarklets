import { queryAll } from "../../../infrastructure/dom/DomUtils.js";
import { addLabel, addOutline } from "../../../infrastructure/overlay/OverlayManager.js";
import type { Issue } from "../../types.js";
import { inaccessibleSheetsLine, renderSummaryPanel } from "../shared/render-helpers.js";
import type { DarkModeData } from "./types.js";

export function renderDarkMode(data: DarkModeData, _issues: Issue[]): void {
  // Highlight root color-scheme
  const root = document.documentElement;
  const rootCS = getComputedStyle(root).getPropertyValue("color-scheme").trim();
  if (rootCS && rootCS !== "normal") {
    addOutline(root, "#9b59b6");
    addLabel(root, { text: `color-scheme: ${rootCS}`, bgColor: "#9b59b6" });
  }

  // Highlight elements with inline color-scheme
  for (const el of queryAll("[style]")) {
    const style = (el as HTMLElement).style;
    if (style.getPropertyValue("color-scheme")) {
      addOutline(el, "#8e44ad");
      addLabel(el, {
        text: `color-scheme: ${style.getPropertyValue("color-scheme")}`,
        bgColor: "#8e44ad",
      });
    }
  }

  const lines: string[] = [];
  if (data.darkRules > 0) {
    lines.push(`✓ ${data.darkRules} dark mode rule(s) found`);
  } else {
    lines.push("✗ No dark mode rules found");
  }
  if (data.lightRules > 0) {
    lines.push(`  ${data.lightRules} light mode rule(s)`);
  }
  if (data.hasColorSchemeMeta) lines.push("✓ color-scheme meta tag");
  if (data.hasColorSchemeCSS) lines.push("✓ CSS color-scheme property");
  if (!data.hasColorSchemeMeta && !data.hasColorSchemeCSS) {
    lines.push("✗ No color-scheme declaration");
  }

  const sheetsLine = inaccessibleSheetsLine(data.inaccessibleSheets);
  if (sheetsLine) lines.push(sheetsLine);

  renderSummaryPanel("Dark Mode Audit", lines);
}
