import { code as createNavigablePanelCode } from "./snippets/create-navigable-panel";
import { code as createAuditPanelCode } from "./snippets/create-audited-panel";

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
    name: "Navegable Panel",
    description: "Navegable panel with keyboard support and focus management",
    icon: "ListTree",
    code: createNavigablePanelCode,
  },
  {
    id: "audited-panel",
    name: "Audited Panel",
    description: "Panel with tabs showing passes, warnings, and errors",
    icon: "ShieldCheck",
    code: createAuditPanelCode,

  }
];