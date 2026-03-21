export interface AudioDescriptionData {
  selector: string;
  src: string;
  hasDescriptionTrack: boolean;
  hasAlternativeLink: boolean;
  alternativeLinkText: string | null;
  duration: number | null;
  isMuted: boolean;
}
