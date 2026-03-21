export interface LanguageData {
  htmlLang: string | null;
  isValidBcp47: boolean;
  elementsWithLang: LangElement[];
}

export interface LangElement {
  selector: string;
  lang: string;
  isValid: boolean;
  text: string;
}
