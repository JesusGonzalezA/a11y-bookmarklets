import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { AutocompleteData } from "./types.js";

export function renderAutocomplete(data: AutocompleteData[], issues: Issue[]): void {
  renderOverlays(
    data
      .filter((d) => d.expectedAutocomplete || d.autocomplete)
      .map((item) => ({
        selector: item.selector,
        color: item.autocomplete ? "#2ecc71" : "#e67e22",
        label: item.autocomplete ?? `needs ${item.expectedAutocomplete}`,
      })),
  );

  const withAutocomplete = data.filter((d) => d.autocomplete).length;
  const needsAutocomplete = data.filter((d) => d.expectedAutocomplete && !d.autocomplete).length;

  const summary = [
    `${data.length} input control(s) found`,
    `✓ ${withAutocomplete} with autocomplete`,
    needsAutocomplete > 0 ? `⚠ ${needsAutocomplete} may need autocomplete` : null,
  ]
    .filter(Boolean)
    .join("\n");

  showResultPanel(`Autocomplete (${data.length})`, issues, {
    summaryHtml: `<pre style="margin:4px 0 0; white-space:pre-wrap;">${summary}</pre>`,
  });
}
