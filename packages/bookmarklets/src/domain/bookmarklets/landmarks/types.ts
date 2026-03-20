export interface LandmarkData {
  role: string;
  label: string;
  selector: string;
}

export const LANDMARK_COLORS: Record<string, string> = {
  banner: "#e74c3c",
  navigation: "#e67e22",
  main: "#2ecc71",
  complementary: "#3498db",
  contentinfo: "#9b59b6",
  form: "#1abc9c",
  search: "#f39c12",
  region: "#95a5a6",
};

export const TAG_TO_ROLE: Record<string, string> = {
  header: "banner",
  nav: "navigation",
  main: "main",
  aside: "complementary",
  footer: "contentinfo",
  form: "form",
  search: "search",
};
