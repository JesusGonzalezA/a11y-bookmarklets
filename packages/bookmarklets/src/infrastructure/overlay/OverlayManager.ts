/**
 * Visual overlay helpers — inject labels, outlines, and panels into the page.
 *
 * All injected elements use a `data-a11y-bookmarklet` attribute so they can
 * be removed cleanly when the bookmarklet is toggled off.
 */

const ATTR = "data-a11y-bookmarklet";
const STYLE_ID = "a11y-bookmarklet-styles";
const HIGHLIGHT_CLASS = "a11y-highlight-active";

let activeHighlight: HTMLElement | null = null;

export function clearOverlays(): void {
  activeHighlight = null;
  for (const el of document.querySelectorAll(`[${ATTR}]`)) {
    el.remove();
  }
  document.getElementById(STYLE_ID)?.remove();
}

/** Temporarily highlight a DOM element matched by selector. */
export function highlightElement(selector: string): void {
  clearHighlight();
  try {
    const el = document.querySelector(selector);
    if (!el) return;
    injectBaseStyles();

    const rect = el.getBoundingClientRect();
    const overlay = document.createElement("div");
    overlay.setAttribute(ATTR, "");
    overlay.className = HIGHLIGHT_CLASS;
    overlay.style.top = `${window.scrollY + rect.top}px`;
    overlay.style.left = `${window.scrollX + rect.left}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    document.body.appendChild(overlay);
    activeHighlight = overlay;
  } catch {
    // Invalid selector — silently ignore
  }
}

/** Remove the temporary highlight overlay. */
export function clearHighlight(): void {
  activeHighlight?.remove();
  activeHighlight = null;
}

export function injectBaseStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.setAttribute(ATTR, "");
  style.textContent = `
    /* ── Overlays (labels & outlines) ── */
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

    /* ── Element highlight (hover/focus from panel) ── */
    [${ATTR}].${HIGHLIGHT_CLASS} {
      position: absolute;
      z-index: 2147483645;
      pointer-events: none;
      border: 3px solid #facc15;
      border-radius: 4px;
      background: rgba(250, 204, 21, 0.15);
      animation: a11y-highlight-pulse 1s ease-in-out infinite;
    }
    @keyframes a11y-highlight-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.4); }
      50% { box-shadow: 0 0 0 6px rgba(250, 204, 21, 0); }
    }

    /* ── Result Panel ── */
    [${ATTR}].a11y-result-panel {
      position: fixed;
      bottom: 12px;
      right: 12px;
      z-index: 2147483647;
      background: #1a1a2e;
      color: #f0f0f4;
      font: 15px/1.5 system-ui, sans-serif;
      border-radius: 10px;
      width: 520px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 24px rgba(0,0,0,.5);
      overflow: hidden;
    }
    .a11y-rp-header {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: #16213e;
      cursor: grab;
      user-select: none;
      border-radius: 10px 10px 0 0;
      min-height: 44px;
      flex-shrink: 0;
    }
    .a11y-rp-header:active { cursor: grabbing; }
    .a11y-rp-title {
      flex: 1;
      font-size: 17px;
      font-weight: 700;
      color: #fff;
    }
    .a11y-rp-close {
      background: none;
      border: none;
      color: #c0c4cc;
      font-size: 20px;
      cursor: pointer;
      padding: 8px 10px;
      border-radius: 4px;
      line-height: 1;
      flex-shrink: 0;
      min-width: 44px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .a11y-rp-close:hover,
    .a11y-rp-close:focus-visible {
      background: rgba(255,255,255,.12);
      color: #fff;
      outline: 2px solid #facc15;
      outline-offset: -2px;
    }
    .a11y-rp-summary-wrapper {
      border-bottom: 1px solid rgba(255,255,255,.1);
      flex-shrink: 1;
      min-height: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .a11y-rp-summary-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      background: none;
      border: none;
      color: #d0d4dc;
      font: inherit;
      font-size: 14px;
      font-weight: 600;
      padding: 10px 16px;
      cursor: pointer;
      text-align: left;
      min-height: 44px;
      flex-shrink: 0;
    }
    .a11y-rp-summary-toggle:hover { color: #fff; }
    .a11y-rp-summary-toggle:focus-visible {
      outline: 2px solid #facc15;
      outline-offset: -2px;
    }
    .a11y-rp-toggle-icon {
      font-size: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      line-height: 1;
    }
    .a11y-rp-summary {
      padding: 8px 16px 12px;
      font-size: 14px;
      color: #d8dce4;
      overflow-y: auto;
      line-height: 1.6;
      flex: 1;
      min-height: 0;
      max-height: min(200px, 30vh);
    }
    .a11y-rp-divider {
      height: 6px;
      cursor: ns-resize;
      background: transparent;
      position: relative;
    }
    .a11y-rp-divider::after {
      content: '';
      display: block;
      width: 40px;
      height: 3px;
      background: rgba(255,255,255,.15);
      border-radius: 2px;
      margin: 0 auto;
      position: relative;
      top: 2px;
    }
    .a11y-rp-divider:hover::after {
      background: rgba(255,255,255,.35);
    }

    /* Tabs */
    .a11y-rp-tablist {
      display: flex;
      padding: 0 8px;
      gap: 2px;
      background: #16213e;
      border-bottom: 1px solid rgba(255,255,255,.12);
      flex-shrink: 0;
    }
    .a11y-rp-tab {
      background: none;
      border: none;
      color: #b0b4bc;
      font: inherit;
      font-size: 14px;
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      white-space: nowrap;
      transition: color .15s, border-color .15s;
      min-height: 44px;
    }
    .a11y-rp-tab[aria-selected="true"] {
      color: #fff;
      border-bottom-color: var(--tab-color, #facc15);
    }
    .a11y-rp-tab:hover { color: #e0e0e4; }
    .a11y-rp-tab:focus-visible {
      outline: 2px solid #facc15;
      outline-offset: -2px;
      border-radius: 4px 4px 0 0;
    }
    .a11y-rp-tab-icon { font-style: normal; }
    .a11y-rp-tab-count {
      display: inline-block;
      background: rgba(255,255,255,.12);
      color: #d0d4dc;
      border-radius: 10px;
      padding: 1px 7px;
      font-size: 13px;
      margin-left: 4px;
    }

    /* Tab panels */
    .a11y-rp-tabpanel {
      overflow-y: auto;
      flex: 1;
      min-height: 60px;
    }
    .a11y-rp-listbox { padding: 4px 0; }

    /* Items */
    .a11y-rp-item {
      display: flex;
      align-items: baseline;
      gap: 10px;
      padding: 12px 16px;
      cursor: pointer;
      border-left: 3px solid transparent;
      transition: background .1s, border-color .1s;
      min-height: 44px;
      box-sizing: border-box;
    }
    .a11y-rp-item:hover,
    .a11y-rp-item:focus {
      background: rgba(255,255,255,.07);
      border-left-color: #facc15;
      outline: none;
    }
    .a11y-rp-item:focus-visible {
      background: rgba(250,204,21,.1);
      border-left-color: #facc15;
      outline: none;
    }
    .a11y-rp-item-msg {
      flex: 1;
      font-size: 14px;
      line-height: 1.45;
      color: #e8ecf0;
    }
    .a11y-rp-item-wcag {
      font-size: 12px;
      color: #9ca0aa;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .a11y-rp-empty {
      padding: 24px 16px;
      text-align: center;
      color: #9ca0aa;
    }

    /* Resize handle */
    .a11y-rp-resize {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 18px;
      height: 18px;
      cursor: nwse-resize;
      z-index: 1;
    }
    .a11y-rp-resize::after {
      content: '';
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 8px;
      height: 8px;
      border-right: 2px solid rgba(255,255,255,.25);
      border-bottom: 2px solid rgba(255,255,255,.25);
    }
    .a11y-rp-resize:hover::after {
      border-color: rgba(255,255,255,.5);
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


