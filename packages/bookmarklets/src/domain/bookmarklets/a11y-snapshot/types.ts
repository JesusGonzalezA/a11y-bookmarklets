export interface SnapshotHeading {
  level: number;
  text: string;
  selector: string;
}

export interface SnapshotLandmark {
  role: string;
  label: string;
  selector: string;
}

export interface SnapshotImage {
  alt: string | null;
  role: string | null;
  src: string;
  selector: string;
}

export interface SnapshotFormControl {
  tag: string;
  type: string | null;
  label: string;
  hasAutocomplete: boolean;
  selector: string;
}

export interface SnapshotLink {
  text: string;
  href: string;
  opensNewWindow: boolean;
  selector: string;
}

export interface SnapshotButton {
  text: string;
  selector: string;
}

export interface SnapshotLiveRegion {
  role: string | null;
  ariaLive: string | null;
  selector: string;
}

export interface SnapshotAriaRole {
  role: string;
  count: number;
}

export interface SnapshotMedia {
  tag: string;
  hasControls: boolean;
  autoplay: boolean;
  trackCount: number;
  selector: string;
}

export interface SnapshotMetaTag {
  name: string | null;
  httpEquiv: string | null;
  content: string | null;
}

export interface SnapshotStats {
  totalElements: number;
  interactiveElements: number;
  hiddenElements: number;
  ariaHiddenElements: number;
  imagesTotal: number;
  imagesWithAlt: number;
  imagesWithoutAlt: number;
  linksTotal: number;
  buttonsTotal: number;
  formControlsTotal: number;
  headingsTotal: number;
  landmarksTotal: number;
}

export interface A11ySnapshotData {
  url: string;
  timestamp: string;
  lang: string | null;
  title: string;
  headings: SnapshotHeading[];
  landmarks: SnapshotLandmark[];
  images: SnapshotImage[];
  forms: SnapshotFormControl[];
  links: SnapshotLink[];
  buttons: SnapshotButton[];
  liveRegions: SnapshotLiveRegion[];
  ariaRoles: SnapshotAriaRole[];
  media: SnapshotMedia[];
  metaTags: SnapshotMetaTag[];
  stats: SnapshotStats;
}
