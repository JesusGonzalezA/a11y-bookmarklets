import type { Issue } from "../../types.js";
import { renderOverlays, showResultPanel } from "../shared/render-helpers.js";
import type { CognitiveLoadData } from "./types.js";

const TYPE_COLORS: Record<string, string> = {
  "infinite-animation": "#e67e22",
  "autoplay-media": "#e74c3c",
  modal: "#9b59b6",
  "auto-carousel": "#e67e22",
};

export function renderCognitiveLoad(data: CognitiveLoadData, issues: Issue[]): void {
  renderOverlays(
    data.elements.map((el) => ({
      selector: el.selector,
      color: TYPE_COLORS[el.type] ?? "#e74c3c",
      label: el.type,
    })),
  );

  const scoreColor = data.score <= 20 ? "#2ecc71" : data.score <= 50 ? "#e67e22" : "#e74c3c";
  const b = data.breakdown;

  showResultPanel(`Cognitive Load (${data.score}/100)`, issues, {
    summaryHtml: `<div>
      <div style="color:${scoreColor};font-size:1.2em;font-weight:bold">Score: ${data.score}/100</div>
      <div>∞ Animations: ${b.infiniteAnimations}</div>
      <div>▶ Autoplay media: ${b.autoplayMedia}</div>
      <div>⬜ Modals/popups: ${b.visibleModals}</div>
      <div>◀▶ Auto-carousels: ${b.autoCarousels}</div>
      <div>🔘 CTAs above fold: ${b.ctaAboveFold}</div>
      <div>📝 Words above fold: ${b.wordsAboveFold}</div>
    </div>`,
  });
}
