export interface ColorContrastData {
  selector: string;
  tagName: string;
  text: string;
  fontSize: number;
  fontWeight: number;
  foreground: string;
  background: string;
  ratio: number;
  requiredAA: number;
  requiredAAA: number;
  passesAA: boolean;
  passesAAA: boolean;
  isLargeText: boolean;
}
