/**
 * Shared rendering helpers — eliminate duplicated overlay + panel patterns.
 */

import { addLabel, addOutline } from "../../../infrastructure/overlay/OverlayManager.js";
import {
  createResultPanel,
  type ResultPanelOptions,
} from "../../../infrastructure/overlay/ResultPanel.js";
import type { Issue } from "../../types.js";

export interface OverlayEntry {
  selector: string;
  color: string;
  label: string;
}

/** Render outline + label for a batch of elements. */
export function renderOverlays(entries: OverlayEntry[]): void {
  for (const entry of entries) {
    if (!entry.selector) continue;
    const el = document.querySelector(entry.selector);
    if (!el) continue;

    addOutline(el, entry.color);
    addLabel(el, { text: entry.label, bgColor: entry.color });
  }
}

/** Display the interactive result panel with severity tabs and element highlighting. */
export function showResultPanel(
  title: string,
  issues: Issue[],
  options?: ResultPanelOptions,
): HTMLElement {
  return createResultPanel(title, issues, options);
}



/** Standard inaccessible sheets line for panel display. */
export function inaccessibleSheetsLine(count: number): string | null {
  if (count <= 0) return null;
  return `⚠ ${count} cross-origin sheet(s) skipped`;
}
