import { queryAll, truncatedHtml, uniqueSelector } from "../../../infrastructure/dom/DomUtils.js";
import type { AuditOutput, Issue } from "../../types.js";
import { createIssue, noElementsIssue } from "../shared/issue-helpers.js";
import type { AutocompleteData } from "./types.js";

const FIELD_HEURISTICS: [RegExp, string][] = [
  [/first.?name|given.?name|nombre/i, "given-name"],
  [/last.?name|family.?name|apellido/i, "family-name"],
  [/full.?name|nombre.?completo/i, "name"],
  [/user.?name|usuario/i, "username"],
  [/e.?mail|correo/i, "email"],
  [/phone|tel|teléfono|telefono/i, "tel"],
  [/address|dirección|direccion|calle/i, "street-address"],
  [/zip|postal|código.?postal|codigo.?postal/i, "postal-code"],
  [/city|ciudad/i, "address-level2"],
  [/state|provincia|estado/i, "address-level1"],
  [/country|país|pais/i, "country-name"],
  [/cc.?num|card.?num|tarjeta/i, "cc-number"],
  [/cc.?name|card.?name|titular/i, "cc-name"],
  [/cc.?exp|expir/i, "cc-exp"],
  [/cvc|cvv|csc|security.?code/i, "cc-csc"],
  [/new.?password|nueva.?contra/i, "new-password"],
  [/password|contraseña|contrasena/i, "current-password"],
  [/organization|empresa|company|organización/i, "organization"],
  [/birthday|birth.?date|nacimiento|fecha.?nac/i, "bday"],
];

const VALID_AUTOCOMPLETE_TOKENS = new Set([
  "off",
  "on",
  "name",
  "honorific-prefix",
  "given-name",
  "additional-name",
  "family-name",
  "honorific-suffix",
  "nickname",
  "email",
  "username",
  "new-password",
  "current-password",
  "one-time-code",
  "organization-title",
  "organization",
  "street-address",
  "address-line1",
  "address-line2",
  "address-line3",
  "address-level4",
  "address-level3",
  "address-level2",
  "address-level1",
  "country",
  "country-name",
  "postal-code",
  "cc-name",
  "cc-given-name",
  "cc-additional-name",
  "cc-family-name",
  "cc-number",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-csc",
  "cc-type",
  "transaction-currency",
  "transaction-amount",
  "language",
  "bday",
  "bday-day",
  "bday-month",
  "bday-year",
  "sex",
  "tel",
  "tel-country-code",
  "tel-national",
  "tel-area-code",
  "tel-local",
  "tel-extension",
  "impp",
  "url",
  "photo",
]);

function getFieldIdentifier(el: Element): string {
  return [el.getAttribute("name"), el.getAttribute("id"), el.getAttribute("placeholder")]
    .filter(Boolean)
    .join(" ");
}

function getLabelText(el: Element): string {
  const id = el.getAttribute("id");
  if (id) {
    const label = document.querySelector(`label[for="${CSS.escape(id)}"]`);
    if (label?.textContent?.trim()) return label.textContent.trim();
  }
  const wrapping = el.closest("label");
  return wrapping?.textContent?.trim() ?? "";
}

function detectExpectedAutocomplete(el: Element): string | null {
  const combined = `${getFieldIdentifier(el)} ${getLabelText(el)}`;
  for (const [pattern, token] of FIELD_HEURISTICS) {
    if (pattern.test(combined)) return token;
  }
  // Also check input type
  const type = el.getAttribute("type") ?? "";
  if (type === "email") return "email";
  if (type === "tel") return "tel";
  if (type === "url") return "url";
  return null;
}

export function auditAutocomplete(): AuditOutput<AutocompleteData[]> {
  const controls = queryAll(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="image"]), select, textarea',
  );
  const issues: Issue[] = [];
  const data: AutocompleteData[] = [];

  for (const el of controls) {
    const selector = uniqueSelector(el);
    const tagName = el.tagName.toLowerCase();
    const type = el.getAttribute("type") ?? tagName;
    const autocomplete = el.getAttribute("autocomplete");
    const expected = detectExpectedAutocomplete(el);
    const fieldName = getFieldIdentifier(el);

    data.push({ selector, tagName, type, autocomplete, expectedAutocomplete: expected, fieldName });

    if (expected && !autocomplete) {
      issues.push(
        createIssue(
          "warning",
          `Field "${fieldName || type}" may need autocomplete="${expected}".`,
          {
            selector,
            html: truncatedHtml(el),
            wcag: "1.3.5",
            suggestion: `Add autocomplete="${expected}" to help user agents fill in personal data.`,
            data: { type, expected, fieldName },
          },
        ),
      );
    } else if (autocomplete && autocomplete !== "off" && autocomplete !== "on") {
      // Validate the token
      const tokens = autocomplete.trim().split(/\s+/);
      const lastToken = tokens[tokens.length - 1];
      if (!VALID_AUTOCOMPLETE_TOKENS.has(lastToken)) {
        issues.push(
          createIssue("warning", `Invalid autocomplete token: "${autocomplete}".`, {
            selector,
            html: truncatedHtml(el),
            wcag: "1.3.5",
            suggestion: `Use a valid HTML autocomplete token. See WHATWG autofill field names.`,
            data: { autocomplete },
          }),
        );
      } else {
        issues.push(
          createIssue("pass", `Field has autocomplete="${autocomplete}".`, {
            selector,
            html: truncatedHtml(el),
            wcag: "1.3.5",
            data: { autocomplete },
          }),
        );
      }
    } else if (!expected) {
      issues.push(
        createIssue("info", `Field "${fieldName || type}" — no autocomplete expected.`, {
          selector,
          html: truncatedHtml(el),
          wcag: "1.3.5",
          data: { type, fieldName },
        }),
      );
    }
  }

  if (controls.length === 0) {
    issues.push(noElementsIssue("info", "text input controls", "1.3.5"));
  }

  return { issues, data };
}
