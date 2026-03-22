import { CodeBlock } from "@/shared/ui/code-block";

const mcpConfig = `{
  "a11y-bookmarklets": {
    "command": "node",
    "args": ["packages/mcp-server/dist/index.js"]
  }
}`;

export function McpSection() {
  return (
    <section aria-labelledby="agents-heading" className="mb-16">
      <h2 id="agents-heading" className="text-2xl font-semibold tracking-tight mb-6">
        For AI agents
      </h2>
      <p className="text-muted-foreground mb-6">
        Every bookmarklet works in two modes: <strong className="text-foreground">visual</strong>{" "}
        (overlays for humans) and <strong className="text-foreground">data</strong> (structured
        JSON for agents). Results are stored in{" "}
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
          window.__a11y.&lt;id&gt;.lastResult
        </code>{" "}
        after each run.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-medium">MCP Server</h3>
          <p className="text-sm text-muted-foreground">
            Use the MCP server to list bookmarklets, get injectable audit scripts, and interpret
            results — all from your AI coding agent.
          </p>
          <CodeBlock code={mcpConfig} label="MCP server configuration" />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Agent Skill</h3>
          <p className="text-sm text-muted-foreground">
            The skill teaches agents <em>how</em> to use each bookmarklet effectively: what to
            check, how to interpret results, and when to flag issues.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            See{" "}
            <a
              href="https://github.com/user/a11y-bookmarklets/tree/main/skill"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
              rel="noopener noreferrer"
            >
              skill/SKILL.md
            </a>{" "}
            for the full skill definition.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <h3 className="text-lg font-medium">How it works</h3>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>
            The agent calls{" "}
            <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">
              get_audit_script
            </code>{" "}
            from the MCP server with a bookmarklet ID.
          </li>
          <li>
            It receives a JavaScript function to run via{" "}
            <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">
              browser_evaluate()
            </code>{" "}
            (Playwright).
          </li>
          <li>
            The bookmarklet executes, audits the page, and stores results in{" "}
            <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">window.__a11y</code>.
          </li>
          <li>
            The agent reads the structured JSON — issues, severity, WCAG references, and fix
            suggestions.
          </li>
        </ol>
      </div>
    </section>
  );
}
