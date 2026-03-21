/**
 * Buttons bookmarklet — audits all buttons for accessible names and patterns.
 *
 * WCAG: 4.1.2 Name, Role, Value — 2.5.3 Label in Name — 2.1.1 Keyboard
 */

import { BUTTONS_CATALOG } from "../../catalog/buttons.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditButtons } from "./buttons/ButtonsAuditor.js";
import { renderButtons } from "./buttons/ButtonsRenderer.js";
import type { ButtonData } from "./buttons/types.js";

export class ButtonsBookmarklet extends Bookmarklet<ButtonData[]> {
  constructor() {
    super(BUTTONS_CATALOG);
  }

  protected audit(): AuditOutput<ButtonData[]> {
    return auditButtons();
  }

  protected render(data: ButtonData[], issues: Issue[]): void {
    renderButtons(data, issues);
  }
}
