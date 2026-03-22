import { A11Y_SNAPSHOT_CATALOG } from "../../catalog/a11y-snapshot.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditA11ySnapshot } from "./a11y-snapshot/A11ySnapshotAuditor.js";
import { renderA11ySnapshot } from "./a11y-snapshot/A11ySnapshotRenderer.js";
import type { A11ySnapshotData } from "./a11y-snapshot/types.js";

export class A11ySnapshotBookmarklet extends Bookmarklet<A11ySnapshotData> {
  constructor() {
    super(A11Y_SNAPSHOT_CATALOG);
  }

  protected audit(): AuditOutput<A11ySnapshotData> {
    return auditA11ySnapshot();
  }

  protected render(data: A11ySnapshotData, issues: Issue[]): void {
    renderA11ySnapshot(data, issues);
  }
}
