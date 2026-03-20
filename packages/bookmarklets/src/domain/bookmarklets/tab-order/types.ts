export interface FocusableData {
  index: number;
  tabindex: number | null;
  selector: string;
  tag: string;
  role: string | null;
  label: string;
  visible: boolean;
}

export const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button",
  "input:not([type=hidden])",
  "select",
  "textarea",
  "[tabindex]",
  "[contenteditable]",
  "details > summary",
  "audio[controls]",
  "video[controls]",
].join(", ");
