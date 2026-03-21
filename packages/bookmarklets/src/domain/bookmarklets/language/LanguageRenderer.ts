import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { LanguageData } from "./types.js";

export function renderLanguage(data: LanguageData, issues: Issue[]): void {
  renderOverlays(
    data.elementsWithLang.map((el) => ({
      selector: el.selector,
      color: el.isValid ? "#2ecc71" : "#e74c3c",
      label: `lang="${el.lang}"`,
    })),
  );

  const lines: string[] = [];
  if (data.htmlLang) {
    lines.push(`Page language: ${data.htmlLang} ${data.isValidBcp47 ? "✓" : "✗ invalid"}`);
  } else {
    lines.push("✗ No lang attribute on <html>");
  }
  if (data.elementsWithLang.length > 0) {
    lines.push(`${data.elementsWithLang.length} element(s) with lang attribute`);
  }

  showResultPanel(`Language Audit`, issues, {
    summaryHtml: `<pre style="margin:4px 0 0; white-space:pre-wrap;">${lines.join("\n")}</pre>`,
  });
}
