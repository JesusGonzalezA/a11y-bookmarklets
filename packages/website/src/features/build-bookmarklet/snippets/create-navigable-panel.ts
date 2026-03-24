export const code = `// createNavigablePanel — panel con lista navegable por teclado + resaltado
function createNavigablePanel(title, elements) {
  document.getElementById('bm-nav-panel')?.remove();
  document.getElementById('bm-highlight')?.remove();

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
      [role="option"][aria-selected="true"] {
        background: rgba(99,102,241,.25);
        border-left: 3px solid #6366f1;
      }
      [role="option"] .bm-tag {
        font-size: 10px; font-weight: 700; font-family: monospace;
        background: rgba(255,255,255,.15); padding: 1px 5px;
        border-radius: 3px; min-width: 28px; text-align: center;
      }
      [data-bm-highlighted] {
        outline: 2px solid rgba(99,102,241,.6) !important;
        outline-offset: 2px !important;
      }
      #bm-highlight {
        position: absolute; pointer-events: none;
        z-index: 2147483645;
        border: 3px solid #facc15; border-radius: 4px;
        background: rgba(250,204,21,.15);
        animation: bm-pulse 1s ease-in-out infinite;
      }
      @keyframes bm-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(250,204,21,.4); }
        50% { box-shadow: 0 0 0 8px rgba(250,204,21,0); }
      }
    \`;
    document.head.appendChild(style);
  }

  // ── Highlight helper ──
  function doHighlight(el) {
    document.getElementById('bm-highlight')?.remove();
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ov = document.createElement('div');
    ov.id = 'bm-highlight';
    ov.style.top = \`\${window.scrollY + rect.top - 2}px\`;
    ov.style.left = \`\${window.scrollX + rect.left - 2}px\`;
    ov.style.width = \`\${rect.width + 4}px\`;
    ov.style.height = \`\${rect.height + 4}px\`;
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
  titleEl.textContent = \`\${title} (\${elements.length})\`;
  const closeBtn = document.createElement('button');
  closeBtn.id = 'bm-nav-close';
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Close panel');
  closeBtn.addEventListener('pointerdown', e => e.stopPropagation());
  closeBtn.onclick = () => {
    panel.remove();
    document.getElementById('bm-highlight')?.remove();
    elements.forEach(el => delete el.dataset.bmHighlighted);
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

  elements.forEach((el, i) => {
    const item = document.createElement('li');
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', 'false');
    item.tabIndex = i === 0 ? 0 : -1;

    const tag = document.createElement('span');
    tag.className = 'bm-tag';
    tag.textContent = el.tagName.toLowerCase();

    const text = document.createElement('span');
    text.textContent = el.textContent?.trim().slice(0, 80) || '(empty)';

    item.appendChild(tag);
    item.appendChild(text);

    el.dataset.bmHighlighted = 'true';

    item.addEventListener('focus', () => {
      doHighlight(el);
      listbox.querySelectorAll('[role="option"]').forEach(o =>
        o.setAttribute('aria-selected', 'false')
      );
      item.setAttribute('aria-selected', 'true');
    });
    item.addEventListener('blur', () => {
      document.getElementById('bm-highlight')?.remove();
    });
    item.addEventListener('mouseenter', () => { item.focus(); });
    item.addEventListener('click', () => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    listbox.appendChild(item);
  });

  // ── Keyboard navigation (roving tabindex) ──
  listbox.addEventListener('keydown', e => {
    const items = Array.from(listbox.querySelectorAll('[role="option"]'));
    const idx = items.indexOf(document.activeElement);
    let next = null;
    if (e.key === 'ArrowDown') next = Math.min(idx + 1, items.length - 1);
    if (e.key === 'ArrowUp') next = Math.max(idx - 1, 0);
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = items.length - 1;
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
    panel.style.top = \`\${e.clientY - oy}px\`;
  });

  panel.appendChild(header);
  panel.appendChild(hint);
  panel.appendChild(listbox);
  document.body.appendChild(panel);

  // Focus first item
  listbox.querySelector('[role="option"]')?.focus();
  return panel;
}

// Example usage:
const links = Array.from(document.querySelectorAll('a[href]'));
createNavigablePanel('Links', links);`;
