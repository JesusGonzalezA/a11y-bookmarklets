import type { Issue } from "../../types.js";
import { showResultPanel } from "../shared/render-helpers.js";
import type { PageTitleData } from "./types.js";

export function renderPageTitle(data: PageTitleData, issues: Issue[]): void {
  const lines: string[] = [];

  if (data.isEmpty) {
    lines.push("✗ No page title found");
  } else {
    lines.push(`Title: "${data.title}" (${data.length} chars)`);
    if (data.isGeneric) lines.push("⚠ Title appears generic");
    if (data.h1Text) {
      lines.push(`H1: "${data.h1Text}"`);
      lines.push(data.h1TitleMatch ? "✓ Title and h1 are coherent" : "ℹ Title and h1 differ");
    }
  }

  showResultPanel("Page Title Audit", issues, {
    summaryHtml: `<pre style="margin:4px 0 0; white-space:pre-wrap;">${lines.join("\n")}</pre>`,
  });
}
