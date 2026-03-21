/**
 * Interactive results panel — draggable, tabbed by severity, with element highlighting.
 *
 * Accessibility:
 *   - ARIA tablist pattern (tabs by severity)
 *   - Roving tabindex in listbox (arrow up/down to navigate items)
 *   - Left/Right arrows switch tabs
 *   - Hover or focus on an item highlights the corresponding DOM element
 *   - Escape closes the panel
 */

import type { Issue, Severity } from "../../domain/types.js";
import {
  clearHighlight,
  clearOverlays,
  highlightElement,
  injectBaseStyles,
} from "./OverlayManager.js";

const ATTR = "data-a11y-bookmarklet";
const POSITION_KEY = "a11y-rp-position";

const SEVERITY_ORDER: Severity[] = ["error", "warning", "pass", "info"];

const SEVERITY_META: Record<Severity, { label: string; color: string; icon: string }> = {
  error: { label: "Errors", color: "#e74c3c", icon: "✗" },
  warning: { label: "Warnings", color: "#f39c12", icon: "⚠" },
  pass: { label: "Passes", color: "#2ecc71", icon: "✓" },
  info: { label: "Info", color: "#3498db", icon: "ℹ" },
};

export interface ResultPanelOptions {
  summaryHtml?: string;
}

export function createResultPanel(
  title: string,
  issues: Issue[],
  options: ResultPanelOptions = {},
): HTMLElement {
  injectBaseStyles();

  const grouped = groupBySeverity(issues);
  const activeSeverities = SEVERITY_ORDER.filter((s) => grouped[s] && grouped[s].length > 0);

  const panel = document.createElement("div");
  panel.setAttribute(ATTR, "");
  panel.className = "a11y-result-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", title);

  // -- Header (draggable) --
  const header = document.createElement("div");
  header.className = "a11y-rp-header";
  header.innerHTML = `<strong class="a11y-rp-title">${escapeHtml(title)}</strong>`;
  panel.appendChild(header);

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.className = "a11y-rp-close";
  closeBtn.setAttribute("aria-label", "Close panel");
  closeBtn.textContent = "✕";
  closeBtn.addEventListener("click", () => {
    clearOverlays();
  });
  header.appendChild(closeBtn);

  // -- Optional summary (collapsible) --
  if (options.summaryHtml) {
    const summaryWrapper = document.createElement("div");
    summaryWrapper.className = "a11y-rp-summary-wrapper";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "a11y-rp-summary-toggle";
    toggleBtn.setAttribute("aria-expanded", "true");
    toggleBtn.innerHTML = '<span class="a11y-rp-toggle-icon">▾</span> Summary';
    toggleBtn.addEventListener("click", () => {
      const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", String(!expanded));
      summaryContent.hidden = expanded;
      const icon = toggleBtn.querySelector(".a11y-rp-toggle-icon");
      if (icon) icon.textContent = expanded ? "▸" : "▾";
    });
    summaryWrapper.appendChild(toggleBtn);

    const summaryContent = document.createElement("div");
    summaryContent.className = "a11y-rp-summary";
    summaryContent.innerHTML = options.summaryHtml;
    summaryWrapper.appendChild(summaryContent);

    // Drag divider to resize summary
    const divider = document.createElement("div");
    divider.className = "a11y-rp-divider";
    divider.setAttribute("aria-hidden", "true");
    setupSummaryResize(summaryContent, divider);
    summaryWrapper.appendChild(divider);

    panel.appendChild(summaryWrapper);
  }

  // -- Tabs --
  if (activeSeverities.length > 0) {
    const tabsContainer = buildTabs(activeSeverities, grouped, panel);
    panel.appendChild(tabsContainer);
  } else {
    const empty = document.createElement("div");
    empty.className = "a11y-rp-empty";
    empty.textContent = "No issues found.";
    panel.appendChild(empty);
  }

  // -- Resize handle --
  const resizeHandle = document.createElement("div");
  resizeHandle.className = "a11y-rp-resize";
  resizeHandle.setAttribute("aria-hidden", "true");
  panel.appendChild(resizeHandle);
  setupResize(panel, resizeHandle);

  // -- Drag behavior --
  setupDrag(panel, header);

  // -- Escape to close --
  panel.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      clearOverlays();
    }
  });

  document.body.appendChild(panel);

  // Restore saved position
  restorePosition(panel);

  // Focus first tab for keyboard users
  const firstTab = panel.querySelector<HTMLElement>('[role="tab"]');
  firstTab?.focus();

  return panel;
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

function buildTabs(
  severities: Severity[],
  grouped: Record<string, Issue[]>,
  _panel: HTMLElement,
): DocumentFragment {
  const frag = document.createDocumentFragment();

  // Tablist
  const tablist = document.createElement("div");
  tablist.className = "a11y-rp-tablist";
  tablist.setAttribute("role", "tablist");
  tablist.setAttribute("aria-label", "Issue categories");
  frag.appendChild(tablist);

  const tabPanels: HTMLElement[] = [];

  for (let i = 0; i < severities.length; i++) {
    const sev = severities[i];
    const meta = SEVERITY_META[sev];
    const sevIssues = grouped[sev];
    const tabId = `a11y-rp-tab-${sev}`;
    const panelId = `a11y-rp-panel-${sev}`;

    // Tab button
    const tab = document.createElement("button");
    tab.id = tabId;
    tab.className = "a11y-rp-tab";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", i === 0 ? "true" : "false");
    tab.setAttribute("aria-controls", panelId);
    tab.tabIndex = i === 0 ? 0 : -1;
    tab.innerHTML = `<span class="a11y-rp-tab-icon" style="color:${meta.color}">${meta.icon}</span> ${meta.label} <span class="a11y-rp-tab-count">${sevIssues.length}</span>`;
    tab.style.setProperty("--tab-color", meta.color);

    // Click to activate tab
    tab.addEventListener("click", () => {
      const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]'));
      const tabIdx = tabs.indexOf(tab);
      if (tabIdx >= 0) activateTab(tabs, tabPanels, tabIdx);
    });

    tablist.appendChild(tab);

    // Tab panel
    const tabPanel = document.createElement("div");
    tabPanel.id = panelId;
    tabPanel.className = "a11y-rp-tabpanel";
    tabPanel.setAttribute("role", "tabpanel");
    tabPanel.setAttribute("aria-labelledby", tabId);
    tabPanel.hidden = i !== 0;
    frag.appendChild(tabPanel);
    tabPanels.push(tabPanel);

    // Listbox inside tab panel
    const listbox = document.createElement("div");
    listbox.className = "a11y-rp-listbox";
    listbox.setAttribute("role", "listbox");
    listbox.setAttribute("aria-label", `${meta.label} list`);
    tabPanel.appendChild(listbox);

    for (let j = 0; j < sevIssues.length; j++) {
      const issue = sevIssues[j];
      const item = document.createElement("div");
      item.className = "a11y-rp-item";
      item.setAttribute("role", "option");
      item.tabIndex = j === 0 ? 0 : -1;
      item.dataset.selector = issue.selector;

      const msg = document.createElement("span");
      msg.className = "a11y-rp-item-msg";
      msg.textContent = issue.message;
      item.appendChild(msg);

      if (issue.wcag) {
        const wcag = document.createElement("span");
        wcag.className = "a11y-rp-item-wcag";
        wcag.textContent = issue.wcag;
        item.appendChild(wcag);
      }

      // Highlight on hover
      item.addEventListener("mouseenter", () => onItemActivate(issue.selector));
      item.addEventListener("mouseleave", () => clearHighlight());

      // Highlight on focus
      item.addEventListener("focus", () => onItemActivate(issue.selector));
      item.addEventListener("blur", () => clearHighlight());

      // Click to scroll to element
      item.addEventListener("click", () => scrollToElement(issue.selector));

      listbox.appendChild(item);
    }

    // Keyboard navigation inside listbox (up/down arrows, roving tabindex)
    listbox.addEventListener("keydown", (e: KeyboardEvent) => {
      const items = Array.from(listbox.querySelectorAll<HTMLElement>('[role="option"]'));
      const active = document.activeElement as HTMLElement;
      const idx = items.indexOf(active);
      if (idx < 0) return;

      let next: number | null = null;
      if (e.key === "ArrowDown") next = Math.min(idx + 1, items.length - 1);
      if (e.key === "ArrowUp") next = Math.max(idx - 1, 0);
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = items.length - 1;

      if (next !== null && next !== idx) {
        e.preventDefault();
        items[idx].tabIndex = -1;
        items[next].tabIndex = 0;
        items[next].focus();
      }
    });
  }

  // Tab keyboard navigation (left/right arrows)
  tablist.addEventListener("keydown", (e: KeyboardEvent) => {
    const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]'));
    const active = document.activeElement as HTMLElement;
    const idx = tabs.indexOf(active);
    if (idx < 0) return;

    let next: number | null = null;
    if (e.key === "ArrowRight") next = (idx + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;

    if (next !== null && next !== idx) {
      e.preventDefault();
      activateTab(tabs, tabPanels, next);
    }
  });

  return frag;
}

function activateTab(tabs: HTMLElement[], panels: HTMLElement[], index: number): void {
  for (let i = 0; i < tabs.length; i++) {
    const isActive = i === index;
    tabs[i].setAttribute("aria-selected", String(isActive));
    tabs[i].tabIndex = isActive ? 0 : -1;
    panels[i].hidden = !isActive;
  }
  tabs[index].focus();

  // Reset roving tabindex in newly revealed panel
  const items = panels[index].querySelectorAll<HTMLElement>('[role="option"]');
  for (let i = 0; i < items.length; i++) {
    items[i].tabIndex = i === 0 ? 0 : -1;
  }
}

// ---------------------------------------------------------------------------
// Item activation → highlight element on page
// ---------------------------------------------------------------------------

function onItemActivate(selector: string): void {
  if (!selector || selector === "html") return;
  highlightElement(selector);
}

function scrollToElement(selector: string): void {
  if (!selector || selector === "html") return;
  try {
    const el = document.querySelector(selector);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    highlightElement(selector);
  } catch {
    // Invalid selector
  }
}

// ---------------------------------------------------------------------------
// Drag
// ---------------------------------------------------------------------------

function setupDrag(panel: HTMLElement, handle: HTMLElement): void {
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;

  function onPointerDown(e: PointerEvent): void {
    // Don't drag when interacting with the close button
    if ((e.target as HTMLElement).closest("button")) return;
    dragging = true;
    offsetX = e.clientX - panel.getBoundingClientRect().left;
    offsetY = e.clientY - panel.getBoundingClientRect().top;
    handle.setPointerCapture(e.pointerId);
    panel.style.transition = "none";
    e.preventDefault();
  }

  function onPointerMove(e: PointerEvent): void {
    if (!dragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    // Constrain within viewport
    const rect = panel.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    panel.style.left = `${x}px`;
    panel.style.top = `${y}px`;
    panel.style.right = "auto";
    panel.style.bottom = "auto";
  }

  function onPointerUp(): void {
    dragging = false;
    panel.style.transition = "";
    savePosition(panel);
  }

  handle.addEventListener("pointerdown", onPointerDown);
  handle.addEventListener("pointermove", onPointerMove);
  handle.addEventListener("pointerup", onPointerUp);
  handle.style.touchAction = "none";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function groupBySeverity(issues: Issue[]): Record<string, Issue[]> {
  const groups: Record<string, Issue[]> = {};
  for (const issue of issues) {
    if (!groups[issue.severity]) {
      groups[issue.severity] = [];
    }
    groups[issue.severity].push(issue);
  }
  return groups;
}

function escapeHtml(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------------------------------------------------------------------------
// Summary resize (vertical divider)
// ---------------------------------------------------------------------------

function setupSummaryResize(summary: HTMLElement, handle: HTMLElement): void {
  let startY = 0;
  let startH = 0;
  let resizing = false;

  function onPointerDown(e: PointerEvent): void {
    resizing = true;
    startY = e.clientY;
    startH = summary.getBoundingClientRect().height;
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e: PointerEvent): void {
    if (!resizing) return;
    const newH = Math.max(40, startH + (e.clientY - startY));
    summary.style.maxHeight = `${newH}px`;
  }

  function onPointerUp(): void {
    resizing = false;
  }

  handle.addEventListener("pointerdown", onPointerDown);
  handle.addEventListener("pointermove", onPointerMove);
  handle.addEventListener("pointerup", onPointerUp);
  handle.style.touchAction = "none";
}

// ---------------------------------------------------------------------------
// Resize
// ---------------------------------------------------------------------------

function setupResize(panel: HTMLElement, handle: HTMLElement): void {
  let startX = 0;
  let startY = 0;
  let startW = 0;
  let startH = 0;
  let resizing = false;

  function onPointerDown(e: PointerEvent): void {
    resizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startW = panel.getBoundingClientRect().width;
    startH = panel.getBoundingClientRect().height;
    handle.setPointerCapture(e.pointerId);
    panel.style.transition = "none";
    panel.style.maxHeight = "none";
    e.preventDefault();
  }

  function onPointerMove(e: PointerEvent): void {
    if (!resizing) return;
    const newW = Math.max(280, startW + (e.clientX - startX));
    const newH = Math.max(150, startH + (e.clientY - startY));
    panel.style.width = `${newW}px`;
    panel.style.height = `${newH}px`;
  }

  function onPointerUp(): void {
    resizing = false;
    panel.style.transition = "";
    savePosition(panel);
  }

  handle.addEventListener("pointerdown", onPointerDown);
  handle.addEventListener("pointermove", onPointerMove);
  handle.addEventListener("pointerup", onPointerUp);
  handle.style.touchAction = "none";
}

// ---------------------------------------------------------------------------
// Position persistence
// ---------------------------------------------------------------------------

function savePosition(panel: HTMLElement): void {
  try {
    const rect = panel.getBoundingClientRect();
    const data = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
    sessionStorage.setItem(POSITION_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage not available
  }
}

function restorePosition(panel: HTMLElement): void {
  try {
    const raw = sessionStorage.getItem(POSITION_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.top === "number" && typeof data.left === "number") {
      // Ensure position is within current viewport
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 100;
      const left = Math.max(0, Math.min(data.left, maxX));
      const top = Math.max(0, Math.min(data.top, maxY));
      panel.style.top = `${top}px`;
      panel.style.left = `${left}px`;
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    }
    if (typeof data.width === "number" && data.width >= 280) {
      panel.style.width = `${data.width}px`;
    }
    if (typeof data.height === "number" && data.height >= 150) {
      panel.style.height = `${data.height}px`;
      panel.style.maxHeight = "none";
    }
  } catch {
    // Invalid or unavailable
  }
}
