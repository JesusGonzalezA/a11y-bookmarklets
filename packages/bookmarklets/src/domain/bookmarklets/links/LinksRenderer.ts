import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { LinkData } from "./types.js";

export function renderLinks(data: LinkData[], issues: Issue[]): void {
  renderOverlays(
    data.map((item) => ({
      selector: item.selector,
      color: item.isEmpty ? "#e74c3c" : item.isGeneric ? "#e67e22" : "#3498db",
      label: item.isEmpty ? "NO TEXT" : item.isGeneric ? "GENERIC" : "LINK",
    })),
  );

  const empty = data.filter((d) => d.isEmpty).length;
  const generic = data.filter((d) => d.isGeneric).length;
  const newWindow = data.filter((d) => d.opensNewWindow && !d.hasNewWindowWarning).length;
  const faux = data.filter((d) => d.isFauxLink).length;

  const summary = [
    `${data.length} link(s) found`,
    empty > 0 ? `✗ ${empty} without text` : null,
    generic > 0 ? `⚠ ${generic} generic text` : null,
    newWindow > 0 ? `⚠ ${newWindow} open new window without warning` : null,
    faux > 0 ? `⚠ ${faux} faux links (href="#" or javascript:)` : null,
  ]
    .filter(Boolean)
    .join("\n");

  showResultPanel(`Links (${data.length})`, issues, {
    summaryHtml: `<pre style="margin:4px 0 0; white-space:pre-wrap;">${summary}</pre>`,
  });
}
