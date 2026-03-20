/**
 * DOM utilities shared across bookmarklets.
 */

export function uniqueSelector(el: Element): string {
  if (el.id) {
    return `#${CSS.escape(el.id)}`;
  }

  const path: string[] = [];
  let current: Element | null = el;

  while (current && current !== document.documentElement) {
    let segment = current.tagName.toLowerCase();

    if (current.id) {
      segment = `#${CSS.escape(current.id)}`;
      path.unshift(segment);
      break;
    }

    const parent: Element | null = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c: Element) => c.tagName === current!.tagName,
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        segment += `:nth-of-type(${index})`;
      }
    }

    path.unshift(segment);
    current = parent;
  }

  return path.join(" > ");
}

export function truncatedHtml(el: Element, maxLength = 200): string {
  const html = el.outerHTML;
  if (html.length <= maxLength) return html;
  return html.slice(0, maxLength) + "…";
}

export function queryAll(selector: string, root: ParentNode = document): Element[] {
  return Array.from(root.querySelectorAll(selector));
}
