export const code = `// createAuditedPanel — panel con tabs passes / warnings / errors
//
// items: Element[]
//      | { el: Element, color?: string, tag?: string, indent?: number, label?: string }[]
//
// classify(item): 'pass' | 'warning' | 'error'
//   callback que recibe cada item normalizado y devuelve su categoría
//
// options: {
//   defaultColor?: string   // color de outline/badge cuando no se especifica por item
//   focusColor?:   string   // color del overlay al enfocar (default '#facc15')
// }
//
// Helper group(selector, opts?) — convierte un selector en items con opciones compartidas

function createAuditedPanel(title, items, classify, options = {}) {
  document.getElementById('bm-audit-panel')?.remove();
  document.getElementById('bm-audit-highlight')?.remove();
  document.querySelectorAll('[data-bm-audit-label]').forEach(l => l.remove());

  const defaultColor = options.defaultColor || '#6366f1';
  const focusColor   = options.focusColor   || '#facc15';

  const CATEGORY_COLORS = {
    pass:    '#22c55e',
    warning: '#f59e0b',
    error:   '#ef4444',
  };

  const CATEGORY_LABELS = {
    pass:    'Passes',
    warning: 'Warnings',
    errors:  'Errors',
  };

  // ── Normalise items ──
  const normalized = items.map(item =>
    item instanceof Element
      ? { el: item, color: defaultColor, tag: item.tagName.toLowerCase(), indent: 0, label: null, message: null }
      : {
          el:      item.el,
          color:   item.color   || defaultColor,
          tag:     item.tag     || item.el.tagName.toLowerCase(),
          indent:  item.indent  || 0,
          label:   item.label   ?? null,
          message: item.message ?? null,
        }
  );

  // ── Classify each item ──
  const categorized = { pass: [], warning: [], error: [] };
  for (const item of normalized) {
    const cat = classify(item) || 'pass';
    categorized[cat].push(item);
  }

  // ── Apply outlines + inline labels to every element ──
  for (const [cat, catItems] of Object.entries(categorized)) {
    const catColor = CATEGORY_COLORS[cat];
    for (const { el, label } of catItems) {
      el.dataset.bmAuditHighlighted = 'true';
      el.style.setProperty('outline',        \`2px solid \${catColor}\`, 'important');
      el.style.setProperty('outline-offset', '2px',                     'important');

      if (label) {
        const lbl = document.createElement('span');
        lbl.dataset.bmAuditLabel = 'true';
        lbl.textContent = label;
        lbl.style.cssText = [
          'position:absolute',
          \`background:\${catColor}\`,
          'color:#fff',
          'font:bold 10px/1 monospace',
          'padding:1px 5px',
          'border-radius:3px',
          'pointer-events:none',
          \`z-index:2147483646\`,
          'white-space:nowrap',
        ].join(';');
        const rect = el.getBoundingClientRect();
        lbl.style.top  = \`\${window.scrollY + rect.top - 18}px\`;
        lbl.style.left = \`\${window.scrollX + rect.left}px\`;
        document.body.appendChild(lbl);
      }
    }
  }

  function clearHighlights() {
    for (const { el } of normalized) {
      delete el.dataset.bmAuditHighlighted;
      el.style.removeProperty('outline');
      el.style.removeProperty('outline-offset');
    }
    document.querySelectorAll('[data-bm-audit-label]').forEach(l => l.remove());
  }

  if (!document.getElementById('bm-audit-style')) {
    const style = document.createElement('style');
    style.id = 'bm-audit-style';
    style.textContent = \`
      #bm-audit-panel {
        position: fixed; bottom: 12px; right: 12px;
        z-index: 2147483647;
        background: #1a1a2e; color: #f0f0f4;
        font: 14px/1.5 system-ui, sans-serif;
        border-radius: 10px; width: 420px;
        max-width: calc(100vw - 24px);
        max-height: min(80vh, calc(100vh - 24px));
        display: flex; flex-direction: column;
        box-shadow: 0 4px 24px rgba(0,0,0,.5); overflow: hidden;
      }
      #bm-audit-header {
        display: flex; align-items: center; gap: 8px;
        padding: 10px 14px; background: #2a2a4e;
        cursor: grab; user-select: none;
        border-bottom: 1px solid rgba(255,255,255,.1);
      }
      #bm-audit-title { flex: 1; font-weight: 700; font-size: 13px; }
      #bm-audit-close {
        background: none; border: none; color: #f0f0f4;
        cursor: pointer; font-size: 16px; padding: 2px 6px;
        border-radius: 4px;
      }
      #bm-audit-close:hover { background: rgba(255,255,255,.1); }
      #bm-audit-tabs {
        display: flex; gap: 0;
        border-bottom: 1px solid rgba(255,255,255,.1);
        background: rgba(255,255,255,.03);
      }
      [role="tab"] {
        flex: 1; padding: 8px 6px; font-size: 11px; font-weight: 600;
        background: none; border: none; color: rgba(255,255,255,.5);
        cursor: pointer; border-bottom: 2px solid transparent;
        transition: color .15s, border-color .15s;
        display: flex; align-items: center; justify-content: center; gap: 5px;
      }
      [role="tab"] .bm-tab-count {
        font-size: 10px; padding: 1px 5px;
        border-radius: 10px; background: rgba(255,255,255,.1);
        color: rgba(255,255,255,.6);
      }
      [role="tab"][aria-selected="true"] {
        color: #f0f0f4; border-bottom-color: currentColor;
      }
      [role="tab"][aria-selected="true"].bm-tab-pass    { color: #22c55e; }
      [role="tab"][aria-selected="true"].bm-tab-warning { color: #f59e0b; }
      [role="tab"][aria-selected="true"].bm-tab-error   { color: #ef4444; }
      [role="tab"]:hover { color: #f0f0f4; background: rgba(255,255,255,.05); }
      #bm-audit-hint {
        font-size: 11px; color: rgba(255,255,255,.4);
        padding: 6px 14px; background: rgba(255,255,255,.03);
        border-bottom: 1px solid rgba(255,255,255,.05);
      }
      .bm-audit-tabpanel {
        overflow-y: auto; flex: 1;
        padding: 6px 0; margin: 0; list-style: none;
      }
      .bm-audit-tabpanel[hidden] { display: none; }
      .bm-audit-empty {
        padding: 24px 14px; text-align: center;
        font-size: 12px; color: rgba(255,255,255,.3);
      }
      [role="option"] {
        padding: 8px 14px; font-size: 12px; cursor: pointer;
        border-bottom: 1px solid rgba(255,255,255,.05);
        outline: none; display: flex; align-items: center; gap: 8px;
      }
      [role="option"]:last-child { border-bottom: none; }
      [role="option"]:hover,
      [role="option"]:focus { background: rgba(255,255,255,.08); }
      [role="option"][aria-selected="true"] { background: rgba(255,255,255,.12); }
      [role="option"] .bm-tag {
        font-size: 10px; font-weight: 700; font-family: monospace;
        padding: 1px 5px; border-radius: 3px;
        min-width: 28px; text-align: center; flex-shrink: 0;
      }
      #bm-audit-highlight {
        position: absolute; pointer-events: none;
        z-index: 2147483645; border-radius: 4px;
      }
    \`;
    document.head.appendChild(style);
  }

  // ── Highlight helper ──
  function doHighlight(el, color) {
    document.getElementById('bm-audit-highlight')?.remove();
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ov   = document.createElement('div');
    ov.id = 'bm-audit-highlight';
    ov.style.cssText = [
      \`top:\${window.scrollY + rect.top - 3}px\`,
      \`left:\${window.scrollX + rect.left - 3}px\`,
      \`width:\${rect.width + 6}px\`,
      \`height:\${rect.height + 6}px\`,
      \`border:3px solid \${focusColor}\`,
      \`background:\${focusColor}26\`,
    ].join(';');
    document.body.appendChild(ov);
  }

  // ── Panel structure ──
  const panel = document.createElement('div');
  panel.id = 'bm-audit-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', title);

  const header = document.createElement('div');
  header.id = 'bm-audit-header';

  const titleEl = document.createElement('span');
  titleEl.id = 'bm-audit-title';
  titleEl.textContent = \`\${title} (\${normalized.length})\`;

  const closeBtn = document.createElement('button');
  closeBtn.id = 'bm-audit-close';
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Close panel');
  closeBtn.addEventListener('pointerdown', e => e.stopPropagation());
  closeBtn.onclick = () => {
    panel.remove();
    document.getElementById('bm-audit-highlight')?.remove();
    clearHighlights();
  };
  header.appendChild(titleEl);
  header.appendChild(closeBtn);

  // ── Tabs ──
  const tabsEl = document.createElement('div');
  tabsEl.id = 'bm-audit-tabs';
  tabsEl.setAttribute('role', 'tablist');
  tabsEl.setAttribute('aria-label', 'Audit results');

  const hint = document.createElement('p');
  hint.id = 'bm-audit-hint';
  hint.textContent = '↑ ↓ to navigate · Enter to scroll into view';

  const tabDefs = [
    { key: 'pass',    cls: 'bm-tab-pass',    label: 'Passes'   },
    { key: 'warning', cls: 'bm-tab-warning', label: 'Warnings' },
    { key: 'error',   cls: 'bm-tab-error',   label: 'Errors'   },
  ];

  const tabEls     = {};
  const panelEls   = {};
  let activeTab    = 'pass';

  function activateTab(key) {
    activeTab = key;
    for (const def of tabDefs) {
      const active = def.key === key;
      tabEls[def.key].setAttribute('aria-selected', String(active));
      tabEls[def.key].setAttribute('tabindex', active ? '0' : '-1');
      panelEls[def.key].hidden = !active;
    }
    // Focus first item in the new panel
    panelEls[key].querySelector('[role="option"]')?.focus();
  }

  // Tab keyboard navigation
  tabsEl.addEventListener('keydown', e => {
    const keys  = tabDefs.map(d => d.key);
    const idx   = keys.indexOf(activeTab);
    let next = null;
    if (e.key === 'ArrowRight') next = (idx + 1) % keys.length;
    if (e.key === 'ArrowLeft')  next = (idx - 1 + keys.length) % keys.length;
    if (e.key === 'Home')       next = 0;
    if (e.key === 'End')        next = keys.length - 1;
    if (next !== null) {
      e.preventDefault();
      activateTab(keys[next]);
      tabEls[keys[next]].focus();
    }
  });

  for (const def of tabDefs) {
    const catItems = categorized[def.key];
    const catColor = CATEGORY_COLORS[def.key];
    const panelId  = \`bm-audit-panel-\${def.key}\`;
    const tabId    = \`bm-audit-tab-\${def.key}\`;

    const tab = document.createElement('button');
    tab.id = tabId;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', def.key === activeTab ? 'true' : 'false');
    tab.setAttribute('aria-controls', panelId);
    tab.setAttribute('tabindex', def.key === activeTab ? '0' : '-1');
    tab.className = def.cls;
    tab.addEventListener('click', () => activateTab(def.key));

    const countBadge = document.createElement('span');
    countBadge.className = 'bm-tab-count';
    countBadge.textContent = catItems.length;

    tab.textContent = def.label + ' ';
    tab.appendChild(countBadge);
    tabEls[def.key] = tab;
    tabsEl.appendChild(tab);

    // ── Tab panel ──
    const listbox = document.createElement('ul');
    listbox.id = panelId;
    listbox.setAttribute('role', 'listbox');
    listbox.setAttribute('aria-labelledby', tabId);
    listbox.className = 'bm-audit-tabpanel';
    listbox.hidden = def.key !== activeTab;

    if (catItems.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'bm-audit-empty';
      empty.textContent = \`No \${def.label.toLowerCase()}\`;
      listbox.appendChild(empty);
    } else {
      catItems.forEach(({ el, tag, indent, message }, i) => {
        const item = document.createElement('li');
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', 'false');
        item.tabIndex = i === 0 ? 0 : -1;
        if (indent) item.style.paddingLeft = \`\${14 + indent}px\`;

        const badge = document.createElement('span');
        badge.className = 'bm-tag';
        badge.textContent = tag;
        badge.style.cssText = \`background:\${catColor};color:#fff;\`;

        const text = document.createElement('span');
        text.textContent = message ||
          el.getAttribute('content')?.slice(0, 80) ||
          el.textContent?.trim().slice(0, 80) ||
          el.outerHTML.slice(0, 80) || '(empty)';

        item.addEventListener('focus', () => {
          doHighlight(el, catColor);
          listbox.querySelectorAll('[role="option"]').forEach(o => {
            o.setAttribute('aria-selected', 'false');
            o.style.borderLeft = '';
          });
          item.setAttribute('aria-selected', 'true');
          item.style.borderLeft = \`3px solid \${catColor}\`;
        });
        item.addEventListener('blur', () => {
          document.getElementById('bm-audit-highlight')?.remove();
        });
        item.addEventListener('mouseenter', () => item.focus());
        item.addEventListener('click', () => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        item.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });

        item.appendChild(badge);
        item.appendChild(text);
        listbox.appendChild(item);
      });

      // Roving tabindex per panel
      listbox.addEventListener('keydown', e => {
        const opts = Array.from(listbox.querySelectorAll('[role="option"]'));
        const idx  = opts.indexOf(document.activeElement);
        let next   = null;
        if (e.key === 'ArrowDown') next = Math.min(idx + 1, opts.length - 1);
        if (e.key === 'ArrowUp')   next = Math.max(idx - 1, 0);
        if (e.key === 'Home')      next = 0;
        if (e.key === 'End')       next = opts.length - 1;
        if (next !== null) {
          e.preventDefault();
          opts[idx].tabIndex = -1;
          opts[next].tabIndex = 0;
          opts[next].focus();
        }
      });
    }

    panelEls[def.key] = listbox;
  }

  // ── Drag ──
  let ox = 0, oy = 0;
  header.addEventListener('pointerdown', e => {
    e.preventDefault();
    header.setPointerCapture(e.pointerId);
    ox = e.clientX - panel.getBoundingClientRect().left;
    oy = e.clientY - panel.getBoundingClientRect().top;
  });
  header.addEventListener('pointermove', e => {
    if (!header.hasPointerCapture(e.pointerId)) return;
    panel.style.right = 'auto'; panel.style.bottom = 'auto';
    panel.style.left = \`\${e.clientX - ox}px\`;
    panel.style.top  = \`\${e.clientY - oy}px\`;
  });

  panel.appendChild(header);
  panel.appendChild(tabsEl);
  panel.appendChild(hint);
  for (const def of tabDefs) panel.appendChild(panelEls[def.key]);
  document.body.appendChild(panel);

  // Open first non-empty tab automatically
  const firstNonEmpty = tabDefs.find(d => categorized[d.key].length > 0)?.key || 'pass';
  activateTab(firstNonEmpty);
  tabEls[firstNonEmpty].focus();

  return panel;
}

// ── Helper: convierte un selector en items con opciones compartidas ──
function group(selector, opts = {}) {
  return Array.from(document.querySelectorAll(selector)).map(el => ({
    el,
    color:  opts.color,
    tag:    opts.tag    || el.tagName.toLowerCase(),
    indent: opts.indent || 0,
    label:  opts.label  ?? opts.tag ?? el.tagName.toLowerCase(),
  }));
}

// ── Ejemplo: viewport meta tag audit ──
// Reglas basadas en https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport
//
// pass    → content válido y accesible (user-scalable != no, maximum-scale >= 2)
// warning → ausente pero la página puede funcionar (no hay <meta name="viewport">)
// error   → user-scalable=no  o  maximum-scale < 2  (impide el zoom del usuario)

const viewportMetas = Array.from(
  document.querySelectorAll('meta[name="viewport"]')
);

// Si no hay ninguno, creamos un elemento sintético para representar la ausencia
const items = viewportMetas.length > 0
  ? viewportMetas.map(el => ({ el, tag: 'meta', label: 'viewport' }))
  : [{ el: document.head, tag: 'head', label: 'missing viewport', message: 'No <meta name="viewport"> found in <head>' }];

createAuditedPanel(
  'Viewport meta',
  items,
  ({ el }) => {
    // Caso: no existe ningún <meta name="viewport">
    if (el === document.head) return 'warning';

    const content = (el.getAttribute('content') || '').toLowerCase();

    // Obtener el valor de user-scalable
    const scalableMatch = content.match(/user-scalable\\s*=\\s*([^,]+)/);
    const scalable = scalableMatch ? scalableMatch[1].trim() : 'yes';
    if (scalable === 'no' || scalable === '0') return 'error';

    // Obtener maximum-scale
    const maxScaleMatch = content.match(/maximum-scale\\s*=\\s*([\\d.]+)/);
    const maxScale = maxScaleMatch ? parseFloat(maxScaleMatch[1]) : Infinity;
    if (maxScale < 2) return 'error';

    return 'pass';
  }
);`;
