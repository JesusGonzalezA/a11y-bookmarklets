import { BookmarkletCard } from "@/components/bookmarklet-card";
import { CodeBlock } from "@/components/code-block";
import { Separator } from "@/components/ui/separator";
import { bookmarklets } from "@/data/bookmarklets";
import { useManifest } from "@/hooks/use-manifest";

const mcpConfig = `{
  "a11y-bookmarklets": {
    "command": "node",
    "args": ["packages/mcp-server/dist/index.js"]
  }
}`;

export function HomePage() {
  const manifest = useManifest();

  const getBookmarkletUrl = (id: string) =>
    manifest?.find((b: { id: string }) => b.id === id)?.bookmarkletUrl;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Hero */}
      <section aria-labelledby="hero-heading" className="text-center mb-16">
        <h1 id="hero-heading" className="text-4xl font-bold tracking-tight mb-4">
          A11y Bookmarklets
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Accessibility audits for humans &amp; AI agents. Visual overlays you can see. Structured
          data machines can read.
        </p>
      </section>

      <Separator className="mb-12" />

      {/* How to install */}
      <section aria-labelledby="install-heading" className="mb-16">
        <h2 id="install-heading" className="text-2xl font-semibold tracking-tight mb-6">
          How to install
        </h2>
        <ol className="space-y-4 list-none">
          {[
            {
              key: "show-bar",
              text: (
                <>
                  Make sure your browser&apos;s <strong>bookmarks bar</strong> is visible.
                </>
              ),
            },
            {
              key: "drag",
              text: (
                <>
                  <strong>Drag</strong> any bookmarklet button below into your bookmarks bar.
                </>
              ),
            },
            {
              key: "click",
              text: (
                <>
                  Navigate to any webpage and <strong>click the bookmarklet</strong> to run the
                  audit.
                </>
              ),
            },
          ].map((step, i) => (
            <li key={step.key} className="flex gap-4 items-start">
              <span
                className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="pt-1">{step.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <Separator className="mb-12" />

      {/* Bookmarklets */}
      <section aria-labelledby="bookmarklets-heading" className="mb-16">
        <h2 id="bookmarklets-heading" className="text-2xl font-semibold tracking-tight mb-6">
          Bookmarklets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bookmarklets.map((b) => (
            <BookmarkletCard key={b.id} bookmarklet={b} bookmarkletUrl={getBookmarkletUrl(b.id)} />
          ))}
        </div>
      </section>

      <Separator className="mb-12" />

      {/* For AI agents */}
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
    </div>
  );
}
