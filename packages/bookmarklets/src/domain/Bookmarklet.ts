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
 *   - id, name, description, wcagCriteria (metadata)
 *   - audit()  → pure analysis, returns issues + typed data
 *   - render() → visual overlays specific to this bookmarklet
 */

import type {
  AuditOutput,
  AuditResult,
  BookmarkletMeta,
  BookmarkletOptions,
  Issue,
} from "./types.js";
import { clearOverlays } from "../infrastructure/overlay/OverlayManager.js";
import {
  buildResult,
  writeToConsole,
  registerInWindow,
} from "../infrastructure/reporter/AuditReporter.js";

export abstract class Bookmarklet<T> {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly wcagCriteria: string[];

  /** Analyze the page and collect issues + data for rendering. */
  protected abstract audit(): AuditOutput<T>;

  /** Render visual overlays on the page. */
  protected abstract render(data: T, issues: Issue[]): void;

  /** Template method — standard execution flow for every bookmarklet. */
  run(options: BookmarkletOptions = {}): AuditResult {
    const mode = options.mode ?? "both";

    clearOverlays();

    const { issues, data } = this.audit();

    if (mode !== "data") {
      this.render(data, issues);
    }

    const result = buildResult(this.id, issues);

    if (mode !== "visual") {
      writeToConsole(result);
    }

    registerInWindow(this.id, result, () => this.run({ mode: "data" }));

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
