export interface MetaTagsData {
  charset: string | null;
  description: string | null;
  colorScheme: string | null;
  themeColor: string | null;
  httpRefresh: string | null;
  allMetaTags: MetaTagInfo[];
}

export interface MetaTagInfo {
  name: string;
  content: string;
  selector: string;
}
