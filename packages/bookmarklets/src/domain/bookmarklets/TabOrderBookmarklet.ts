/**
 * Tab Order bookmarklet — visualizes tab order and detects keyboard issues.
 *
 * WCAG: 2.4.3 Focus Order, 2.1.1 Keyboard
 */

import { TAB_ORDER_CATALOG } from "../../catalog/tab-order.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditTabOrder } from "./tab-order/TabOrderAuditor.js";
import { renderTabOrder } from "./tab-order/TabOrderRenderer.js";
import type { FocusableData } from "./tab-order/types.js";

export class TabOrderBookmarklet extends Bookmarklet<FocusableData[]> {
  constructor() {
    super(TAB_ORDER_CATALOG);
  }

  protected audit(): AuditOutput<FocusableData[]> {
    return auditTabOrder();
  }

  protected render(data: FocusableData[], issues: Issue[]): void {
    renderTabOrder(data, issues);
  }
}
