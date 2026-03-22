import { CodeBlock } from "@/shared/ui/code-block";
import type { BookmarkletInfo } from "@/entities/bookmarklet/model/types";

interface BookmarkletAboutProps {
  bookmarklet: BookmarkletInfo;
}

export function BookmarkletAbout({ bookmarklet }: BookmarkletAboutProps) {
  return (
    <>
      {/* About */}
      <section aria-labelledby="detail-about" className="mb-10">
        <h2 id="detail-about" className="text-xl font-semibold mb-4">
          About
        </h2>
        <p className="text-muted-foreground">{bookmarklet.details}</p>
      </section>

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
    </>
  );
}
