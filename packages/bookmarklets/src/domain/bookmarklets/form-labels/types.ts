export interface FormLabelData {
  selector: string;
  tagName: string;
  type: string;
  nameSource: NameSource;
  accessibleName: string;
  hasPlaceholderOnly: boolean;
}

export type NameSource =
  | "aria-labelledby"
  | "aria-label"
  | "label-for"
  | "label-wrap"
  | "title"
  | "placeholder"
  | "none";
