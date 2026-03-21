export interface HiddenContentData {
  selector: string;
  tagName: string;
  method: HidingMethod;
  hasFocusable: boolean;
  text: string;
}

export type HidingMethod =
  | "aria-hidden"
  | "display-none"
  | "visibility-hidden"
  | "hidden-attr"
  | "sr-only"
  | "opacity-0"
  | "clip-rect"
  | "offscreen";
