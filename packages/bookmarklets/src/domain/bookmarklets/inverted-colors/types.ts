export interface VulnerableElement {
  selector: string;
  type: string;
  hasCompensation: boolean;
}

export interface InvertedColorsData {
  hasMediaQuery: boolean;
  mediaRuleCount: number;
  vulnerableElements: VulnerableElement[];
  inaccessibleSheets: number;
}
