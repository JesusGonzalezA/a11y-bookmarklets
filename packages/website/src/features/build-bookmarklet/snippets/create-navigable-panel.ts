export const code = `// createNavigablePanel — panel con lista navegable por teclado + resaltado
//
// items: Element[]
//      | { el: Element, color?: string, tag?: string, indent?: number, label?: string }[]
//
// options: {
//   defaultColor?: string   // color de outline/badge cuando no se especifica por item
//   focusColor?:   string   // color del overlay al enfocar (default '#facc15')
// }
//
// Helper group(selector, opts?) — convierte un selector en items con opciones compartidas
// opts.label: texto flotante sobre el elemento ('h1', 'button', etc.)

function createNavigablePanel(title, items, options = {}) {
  document.getElementById('bm-nav-panel')?.remove();
  document.getElementById('bm-highlight')?.remove();
  document.querySelectorAll('[data-bm-label]').forEach(l => l.remove());

  const defaultColor = options.defaultColor || '#6366f1';
  const focusColor   = options.focusColor   || '#facc15';

  // ── Normalise items ──
  const normalized = items.map(item =>
    item instanceof Element
      ? { el: item, color: defaultColor, tag: item.tagName.toLowerCase(), indent: 0, label: null }
      : {
          el:     item.el,
          color:  item.color  || defaultColor,
          tag:    item.tag    || item.el.tagName.toLowerCase(),
          indent: item.indent || 0,
          label:  item.label  ?? null,
        }
  );

  // ── Apply outlines + inline labels to every element ──
  for (const { el, color, label } of normalized) {
    el.dataset.bmHighlighted = 'true';
    el.style.setProperty('outline',        \`2px solid \${color}\`, 'important');
    el.style.setProperty('outline-offset', '2px',                 'important');

    if (label) {
      const lbl = document.createElement('span');
      lbl.dataset.bmLabel = 'true';
      lbl.textContent = label;
      lbl.style.cssText = [
        'position:absolute',
        \`background:\${color}\`,
        'color:#fff',
        'font:bold 10px/1 monospace',
        'padding:1px 5px',
        'border-radius:3px',
        'pointer-events:none',
        \`z-index:2147483646\`,
        'white-space:nowrap',
      ].join(';');
      // position relative to the element
      const rect = el.getBoundingClientRect();
      lbl.style.top  = \`\${window.scrollY + rect.top - 18}px\`;
      lbl.style.left = \`\${window.scrollX + rect.left}px\`;
      document.body.appendChild(lbl);
    }
  }

  function clearHighlights() {
    for (const { el } of normalized) {
      delete el.dataset.bmHighlighted;
      el.style.removeProperty('outline');
      el.style.removeProperty('outline-offset');
    }
    document.querySelectorAll('[data-bm-label]').forEach(l => l.remove());
  }

  if (!document.getElementById('bm-nav-style')) {
    const style = document.createElement('style');
    style.id = 'bm-nav-style';
    style.textContent = \`
      #bm-nav-panel {
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
      #bm-nav-header {
        display: flex; align-items: center; gap: 8px;
        padding: 10px 14px; background: #2a2a4e;
        cursor: grab; user-select: none;
        border-bottom: 1px solid rgba(255,255,255,.1);
      }
      #bm-nav-title { flex: 1; font-weight: 700; font-size: 13px; }
      #bm-nav-hint {
        font-size: 11px; color: rgba(255,255,255,.4);
        padding: 6px 14px; background: rgba(255,255,255,.03);
        border-bottom: 1px solid rgba(255,255,255,.05);
      }
      #bm-nav-close {
        background: none; border: none; color: #f0f0f4;
        cursor: pointer; font-size: 16px; padding: 2px 6px;
        border-radius: 4px;
      }
      #bm-nav-close:hover { background: rgba(255,255,255,.1); }
      #bm-nav-list {
        overflow-y: auto; flex: 1;
        padding: 6px 0; margin: 0; list-style: none;
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
      #bm-highlight {
        position: absolute; pointer-events: none;
        z-index: 2147483645; border-radius: 4px;
      }
    \`;
    document.head.appendChild(style);
  }

  // ── Highlight helper (uses focusColor, no animation) ──
  function doHighlight(el) {
    document.getElementById('bm-highlight')?.remove();
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ov   = document.createElement('div');
    ov.id = 'bm-highlight';
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
  panel.id = 'bm-nav-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', title);

  const header = document.createElement('div');
  header.id = 'bm-nav-header';

  const titleEl = document.createElement('span');
  titleEl.id = 'bm-nav-title';
  titleEl.textContent = \`\${title} (\${normalized.length})\`;

  const closeBtn = document.createElement('button');
  closeBtn.id = 'bm-nav-close';
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Close panel');
  closeBtn.addEventListener('pointerdown', e => e.stopPropagation());
  closeBtn.onclick = () => {
    panel.remove();
    document.getElementById('bm-highlight')?.remove();
    clearHighlights();
  };
  header.appendChild(titleEl);
  header.appendChild(closeBtn);

  const hint = document.createElement('p');
  hint.id = 'bm-nav-hint';
  hint.textContent = '↑ ↓ to navigate · Enter to scroll into view';

  const listbox = document.createElement('ul');
  listbox.id = 'bm-nav-list';
  listbox.setAttribute('role', 'listbox');
  listbox.setAttribute('aria-label', title);

  normalized.forEach(({ el, color, tag, indent }, i) => {
    const item = document.createElement('li');
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', 'false');
    item.tabIndex = i === 0 ? 0 : -1;
    if (indent) item.style.paddingLeft = \`\${14 + indent}px\`;

    const badge = document.createElement('span');
    badge.className = 'bm-tag';
    badge.textContent = tag;
    badge.style.cssText = \`background:\${color};color:#fff;\`;

    const text = document.createElement('span');
    text.textContent = el.textContent?.trim().slice(0, 80) || '(empty)';

    // Selected indicator via border-left using item color
    item.addEventListener('focus', () => {
      doHighlight(el);
      listbox.querySelectorAll('[role="option"]').forEach(o => {
        o.setAttribute('aria-selected', 'false');
        o.style.borderLeft = '';
      });
      item.setAttribute('aria-selected', 'true');
      item.style.borderLeft = \`3px solid \${color}\`;
    });
    item.addEventListener('blur', () => {
      document.getElementById('bm-highlight')?.remove();
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

  // ── Keyboard navigation (roving tabindex) ──
  listbox.addEventListener('keydown', e => {
    const items = Array.from(listbox.querySelectorAll('[role="option"]'));
    const idx = items.indexOf(document.activeElement);
    let next = null;
    if (e.key === 'ArrowDown') next = Math.min(idx + 1, items.length - 1);
    if (e.key === 'ArrowUp')   next = Math.max(idx - 1, 0);
    if (e.key === 'Home')      next = 0;
    if (e.key === 'End')       next = items.length - 1;
    if (next !== null) {
      e.preventDefault();
      items[idx].tabIndex = -1;
      items[next].tabIndex = 0;
      items[next].focus();
    }
  });

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
  panel.appendChild(hint);
  panel.appendChild(listbox);
  document.body.appendChild(panel);

  listbox.querySelector('[role="option"]')?.focus();
  return panel;
}

// ── Helper: convierte un selector en items con opciones compartidas ──
// group(selector, { color, tag, indent, label })
// label: texto flotante junto al elemento (e.g. 'h1', 'nav', 'button')
function group(selector, opts = {}) {
  return Array.from(document.querySelectorAll(selector)).map(el => ({
    el,
    color:  opts.color,
    tag:    opts.tag    || el.tagName.toLowerCase(),
    indent: opts.indent || 0,
    label:  opts.label  ?? opts.tag ?? el.tagName.toLowerCase(),
  }));
}

// ── Ejemplo: headings con color, indentación y etiqueta flotante ──
createNavigablePanel('Headings', [
  ...group('h1', { color: '#e74c3c', indent: 0,  label: 'h1' }),
  ...group('h2', { color: '#e67e22', indent: 16, label: 'h2' }),
  ...group('h3', { color: '#f1c40f', indent: 32, label: 'h3' }),
]);`;
