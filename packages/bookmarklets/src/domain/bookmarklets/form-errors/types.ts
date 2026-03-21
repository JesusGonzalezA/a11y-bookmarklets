export interface FormErrorData {
  selector: string;
  tagName: string;
  isInvalid: boolean;
  hasErrorMessage: boolean;
  errorMessageId: string | null;
  errorMessageText: string;
  hasLiveRegion: boolean;
}
