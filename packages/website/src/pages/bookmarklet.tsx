import { Link, useParams } from "react-router";
import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { bookmarklets } from "@/data/bookmarklets";
import { useManifest } from "@/hooks/use-manifest";
import { cn } from "@/lib/utils";

export function BookmarkletPage() {
  const { bookmarkletId } = useParams();
  const manifest = useManifest();
  const bookmarklet = bookmarklets.find((b) => b.id === bookmarkletId);

  if (!bookmarklet) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Bookmarklet not found</h1>
        <p className="text-muted-foreground mb-6">
          The bookmarklet &quot;{bookmarkletId}&quot; does not exist.
        </p>
        <Link to="/" className={cn(buttonVariants())}>
          Back to home
        </Link>
      </div>
    );
  }

  const entry = manifest?.bookmarklets?.find((b: { id: string }) => b.id === bookmarklet.id);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground font-medium">
            {bookmarklet.name}
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-3">{bookmarklet.name}</h1>
        <p className="text-lg text-muted-foreground">{bookmarklet.description}</p>
        <ul className="flex flex-wrap gap-1.5 mt-4 list-none p-0" aria-label="WCAG criteria">
          {bookmarklet.wcag.map((criterion) => (
            <li key={criterion}>
              <Badge variant="secondary">WCAG {criterion}</Badge>
            </li>
          ))}
        </ul>
      </header>

      <Separator className="mb-8" />

      {/* Install */}
      <section aria-labelledby="detail-install" className="mb-10">
        <h2 id="detail-install" className="text-xl font-semibold mb-4">
          Install
        </h2>
        {entry ? (
          <div className="flex gap-3 flex-wrap">
            <a
              href={entry.bookmarkletUrl}
              className={cn(buttonVariants({ variant: "outline" }))}
              onClick={(e) => e.preventDefault()}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/uri-list", entry.bookmarkletUrl);
                e.dataTransfer.setData("text/plain", entry.bookmarkletUrl);
              }}
              aria-label={`Drag ${bookmarklet.name} bookmarklet to your bookmarks bar`}
            >
              Drag to bookmarks bar
            </a>
            <Button
              variant="secondary"
              onClick={() => navigator.clipboard.writeText(entry.bookmarkletUrl)}
              aria-label={`Copy ${bookmarklet.name} bookmarklet URL`}
            >
              Copy bookmarklet URL
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Bookmarklet not built yet. Run{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">
              npm run build:bookmarklets
            </code>{" "}
            first.
          </p>
        )}
      </section>

      <Separator className="mb-8" />

      {/* About */}
      <section aria-labelledby="detail-about" className="mb-10">
        <h2 id="detail-about" className="text-xl font-semibold mb-4">
          About
        </h2>
        <p className="text-muted-foreground">{bookmarklet.details}</p>
      </section>

      <Separator className="mb-8" />

      {/* What it checks */}
      <section aria-labelledby="detail-checks" className="mb-10">
        <h2 id="detail-checks" className="text-xl font-semibold mb-4">
          What it checks
        </h2>
        <ul className="space-y-2">
          {bookmarklet.checks.map((check) => (
            <li key={check} className="flex gap-3 items-start text-muted-foreground">
              <span
                aria-hidden="true"
                className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"
              />
              {check}
            </li>
          ))}
        </ul>
      </section>

      <Separator className="mb-8" />

      {/* Data returned */}
      <section aria-labelledby="detail-data" className="mb-10">
        <h2 id="detail-data" className="text-xl font-semibold mb-4">
          Data returned
        </h2>
        <p className="text-muted-foreground mb-4">{bookmarklet.dataReturned}</p>
        <CodeBlock
          code={`// After running the bookmarklet:\nconst result = window.__a11y.${bookmarklet.id.replace("-", "_")}.lastResult;\nconsole.log(result.issues);  // Array of issues\nconsole.log(result.summary); // { errors, warnings, info, passes }`}
          label={`Example code for reading ${bookmarklet.name} results`}
        />
      </section>

      <div className="pt-4">
        <Link to="/" className={cn(buttonVariants({ variant: "ghost" }))}>
          ← Back to all bookmarklets
        </Link>
      </div>
    </div>
  );
}
