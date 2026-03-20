/**
 * Shared rendering helpers — eliminate duplicated overlay + panel patterns.
 */

import { addLabel, addOutline, showPanel } from "../../../infrastructure/overlay/OverlayManager.js";

export interface OverlayEntry {
  selector: string;
  color: string;
  label: string;
}

/** Render outline + label for a batch of elements. */
export function renderOverlays(entries: OverlayEntry[]): void {
  for (const entry of entries) {
    const el = document.querySelector(entry.selector);
    if (!el) continue;

    addOutline(el, entry.color);
    addLabel(el, { text: entry.label, bgColor: entry.color });
  }
}

/** Build and display a summary panel with a title and pre-formatted lines. */
export function renderSummaryPanel(title: string, lines: string[]): void {
  showPanel(`
      <strong>${title}</strong>
      <pre style="font-size:11px; margin:8px 0 0; white-space:pre-wrap;">${lines.join("\n")}</pre>
    `);
}

/** Build and display a summary panel with custom HTML body. */
export function renderHtmlPanel(title: string, bodyHtml: string): void {
  showPanel(`
      <strong>${title}</strong>
      ${bodyHtml}
    `);
}

/** Standard inaccessible sheets line for panel display. */
export function inaccessibleSheetsLine(count: number): string | null {
  if (count <= 0) return null;
  return `⚠ ${count} cross-origin sheet(s) skipped`;
}
