import { useCallback, useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { minify } from "terser";
import { Check, Copy, Download } from "lucide-react";
import { DragBookmarklet } from "@/components/drag-bookmarklet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const DEFAULT_CODE = `(function () {
  // Clean up previous run
  document.getElementById("headings-panel")?.remove();
  document.querySelectorAll("[data-heading-badge]").forEach(b => b.remove());
  document.querySelectorAll("[data-heading-outline]").forEach(el => {
    el.style.outline = "";
    delete el.dataset.headingOutline;
  });

  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  const colors = {
    H1: "#e74c3c", H2: "#e67e22", H3: "#f1c40f",
    H4: "#2ecc71", H5: "#3498db", H6: "#9b59b6"
  };

  // Outline each heading and add a badge
  headings.forEach(h => {
    const tag = h.tagName;
    const color = colors[tag] || "#999";
    h.style.outline = "2px solid " + color;
    h.dataset.headingOutline = "true";

    const badge = document.createElement("span");
    badge.dataset.headingBadge = "true";
    badge.textContent = tag.toLowerCase();
    badge.style.cssText =
      "background:" + color + ";color:#fff;font:bold 11px/1 monospace;" +
      "padding:2px 6px;border-radius:3px;margin-right:6px;vertical-align:middle;";
    h.insertBefore(badge, h.firstChild);
  });

  // Build panel
  const panel = document.createElement("div");
  panel.id = "headings-panel";
  panel.style.cssText =
    "position:fixed;top:10px;right:10px;width:320px;max-height:80vh;" +
    "overflow:auto;background:#1e1e2e;color:#cdd6f4;font:13px/1.5 system-ui;" +
    "border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,.4);z-index:999999;padding:16px;";

  let html = "<h2 style='margin:0 0 12px;font-size:15px;'>Headings (" + headings.length + ")</h2><ul style='list-style:none;padding:0;margin:0;'>";
  headings.forEach(h => {
    const tag = h.tagName;
    const indent = (parseInt(tag[1]) - 1) * 16;
    const color = colors[tag] || "#999";
    const text = h.textContent.replace(tag.toLowerCase(), "").trim().slice(0, 60);
    html += "<li style='padding:4px 0 4px " + indent + "px;border-bottom:1px solid #313244;'>" +
      "<span style='background:" + color + ";color:#fff;font:bold 10px/1 monospace;padding:1px 5px;border-radius:3px;margin-right:8px;'>" + tag.toLowerCase() + "</span>" +
      (text || "<em style='opacity:.5;'>empty</em>") + "</li>";
  });
  html += "</ul>";

  // Clean-up button
  html += "<button id='headings-panel-close' style='margin-top:12px;width:100%;padding:8px;background:#f38ba8;color:#1e1e2e;border:none;border-radius:6px;font:bold 13px system-ui;cursor:pointer;'>Clean up</button>";

  panel.innerHTML = html;
  document.body.appendChild(panel);

  document.getElementById("headings-panel-close").addEventListener("click", function () {
    document.querySelectorAll("[data-heading-badge]").forEach(b => b.remove());
    document.querySelectorAll("[data-heading-outline]").forEach(el => {
      el.style.outline = "";
      delete el.dataset.headingOutline;
    });
    panel.remove();
  });
})();`;

function useBookmarkletUrl(code: string, shouldMinify: boolean) {
  const [bookmarkletUrl, setBookmarkletUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!code.trim()) {
      setBookmarkletUrl(null);
      setError(null);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setIsProcessing(true);
      setError(null);

      try {
        let finalCode = code;

        if (shouldMinify) {
          const result = await minify(code, {
            compress: true,
            mangle: true,
            toplevel: true,
          });
          if (!result.code) throw new Error("Minification produced no output");
          finalCode = result.code;
        }

        setBookmarkletUrl(`javascript:${encodeURIComponent(finalCode)}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process code");
        setBookmarkletUrl(null);
      } finally {
        setIsProcessing(false);
      }
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [code, shouldMinify]);

  return { bookmarkletUrl, error, isProcessing };
}

export function BuilderPage() {
  const [title, setTitle] = useState("My Bookmarklet");
  const [code, setCode] = useState(DEFAULT_CODE);
  const [shouldMinify, setShouldMinify] = useState(false);
  const [editorHeight, setEditorHeight] = useState(300);
  const [copied, setCopied] = useState(false);
  const { bookmarkletUrl, error, isProcessing } = useBookmarkletUrl(code, shouldMinify);

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

  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      const startY = e.clientY;
      const startHeight = editorHeight;
      const target = e.currentTarget;
      target.setPointerCapture(e.pointerId);

      const onMove = (ev: PointerEvent) => {
        setEditorHeight(Math.max(150, startHeight + ev.clientY - startY));
      };
      const onUp = () => {
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerup", onUp);
      };
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
    },
    [editorHeight],
  );

  const urlByteSize = bookmarkletUrl ? new Blob([bookmarkletUrl]).size : 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Hero */}
      <section aria-labelledby="builder-heading" className="mb-12">
        <h1 id="builder-heading" className="text-4xl font-bold tracking-tight mb-4">
          Bookmarklet Builder
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Create your own bookmarklet. Write JavaScript, optionally minify it, and drag the result
          to your bookmarks bar.
        </p>
      </section>

      <Separator className="mb-10" />

      {/* Title */}
      <section aria-labelledby="title-heading" className="mb-10">
        <h2 id="title-heading" className="text-xl font-semibold mb-4">
          Title
        </h2>
        <label htmlFor="bookmarklet-title" className="block text-sm text-muted-foreground mb-2">
          Name for your bookmarklet
        </label>
        <input
          id="bookmarklet-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Bookmarklet"
          className="w-full max-w-sm rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </section>

      <Separator className="mb-10" />

      {/* Code Editor */}
      <section aria-labelledby="code-heading" className="mb-10">
        <h2 id="code-heading" className="text-xl font-semibold mb-4">
          Code
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Write the JavaScript that your bookmarklet will execute.
        </p>
        <div className="rounded-lg border border-border overflow-hidden">
          <CodeMirror
            value={code}
            onChange={setCode}
            extensions={[javascript()]}
            height={`${editorHeight}px`}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              autocompletion: true,
              bracketMatching: true,
              closeBrackets: true,
              highlightActiveLine: true,
              indentOnInput: true,
            }}
            aria-label="Bookmarklet JavaScript code editor"
          />
          <div
            onPointerDown={handleResizePointerDown}
            role="separator"
            aria-orientation="horizontal"
            aria-valuenow={editorHeight}
            aria-valuemin={150}
            aria-label="Resize code editor"
            tabIndex={0}
            className="h-2 cursor-row-resize bg-muted hover:bg-muted-foreground/20 transition-colors flex items-center justify-center"
          >
            <div className="w-8 h-0.5 rounded-full bg-muted-foreground/40" />
          </div>
        </div>
      </section>

      <Separator className="mb-10" />

      {/* Options */}
      <section aria-labelledby="options-heading" className="mb-10">
        <h2 id="options-heading" className="text-xl font-semibold mb-4">
          Options
        </h2>
        <label className="inline-flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={shouldMinify}
            onChange={(e) => setShouldMinify(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          <span className="text-sm">
            Minify code{" "}
            <span className="text-muted-foreground">(compress &amp; mangle with Terser)</span>
          </span>
        </label>
      </section>

      <Separator className="mb-10" />

      {/* Output */}
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
    </div>
  );
}
