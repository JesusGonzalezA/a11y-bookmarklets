export interface CaptionsData {
  selector: string;
  src: string;
  tracks: TrackInfo[];
  isEmbedded: boolean;
  embedType: string | null;
}

export interface TrackInfo {
  kind: string;
  src: string;
  srclang: string;
  label: string;
  isValid: boolean;
  validationError: string | null;
}
