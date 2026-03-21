export interface NewWindowLinkData {
  selector: string;
  text: string;
  href: string;
  hasWarning: boolean;
  hasNoopener: boolean;
  warningSource: string | null;
}
