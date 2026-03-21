export interface AriaData {
  selector: string;
  tagName: string;
  role: string | null;
  issueType: AriaIssueType;
  detail: string;
}

export type AriaIssueType =
  | "invalid-role"
  | "redundant-role"
  | "aria-hidden-focusable"
  | "missing-required-prop"
  | "broken-reference"
  | "valid";
