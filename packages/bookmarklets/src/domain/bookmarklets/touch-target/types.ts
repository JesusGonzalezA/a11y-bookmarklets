export interface TouchTargetData {
  selector: string;
  tagName: string;
  width: number;
  height: number;
  label: string;
  passesAA: boolean;
  passesAAA: boolean;
}

/** WCAG 2.5.8 Target Size (Minimum) = 24×24 CSS px. */
export const TARGET_SIZE_AA = 24;

/** WCAG 2.5.5 Target Size (Enhanced) = 44×44 CSS px. */
export const TARGET_SIZE_AAA = 44;
