export interface AutoplayData {
  selector: string;
  tagName: string;
  hasAutoplay: boolean;
  isMuted: boolean;
  duration: number | null;
  hasPauseControl: boolean;
  hasVolumeControl: boolean;
  src: string;
}
