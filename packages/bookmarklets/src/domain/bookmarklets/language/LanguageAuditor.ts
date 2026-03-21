import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { createIssue } from "../shared/issue-helpers.js";
import type { LangElement, LanguageData } from "./types.js";

const BCP47_PATTERN = /^[a-z]{2,3}(-[A-Z][a-z]{3})?(-([A-Z]{2}|[0-9]{3}))?$/;

function isValidBcp47(lang: string): boolean {
  return BCP47_PATTERN.test(lang);
}

export function auditLanguage(): AuditOutput<LanguageData> {
  const issues: Issue[] = [];
  const htmlLang = document.documentElement.lang || null;
  const isValid = htmlLang !== null && isValidBcp47(htmlLang);

  const elementsWithLang: LangElement[] = [];

  // Check html lang attribute
  if (!htmlLang) {
    issues.push(
      createIssue("error", "Missing lang attribute on <html> element.", {
        selector: "html",
        html: "<html>",
        wcag: "3.1.1",
        suggestion: 'Add a lang attribute to the <html> element, e.g. <html lang="en">.',
      }),
    );
  } else if (!htmlLang.trim()) {
    issues.push(
      createIssue("error", "The <html> lang attribute is empty.", {
        selector: "html",
        html: truncatedHtml(document.documentElement),
        wcag: "3.1.1",
        suggestion: 'Set a valid BCP 47 language code, e.g. lang="en" or lang="es".',
      }),
    );
  } else if (!isValid) {
    issues.push(
      createIssue("error", `Invalid BCP 47 language code: "${htmlLang}".`, {
        selector: "html",
        html: truncatedHtml(document.documentElement),
        wcag: "3.1.1",
        suggestion: 'Use a valid BCP 47 code like "en", "es", "fr", "de", "pt-BR", "zh-Hans".',
        data: { htmlLang },
      }),
    );
  } else {
    issues.push(
      createIssue("pass", `Page language is set to "${htmlLang}".`, {
        selector: "html",
        html: truncatedHtml(document.documentElement),
        wcag: "3.1.1",
        data: { htmlLang },
      }),
    );
  }

  // Check elements with lang attribute (language of parts)
  const langElements = queryAll("[lang]").filter((el) => el !== document.documentElement);

  for (const el of langElements) {
    const lang = el.getAttribute("lang") ?? "";
    const selector = uniqueSelector(el);
    const text = el.textContent?.trim().slice(0, 60) ?? "";
    const valid = isValidBcp47(lang);

    elementsWithLang.push({ selector, lang, isValid: valid, text });

    if (!lang.trim()) {
      issues.push(
        createIssue("error", "Empty lang attribute on element.", {
          selector,
          html: truncatedHtml(el),
          wcag: "3.1.2",
          suggestion: "Set a valid BCP 47 language code or remove the lang attribute.",
        }),
      );
    } else if (!valid) {
      issues.push(
        createIssue("warning", `Invalid BCP 47 language code: "${lang}" on element.`, {
          selector,
          html: truncatedHtml(el),
          wcag: "3.1.2",
          suggestion: `Use a valid BCP 47 code like "en", "es", "fr".`,
          data: { lang },
        }),
      );
    } else {
      issues.push(
        createIssue("info", `Element has lang="${lang}": "${text || "(empty text)"}"`, {
          selector,
          html: truncatedHtml(el),
          wcag: "3.1.2",
          data: { lang, text },
        }),
      );
    }
  }

  if (langElements.length === 0 && htmlLang) {
    issues.push(
      createIssue("info", "No elements with lang attribute found (single-language page).", {
        wcag: "3.1.2",
      }),
    );
  }

  return {
    issues,
    data: { htmlLang, isValidBcp47: isValid, elementsWithLang },
  };
}
