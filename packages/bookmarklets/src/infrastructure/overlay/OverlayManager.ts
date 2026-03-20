/**
 * Visual overlay helpers — inject labels, outlines, and panels into the page.
 *
 * All injected elements use a `data-a11y-bookmarklet` attribute so they can
 * be removed cleanly when the bookmarklet is toggled off.
 */

const ATTR = "data-a11y-bookmarklet";
const STYLE_ID = "a11y-bookmarklet-styles";

export function clearOverlays(): void {
  document.querySelectorAll(`[${ATTR}]`).forEach((el) => el.remove());
  document.getElementById(STYLE_ID)?.remove();
}

function injectBaseStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.setAttribute(ATTR, "");
  style.textContent = `
    [${ATTR}].a11y-overlay-label {
      position: absolute;
      z-index: 2147483647;
      font: bold 12px/1.2 monospace;
      padding: 2px 6px;
      border-radius: 3px;
      pointer-events: none;
      white-space: nowrap;
      box-shadow: 0 1px 3px rgba(0,0,0,.3);
    }
    [${ATTR}].a11y-overlay-outline {
      position: absolute;
      z-index: 2147483646;
      pointer-events: none;
      border: 2px solid;
      border-radius: 3px;
    }
    [${ATTR}].a11y-panel {
      position: fixed;
      bottom: 12px;
      right: 12px;
      z-index: 2147483647;
      background: #1a1a2e;
      color: #eee;
      font: 13px/1.5 system-ui, sans-serif;
      padding: 12px 16px;
      border-radius: 8px;
      max-width: 360px;
      max-height: 50vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0,0,0,.4);
    }
    [${ATTR}].a11y-panel button.a11y-close {
      position: absolute;
      top: 6px; right: 8px;
      background: none; border: none; color: #aaa;
      font-size: 18px; cursor: pointer;
    }
  `;
  document.head.appendChild(style);
}

export interface LabelOptions {
  text: string;
  bgColor: string;
  textColor?: string;
}

export function addLabel(target: Element, options: LabelOptions): HTMLElement {
  injectBaseStyles();

  const rect = target.getBoundingClientRect();
  const label = document.createElement("div");
  label.setAttribute(ATTR, "");
  label.className = "a11y-overlay-label";
  label.textContent = options.text;
  label.style.top = `${window.scrollY + rect.top - 20}px`;
  label.style.left = `${window.scrollX + rect.left}px`;
  label.style.backgroundColor = options.bgColor;
  label.style.color = options.textColor ?? "#fff";

  document.body.appendChild(label);
  return label;
}

export function addOutline(target: Element, color: string): HTMLElement {
  injectBaseStyles();

  const rect = target.getBoundingClientRect();
  const outline = document.createElement("div");
  outline.setAttribute(ATTR, "");
  outline.className = "a11y-overlay-outline";
  outline.style.top = `${window.scrollY + rect.top}px`;
  outline.style.left = `${window.scrollX + rect.left}px`;
  outline.style.width = `${rect.width}px`;
  outline.style.height = `${rect.height}px`;
  outline.style.borderColor = color;

  document.body.appendChild(outline);
  return outline;
}

export function showPanel(html: string): HTMLElement {
  injectBaseStyles();

  const panel = document.createElement("div");
  panel.setAttribute(ATTR, "");
  panel.className = "a11y-panel";
  panel.innerHTML = `
    <button class="a11y-close" onclick="this.parentElement.remove()">✕</button>
    ${html}
  `;

  document.body.appendChild(panel);
  return panel;
}
