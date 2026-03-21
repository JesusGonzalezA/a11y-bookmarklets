export interface LiveRegionData {
  selector: string;
  tagName: string;
  liveValue: string;
  role: string | null;
  atomic: string | null;
  relevant: string | null;
  hasContent: boolean;
}
