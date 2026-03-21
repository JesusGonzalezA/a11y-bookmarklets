export interface ButtonData {
  selector: string;
  tagName: string;
  role: string | null;
  accessibleName: string;
  visibleText: string;
  isEmpty: boolean;
  isFauxButton: boolean;
  labelInNameViolation: boolean;
  isDisabled: boolean;
}
