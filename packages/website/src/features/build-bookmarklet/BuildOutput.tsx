import { useCallback, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { DragBookmarklet } from "@/entities/bookmarklet/ui/DragBookmarklet";
import { Button } from "@/shared/ui/button";

interface BuildOutputProps {
  bookmarkletUrl: string | null;
  title: string;
  code: string;
  error: string | null;
  isProcessing: boolean;
}

export function BuildOutput({ bookmarkletUrl, title, code, error, isProcessing }: BuildOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (bookmarkletUrl) {
      await navigator.clipboard.writeText(bookmarkletUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [bookmarkletUrl]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = (title || "bookmarklet").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    a.download = `${filename}.js`;
    a.click();
    URL.revokeObjectURL(url);
  }, [code, title]);

  const urlByteSize = bookmarkletUrl ? new Blob([bookmarkletUrl]).size : 0;

  return (
    <section aria-labelledby="output-heading" className="mb-10">
      <h2 id="output-heading" className="text-xl font-semibold mb-4">
        Your Bookmarklet
      </h2>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <p className="font-semibold">Error processing code</p>
          <p className="mt-1 font-mono text-xs">{error}</p>
        </div>
      )}

      {isProcessing && (
        <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
          Processing…
        </p>
      )}

      {bookmarkletUrl && !error ? (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap items-center">
            <DragBookmarklet bookmarkletUrl={bookmarkletUrl} name={title || "Bookmarklet"} />
            <Button
              variant="secondary"
              onClick={handleCopy}
              aria-label={copied ? "Copied!" : "Copy bookmarklet URL"}
              aria-live="polite"
            >
              {copied ? (
                <Check aria-hidden="true" />
              ) : (
                <Copy aria-hidden="true" />
              )}
              {copied ? "Copied!" : "Copy URL"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleDownload}
              aria-label={`Download bookmarklet as ${title ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "bookmarklet"}.js`}
            >
              <Download aria-hidden="true" />
              Download .js
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Drag the button above to your bookmarks bar, or click it to run on this page.
            <span className="ml-2 font-mono text-xs">
              ({urlByteSize.toLocaleString()} bytes)
            </span>
          </p>
        </div>
      ) : (
        !error &&
        !isProcessing && (
          <p className="text-sm text-muted-foreground">
            Write some code above to generate your bookmarklet.
          </p>
        )
      )}
    </section>
  );
}
