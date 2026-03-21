export interface ViewportZoomData {
  hasViewportMeta: boolean;
  content: string | null;
  directives: ViewportDirective[];
  userScalable: string | null;
  maximumScale: number | null;
  minimumScale: number | null;
  initialScale: number | null;
  width: string | null;
}

export interface ViewportDirective {
  key: string;
  value: string;
}
