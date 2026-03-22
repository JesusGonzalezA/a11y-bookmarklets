export interface PrintStyleElement {
  selector: string;
  type: string;
  detail: string;
}

export interface PrintStylesData {
  hasPrintRules: boolean;
  printRuleCount: number;
  elements: PrintStyleElement[];
  inaccessibleSheets: number;
}
