export interface TransparentElement {
  selector: string;
  property: string;
  value: string;
}

export interface ReducedTransparencyData {
  hasMediaQuery: boolean;
  mediaRuleCount: number;
  transparentElements: TransparentElement[];
  inaccessibleSheets: number;
}
