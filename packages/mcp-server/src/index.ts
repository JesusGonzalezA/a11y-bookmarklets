#!/usr/bin/env node

/**
 * MCP Server for a11y bookmarklets.
 *
 * This server exposes tools that return the JavaScript code needed to run
 * accessibility audits in a browser. It is designed to work alongside
 * the Playwright MCP server — the agent uses Playwright to navigate and
 * execute JS, and this server provides the audit logic + interprets results.
 *
 * Tools:
 *   - list_bookmarklets:  List available bookmarklets and what they check
 *   - get_bookmarklet_code: Get the JS code for a specific bookmarklet
 *   - interpret_results:  Provide WCAG-based analysis of audit results
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readBookmarkletCode } from "@bookmarklets-a11y/build-tools";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { BOOKMARKLET_REGISTRY } from "./registry.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Resolve the shared dist/bookmarklets/ directory where all .min.js files live. */
function bookmarkletDistDir(): string {
  // In workspace dev: mcp-server/src/../../../dist/bookmarklets
  // (from packages/mcp-server/dist → ../../.. → repo root → dist/bookmarklets)
  return resolve(__dirname, "..", "..", "..", "dist", "bookmarklets");
}

const server = new Server(
  {
    name: "a11y-bookmarklets",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_bookmarklets",
      description:
        "List all available accessibility bookmarklets. Returns their IDs, descriptions, and which WCAG criteria they check.",
      inputSchema: {
        type: "object" as const,
        properties: {},
      },
    },
    {
      name: "get_audit_script",
      description: `Get the JavaScript code to run an accessibility audit in the browser.

USAGE: After getting the script, use Playwright MCP's browser_evaluate tool to execute it.
The script will:
1. Visually annotate the page (overlays visible in screenshots)
2. Return a JSON object with structured audit results

Example workflow:
1. Call get_audit_script with bookmarklet="headings"
2. Use browser_evaluate with the returned script
3. Take a screenshot to see visual annotations
4. Analyze the JSON results`,
      inputSchema: {
        type: "object" as const,
        properties: {
          bookmarklet: {
            type: "string",
            description: 'The bookmarklet ID to run (e.g. "headings", "landmarks", "tab-order", "images")',
            enum: BOOKMARKLET_REGISTRY.map((b) => b.id),
          },
        },
        required: ["bookmarklet"],
      },
    },
    {
      name: "interpret_results",
      description:
        "Analyze audit results and provide WCAG-based accessibility findings with severity, impact, and remediation guidance.",
      inputSchema: {
        type: "object" as const,
        properties: {
          results: {
            type: "object",
            description: "The AuditResult JSON returned by a bookmarklet execution.",
          },
        },
        required: ["results"],
      },
    },
  ],
}));

// ---------------------------------------------------------------------------
// Tool handlers
// ---------------------------------------------------------------------------

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "list_bookmarklets": {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                bookmarklets: BOOKMARKLET_REGISTRY,
                usage:
                  "Use get_audit_script to get the JS code, then execute it in the browser with Playwright's browser_evaluate tool.",
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    case "get_audit_script": {
      const bookmarkletId = (args as any).bookmarklet as string;
      const entry = BOOKMARKLET_REGISTRY.find((b) => b.id === bookmarkletId);

      if (!entry) {
        return {
          content: [
            {
              type: "text",
              text: `Unknown bookmarklet: "${bookmarkletId}". Use list_bookmarklets to see available options.`,
            },
          ],
          isError: true,
        };
      }

      // For now, return a self-contained script that the agent can execute
      // via browser_evaluate. In production, this would read from compiled dist/.
      const script = generateAuditScript(bookmarkletId);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                bookmarklet: entry,
                instruction: `Pass the 'script' value directly as the 'function' parameter to Playwright MCP's browser_evaluate tool. It is a function expression (not an IIFE) that runs the audit, annotates the page visually, and returns the AuditResult JSON. If the result comes back as null or undefined, call browser_evaluate again with: () => window.__a11y?.['${bookmarkletId}']?.lastResult`,
                script,
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    case "interpret_results": {
      const results = (args as any).results;
      const interpretation = interpretAuditResults(results);

      return {
        content: [
          {
            type: "text",
            text: interpretation,
          },
        ],
      };
    }

    default:
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true,
      };
  }
});

// ---------------------------------------------------------------------------
// Script generation (returns JS to be executed via browser_evaluate)
// ---------------------------------------------------------------------------

function generateAuditScript(bookmarkletId: string): string {
  // Try to read the compiled .min.js so we can inline it.
  // This avoids CSP issues — browser_evaluate runs via CDP, so inline code
  // is NOT subject to the page's Content-Security-Policy.
  //
  // The returned string is a FUNCTION EXPRESSION (not an IIFE call).
  // Pass it directly as the `function` parameter to Playwright MCP's
  // browser_evaluate. Example:
  //   browser_evaluate({ function: "<returned string>" })
    const code = readBookmarkletCode(bookmarkletDistDir(), bookmarkletId);
    return `() => {
  // If already loaded, re-run and return results
  if (window.__a11y && window.__a11y['${bookmarkletId}']) {
    return window.__a11y['${bookmarkletId}'].audit();
  }
  // Inline the compiled bookmarklet — CSP-safe (runs via CDP, not script injection)
  ${code}
  // Return the result that the bookmarklet stored on window.__a11y
  return window.__a11y?.['${bookmarkletId}']?.lastResult ?? null;
}`.trim();
}

// ---------------------------------------------------------------------------
// Results interpretation
// ---------------------------------------------------------------------------

function interpretAuditResults(results: any): string {
  if (!results || !results.bookmarklet) {
    return "Invalid audit results. Expected an AuditResult object with bookmarklet, issues, and summary fields.";
  }

  const { bookmarklet, url, summary, issues } = results;
  const errors = issues?.filter((i: any) => i.severity === "error") ?? [];
  const warnings = issues?.filter((i: any) => i.severity === "warning") ?? [];

  let output = `## Accessibility Audit: ${bookmarklet}\n`;
  output += `**URL:** ${url}\n`;
  output += `**Summary:** ${summary?.errors ?? 0} errors, ${summary?.warnings ?? 0} warnings, ${summary?.passes ?? 0} passes\n\n`;

  if (errors.length > 0) {
    output += `### ❌ Errors (must fix)\n`;
    for (const e of errors) {
      output += `- **${e.message}**\n`;
      if (e.wcag) output += `  WCAG: ${e.wcag}\n`;
      if (e.suggestion) output += `  Fix: ${e.suggestion}\n`;
      if (e.selector && e.selector !== "html") output += `  Element: \`${e.selector}\`\n`;
    }
    output += "\n";
  }

  if (warnings.length > 0) {
    output += `### ⚠️ Warnings (should fix)\n`;
    for (const w of warnings) {
      output += `- **${w.message}**\n`;
      if (w.wcag) output += `  WCAG: ${w.wcag}\n`;
      if (w.suggestion) output += `  Fix: ${w.suggestion}\n`;
    }
  }

  return output;
}

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("a11y-bookmarklets MCP server running on stdio");
}

main().catch(console.error);
