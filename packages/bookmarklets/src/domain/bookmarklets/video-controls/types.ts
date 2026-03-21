export interface VideoControlData {
  selector: string;
  tagName: string;
  hasNativeControls: boolean;
  hasCustomControls: boolean;
  src: string;
  duration: number | null;
  customControlDetails: CustomControlInfo[];
}

export interface CustomControlInfo {
  selector: string;
  role: string | null;
  ariaLabel: string | null;
  tabindex: string | null;
  tagName: string;
}
