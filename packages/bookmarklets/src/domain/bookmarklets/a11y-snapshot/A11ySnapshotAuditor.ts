import { queryAll, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { getAccessibleName, isBookmarkletOverlay, isElementVisible } from "../shared/accessibility.js";
import { createIssue } from "../shared/issue-helpers.js";
import type {
  A11ySnapshotData,
  SnapshotAriaRole,
  SnapshotButton,
  SnapshotFormControl,
  SnapshotHeading,
  SnapshotImage,
  SnapshotLandmark,
  SnapshotLink,
  SnapshotLiveRegion,
  SnapshotMedia,
  SnapshotMetaTag,
  SnapshotStats,
} from "./types.js";

function collectHeadings(): SnapshotHeading[] {
  return queryAll("h1, h2, h3, h4, h5, h6").map((el) => ({
    level: parseInt(el.tagName.charAt(1), 10),
    text: el.textContent?.trim() ?? "",
    selector: uniqueSelector(el),
  }));
}

const LANDMARK_ROLES = ["banner", "navigation", "main", "contentinfo", "complementary", "search", "form", "region"];
const LANDMARK_TAG_MAP: Record<string, string> = {
  header: "banner",
  nav: "navigation",
  main: "main",
  footer: "contentinfo",
  aside: "complementary",
  section: "region",
  form: "form",
};

function collectLandmarks(): SnapshotLandmark[] {
  const landmarks: SnapshotLandmark[] = [];

  // Explicit ARIA roles
  for (const role of LANDMARK_ROLES) {
    for (const el of queryAll(`[role="${role}"]`)) {
      landmarks.push({
        role,
        label: getAccessibleName(el) || el.getAttribute("aria-label") || "",
        selector: uniqueSelector(el),
      });
    }
  }

  // Implicit landmark tags (without explicit role)
  for (const [tag, role] of Object.entries(LANDMARK_TAG_MAP)) {
    for (const el of queryAll(`${tag}:not([role])`)) {
      landmarks.push({
        role,
        label: getAccessibleName(el) || "",
        selector: uniqueSelector(el),
      });
    }
  }

  return landmarks;
}

function collectImages(): SnapshotImage[] {
  return queryAll("img, [role='img'], svg[role='img']").map((el) => ({
    alt: el.getAttribute("alt"),
    role: el.getAttribute("role"),
    src: (el as HTMLImageElement).src ?? "",
    selector: uniqueSelector(el),
  }));
}

function collectFormControls(): SnapshotFormControl[] {
  return queryAll("input:not([type='hidden']), select, textarea, [role='textbox'], [role='combobox'], [role='listbox']").map((el) => {
    const labelEl = el.id ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`) : null;
    const implicitLabel = el.closest("label");
    const label =
      getAccessibleName(el) ||
      labelEl?.textContent?.trim() ||
      implicitLabel?.textContent?.trim() ||
      el.getAttribute("title") ||
      el.getAttribute("placeholder") ||
      "";

    return {
      tag: el.tagName.toLowerCase(),
      type: el.getAttribute("type"),
      label,
      hasAutocomplete: el.hasAttribute("autocomplete"),
      selector: uniqueSelector(el),
    };
  });
}

function collectLinks(): SnapshotLink[] {
  return queryAll("a[href], [role='link']").map((el) => ({
    text: getAccessibleName(el) || el.textContent?.trim() || "",
    href: (el as HTMLAnchorElement).href ?? "",
    opensNewWindow: el.getAttribute("target") === "_blank",
    selector: uniqueSelector(el),
  }));
}

function collectButtons(): SnapshotButton[] {
  return queryAll("button, [role='button'], input[type='button'], input[type='submit'], input[type='reset']").map((el) => ({
    text: getAccessibleName(el) || el.textContent?.trim() || (el as HTMLInputElement).value || "",
    selector: uniqueSelector(el),
  }));
}

function collectLiveRegions(): SnapshotLiveRegion[] {
  return queryAll("[aria-live], [role='alert'], [role='status'], [role='log'], [role='marquee'], [role='timer']").map((el) => ({
    role: el.getAttribute("role"),
    ariaLive: el.getAttribute("aria-live"),
    selector: uniqueSelector(el),
  }));
}

function collectAriaRoles(): SnapshotAriaRole[] {
  const roleCounts = new Map<string, number>();
  for (const el of queryAll("[role]")) {
    const role = el.getAttribute("role") ?? "";
    roleCounts.set(role, (roleCounts.get(role) ?? 0) + 1);
  }
  return Array.from(roleCounts.entries())
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count);
}

function collectMedia(): SnapshotMedia[] {
  return queryAll("video, audio").map((el) => ({
    tag: el.tagName.toLowerCase(),
    hasControls: el.hasAttribute("controls"),
    autoplay: el.hasAttribute("autoplay"),
    trackCount: el.querySelectorAll("track").length,
    selector: uniqueSelector(el),
  }));
}

function collectMetaTags(): SnapshotMetaTag[] {
  return queryAll("meta").map((el) => ({
    name: el.getAttribute("name"),
    httpEquiv: el.getAttribute("http-equiv"),
    content: el.getAttribute("content"),
  }));
}

function collectStats(
  images: SnapshotImage[],
  links: SnapshotLink[],
  buttons: SnapshotButton[],
  forms: SnapshotFormControl[],
  headings: SnapshotHeading[],
  landmarks: SnapshotLandmark[],
): SnapshotStats {
  const allElements = queryAll("*").filter((el) => !isBookmarkletOverlay(el));
  const interactive = queryAll(
    "a[href], button, input, select, textarea, [role='button'], [role='link'], [tabindex]:not([tabindex='-1'])",
  );
  const hidden = allElements.filter((el) => !isElementVisible(el));
  const ariaHidden = queryAll("[aria-hidden='true']");

  return {
    totalElements: allElements.length,
    interactiveElements: interactive.length,
    hiddenElements: hidden.length,
    ariaHiddenElements: ariaHidden.length,
    imagesTotal: images.length,
    imagesWithAlt: images.filter((i) => i.alt !== null && i.alt !== "").length,
    imagesWithoutAlt: images.filter((i) => i.alt === null).length,
    linksTotal: links.length,
    buttonsTotal: buttons.length,
    formControlsTotal: forms.length,
    headingsTotal: headings.length,
    landmarksTotal: landmarks.length,
  };
}

export function auditA11ySnapshot(): AuditOutput<A11ySnapshotData> {
  const headings = collectHeadings();
  const landmarks = collectLandmarks();
  const images = collectImages();
  const forms = collectFormControls();
  const links = collectLinks();
  const buttons = collectButtons();
  const liveRegions = collectLiveRegions();
  const ariaRoles = collectAriaRoles();
  const media = collectMedia();
  const metaTags = collectMetaTags();
  const stats = collectStats(images, links, buttons, forms, headings, landmarks);

  const issues: Issue[] = [];

  const snapshot: A11ySnapshotData = {
    url: window.location.href,
    timestamp: new Date().toISOString(),
    lang: document.documentElement.getAttribute("lang"),
    title: document.title,
    headings,
    landmarks,
    images,
    forms,
    links,
    buttons,
    liveRegions,
    ariaRoles,
    media,
    metaTags,
    stats,
  };

  // Generate summary issues
  issues.push(
    createIssue("info", `Page: "${snapshot.title}" (${snapshot.url})`, {
      data: { lang: snapshot.lang, title: snapshot.title },
    }),
  );

  issues.push(
    createIssue("info", `${stats.totalElements} elements, ${stats.interactiveElements} interactive, ${stats.hiddenElements} hidden`, {
      data: stats as never,
    }),
  );

  issues.push(
    createIssue("info", `${headings.length} headings, ${landmarks.length} landmarks, ${images.length} images`, {
      data: { headings: headings.length, landmarks: landmarks.length, images: images.length },
    }),
  );

  issues.push(
    createIssue("info", `${links.length} links, ${buttons.length} buttons, ${forms.length} form controls`, {
      data: { links: links.length, buttons: buttons.length, forms: forms.length },
    }),
  );

  if (stats.imagesWithoutAlt > 0) {
    issues.push(
      createIssue("warning", `${stats.imagesWithoutAlt} image(s) missing alt attribute.`, {
        wcag: "1.1.1",
      }),
    );
  }

  if (!snapshot.lang) {
    issues.push(
      createIssue("warning", "No lang attribute on <html> element.", {
        wcag: "3.1.1",
      }),
    );
  }

  if (!snapshot.title) {
    issues.push(
      createIssue("warning", "Page has no <title>.", {
        wcag: "2.4.2",
      }),
    );
  }

  if (landmarks.length === 0) {
    issues.push(
      createIssue("warning", "No landmark regions found.", {
        wcag: "1.3.1",
      }),
    );
  }

  if (liveRegions.length > 0) {
    issues.push(
      createIssue("info", `${liveRegions.length} live region(s) detected.`, {
        wcag: "4.1.3",
      }),
    );
  }

  if (media.length > 0) {
    issues.push(
      createIssue("info", `${media.length} media element(s) detected.`, {
        data: { mediaCount: media.length },
      }),
    );
  }

  return { issues, data: snapshot };
}
