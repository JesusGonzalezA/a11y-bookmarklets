import { code as createNavigablePanelCode } from "./snippets/create-navigable-panel";

export interface Snippet {
  id: string;
  name: string;
  description: string;
  icon: string;
  code: string;
}

export const SNIPPETS: Snippet[] = [
  {
    id: "navigable-panel",
    name: "Panel navegable",
    description: "Panel con lista navegable por ↑ ↓ que resalta elementos al enfocarse",
    icon: "ListTree",
    code: createNavigablePanelCode,
  },
];