/**
 * Shared accessibility helpers — getAccessibleName, isVisible, etc.
 *
 * Used across multiple bookmarklets to avoid duplication.
 */

/** Get the accessible name of an element via aria-label or aria-labelledby. */
export function getAccessibleName(el: Element): string {
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;

  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy) {
    return labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
      .join(" ");
  }

  return "";
}

/** Check if an element is visually visible (not hidden by CSS). */
export function isElementVisible(el: Element): boolean {
  const style = getComputedStyle(el);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0" &&
    (el as HTMLElement).offsetParent !== null
  );
}

/** Get a truncated text label for an element. */
export function getElementLabel(el: Element, maxLength = 40): string {
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;

  const text = el.textContent?.trim() ?? "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

/** Check if an element is a bookmarklet overlay (should be skipped during auditing). */
export function isBookmarkletOverlay(el: Element): boolean {
  return (el as HTMLElement).hasAttribute("data-a11y-bookmarklet");
}
