import { READING_ORDER_CATALOG } from "../../catalog/reading-order.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditReadingOrder } from "./reading-order/ReadingOrderAuditor.js";
import { renderReadingOrder } from "./reading-order/ReadingOrderRenderer.js";
import type { ReadingOrderResult } from "./reading-order/types.js";

export class ReadingOrderBookmarklet extends Bookmarklet<ReadingOrderResult> {
  constructor() {
    super(READING_ORDER_CATALOG);
  }

  protected audit(): AuditOutput<ReadingOrderResult> {
    return auditReadingOrder();
  }

  protected render(data: ReadingOrderResult, issues: Issue[]): void {
    renderReadingOrder(data, issues);
  }
}
