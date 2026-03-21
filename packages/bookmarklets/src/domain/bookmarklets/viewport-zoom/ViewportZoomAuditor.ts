import { truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { ViewportDirective, ViewportZoomData } from "./types.js";

const DIRECTIVE_PATTERN = /([\w-]+)\s*=\s*([^,\s]*)/g;

export function auditViewportZoom(): AuditOutput<ViewportZoomData> {
  const issues: Issue[] = [];

  const metaTag = document.querySelector('meta[name="viewport"]');
  const content = metaTag?.getAttribute("content") ?? null;

  const directives: ViewportDirective[] = [];
  let userScalable: string | null = null;
  let maximumScale: number | null = null;
  let minimumScale: number | null = null;
  let initialScale: number | null = null;
  let width: string | null = null;

  if (content) {
    for (const match of content.matchAll(DIRECTIVE_PATTERN)) {
      const key = match[1].toLowerCase();
      const value = match[2];
      directives.push({ key, value });

      switch (key) {
        case "user-scalable":
          userScalable = value;
          break;
        case "maximum-scale":
          maximumScale = Number.parseFloat(value);
          break;
        case "minimum-scale":
          minimumScale = Number.parseFloat(value);
          break;
        case "initial-scale":
          initialScale = Number.parseFloat(value);
          break;
        case "width":
          width = value;
          break;
      }
    }
  }

  const data: ViewportZoomData = {
    hasViewportMeta: !!metaTag,
    content,
    directives,
    userScalable,
    maximumScale,
    minimumScale,
    initialScale,
    width,
  };

  if (!metaTag) {
    issues.push(
      createIssue("info", 'No <meta name="viewport"> found. The browser allows zoom by default.', {
        wcag: "1.4.4",
        data: { hasViewportMeta: false },
      }),
    );
    return { issues, data };
  }

  const selector = uniqueSelector(metaTag);
  const html = truncatedHtml(metaTag);

  // user-scalable=no or user-scalable=0
  if (userScalable === "no" || userScalable === "0") {
    issues.push(
      createIssue(
        "error",
        `Zoom is disabled: user-scalable=${userScalable}. Users cannot resize text.`,
        {
          selector,
          html,
          wcag: "1.4.4",
          suggestion:
            "Remove user-scalable=no (or set to yes) to allow users to zoom to at least 200%.",
        },
      ),
    );
  } else if (userScalable === "yes" || userScalable === "1" || userScalable === null) {
    issues.push(
      createIssue("pass", "user-scalable is not restricted.", {
        selector,
        html,
        wcag: "1.4.4",
        data: { userScalable },
      }),
    );
  }

  // maximum-scale
  if (maximumScale !== null && !Number.isNaN(maximumScale)) {
    if (maximumScale < 2) {
      issues.push(
        createIssue(
          "error",
          `maximum-scale=${maximumScale} restricts zoom below 200%. WCAG requires at least 200% zoom.`,
          {
            selector,
            html,
            wcag: "1.4.4",
            suggestion:
              "Set maximum-scale to at least 2.0, or remove it entirely to allow unlimited zoom.",
          },
        ),
      );
    } else if (maximumScale < 5) {
      issues.push(
        createIssue(
          "warning",
          `maximum-scale=${maximumScale} limits zoom. Best practice is to not restrict zoom at all.`,
          {
            selector,
            html,
            wcag: "1.4.4",
            suggestion: "Consider removing maximum-scale to allow unlimited zoom.",
          },
        ),
      );
    } else {
      issues.push(
        createIssue("pass", `maximum-scale=${maximumScale} — zoom is not restricted.`, {
          selector,
          html,
          wcag: "1.4.4",
        }),
      );
    }
  }

  // minimum-scale = maximum-scale (locks zoom)
  if (minimumScale !== null && maximumScale !== null && minimumScale === maximumScale) {
    issues.push(
      createIssue(
        "error",
        `minimum-scale equals maximum-scale (${minimumScale}) — zoom is effectively locked.`,
        {
          selector,
          html,
          wcag: "1.4.4",
          suggestion: "Set different values for minimum-scale and maximum-scale, or remove both.",
        },
      ),
    );
  }

  // width=device-width (good practice)
  if (width === "device-width") {
    issues.push(
      createIssue("pass", "width=device-width — responsive viewport configured.", {
        selector,
        html,
        wcag: "1.4.10",
        data: { width },
      }),
    );
  } else if (width !== null) {
    const numWidth = Number.parseFloat(width);
    if (!Number.isNaN(numWidth)) {
      issues.push(
        createIssue(
          "warning",
          `Fixed viewport width: ${width}px. This may cause horizontal scrolling on narrow screens.`,
          {
            selector,
            html,
            wcag: "1.4.10",
            suggestion: "Use width=device-width for responsive reflow at 320px CSS width.",
          },
        ),
      );
    }
  }

  // Report all directives as info
  if (directives.length > 0) {
    issues.push(
      createIssue(
        "info",
        `Viewport directives: ${directives.map((d) => `${d.key}=${d.value}`).join(", ")}`,
        {
          selector,
          html,
          wcag: "1.4.4",
          data: { directives },
        },
      ),
    );
  }

  return { issues, data };
}
