export interface CognitiveLoadBreakdown {
  infiniteAnimations: number;
  autoplayMedia: number;
  visibleModals: number;
  autoCarousels: number;
  ctaAboveFold: number;
  wordsAboveFold: number;
}

export interface CognitiveLoadElement {
  selector: string;
  type: string;
  label: string;
}

export interface CognitiveLoadData {
  score: number;
  breakdown: CognitiveLoadBreakdown;
  elements: CognitiveLoadElement[];
}
