export interface AffectedElement {
  selector: string;
  properties: string[];
  hasForcedColorAdjust: boolean;
}

export interface ForcedColorsData {
  hasForcedColorsQuery: boolean;
  hasPrefersContrastQuery: boolean;
  forcedColorsRuleCount: number;
  prefersContrastRuleCount: number;
  isForcedColorsActive: boolean;
  affectedElements: AffectedElement[];
  forcedColorAdjustElements: number;
  inaccessibleSheets: number;
}

/** CSS properties that are overridden in forced-colors mode. */
export const FORCED_RESET_PROPERTIES = [
  "background-color",
  "border-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "box-shadow",
  "outline-color",
  "text-decoration-color",
  "column-rule-color",
] as const;

/** CSS system colors — values that are preserved in forced-colors mode. */
export const SYSTEM_COLORS = new Set([
  "canvas",
  "canvastext",
  "linktext",
  "visitedtext",
  "activetext",
  "buttonface",
  "buttontext",
  "buttonborder",
  "field",
  "fieldtext",
  "highlight",
  "highlighttext",
  "selecteditem",
  "selecteditemtext",
  "mark",
  "marktext",
  "graytext",
]);
