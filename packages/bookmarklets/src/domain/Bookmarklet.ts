/**
 * Abstract base class for all a11y bookmarklets.
 *
 * Uses the Template Method pattern to enforce a consistent execution flow:
 *   1. Clear previous overlays
 *   2. Audit the page (subclass logic)
 *   3. Render visual overlays (subclass logic)
 *   4. Build the structured result
 *   5. Write to console
 *   6. Register on window.__a11y for programmatic access
 *
 * Each concrete bookmarklet defines:
 *   - catalog entry (id, name, description, wcag — via constructor)
 *   - audit()  → pure analysis, returns issues + typed data
 *   - render() → visual overlays specific to this bookmarklet
 */

import type {
  AuditOutput,
  AuditResult,
  BookmarkletMeta,
  Issue,
} from "./types.js";
import { clearOverlays, onClearOverlays } from "../infrastructure/overlay/OverlayManager.js";
import {
  buildResult,
  writeToConsole,
  registerInWindow,
} from "../infrastructure/reporter/AuditReporter.js";

const resizeListeners = new Map<string, () => void>();

export abstract class Bookmarklet<T> {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly wcagCriteria: string[];

  constructor(meta: BookmarkletMeta) {
    this.id = meta.id;
    this.name = meta.name;
    this.description = meta.description;
    this.wcagCriteria = meta.wcag;
  }

  /** Analyze the page and collect issues + data for rendering. */
  protected abstract audit(): AuditOutput<T>;

  /** Render visual overlays on the page. */
  protected abstract render(data: T, issues: Issue[]): void;

  /** Template method — standard execution flow for every bookmarklet. */
  run(): AuditResult {
    clearOverlays();

    const { issues, data } = this.audit();

    this.render(data, issues);

    const result = buildResult(this.id, issues);

    writeToConsole(result);

    registerInWindow(this.id, result, () => this.run());

    // Re-scan on resize so overlays stay aligned with reflowed elements
    const prev = resizeListeners.get(this.id);
    if (prev) window.removeEventListener("resize", prev);

    let timer: ReturnType<typeof setTimeout>;
    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => this.run(), 300);
    };
    resizeListeners.set(this.id, handler);
    window.addEventListener("resize", handler);

    onClearOverlays(() => {
      window.removeEventListener("resize", handler);
      resizeListeners.delete(this.id);
    });

    return result;
  }

  /** Return metadata for registry/discovery. */
  get meta(): BookmarkletMeta {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      wcag: this.wcagCriteria,
    };
  }
}
