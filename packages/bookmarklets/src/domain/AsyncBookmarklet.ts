/**
 * Abstract base class for async a11y bookmarklets.
 *
 * Mirrors {@link Bookmarklet} but supports async audit() — needed when the
 * bookmarklet must load external resources (e.g. axe-core from CDN) before
 * analysis.
 *
 * Template Method flow (same as sync variant, but awaits audit):
 *   1. Clear previous overlays
 *   2. Audit the page (async subclass logic)
 *   3. Render visual overlays (subclass logic)
 *   4. Build the structured result
 *   5. Write to console
 *   6. Register on window.__a11y for programmatic access
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

export abstract class AsyncBookmarklet<T> {
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

  /** Analyze the page and collect issues + data for rendering (async). */
  protected abstract audit(): Promise<AuditOutput<T>>;

  /** Render visual overlays on the page. */
  protected abstract render(data: T, issues: Issue[]): void;

  /** Template method — async execution flow for bookmarklets that need it. */
  async run(): Promise<AuditResult> {
    clearOverlays();

    const { issues, data } = await this.audit();

    this.render(data, issues);

    const result = buildResult(this.id, issues);

    writeToConsole(result);

    registerInWindow(
      this.id,
      result,
      (() => this.run()) as unknown as () => AuditResult,
    );

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
