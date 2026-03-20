export interface AnimationEntry {
  selector: string;
  property: "animation" | "transition";
  value: string;
}

export interface ReducedMotionData {
  hasMediaQuery: boolean;
  mediaRuleCount: number;
  animatedElements: AnimationEntry[];
  webAnimationsCount: number;
  inaccessibleSheets: number;
}
