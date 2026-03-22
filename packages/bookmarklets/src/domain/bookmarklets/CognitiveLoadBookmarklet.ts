import { COGNITIVE_LOAD_CATALOG } from "../../catalog/cognitive-load.js";
import { Bookmarklet } from "../Bookmarklet.js";
import type { AuditOutput, Issue } from "../types.js";
import { auditCognitiveLoad } from "./cognitive-load/CognitiveLoadAuditor.js";
import { renderCognitiveLoad } from "./cognitive-load/CognitiveLoadRenderer.js";
import type { CognitiveLoadData } from "./cognitive-load/types.js";

export class CognitiveLoadBookmarklet extends Bookmarklet<CognitiveLoadData> {
  constructor() {
    super(COGNITIVE_LOAD_CATALOG);
  }

  protected audit(): AuditOutput<CognitiveLoadData> {
    return auditCognitiveLoad();
  }

  protected render(data: CognitiveLoadData, issues: Issue[]): void {
    renderCognitiveLoad(data, issues);
  }
}
