export interface AxeCoreNode {
  selector: string;
  html: string;
  failureSummary: string;
}

export interface AxeCoreViolation {
  ruleId: string;
  description: string;
  impact: string;
  helpUrl: string;
  wcag: string[];
  nodes: AxeCoreNode[];
}

export interface AxeCoreData {
  violations: AxeCoreViolation[];
  passCount: number;
  incompleteCount: number;
  inapplicableCount: number;
}
