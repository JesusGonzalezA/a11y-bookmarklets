import { useCallback, useState } from "react";
import { BookmarkletEditor } from "@/features/build-bookmarklet/BookmarkletEditor";
import { BuildOutput } from "@/features/build-bookmarklet/BuildOutput";
import { MiniConsole, type ConsoleEntry } from "@/features/build-bookmarklet/MiniConsole";
import { useBookmarkletBuilder } from "@/features/build-bookmarklet/useBookmarkletBuilder";
import { DEFAULT_CODE } from "@/features/build-bookmarklet/constants";
import { Separator } from "@/shared/ui/separator";

export function BuilderPage() {
  const [title, setTitle] = useState("My Bookmarklet");
  const [code, setCode] = useState(DEFAULT_CODE);
  const [shouldMinify, setShouldMinify] = useState(false);
  const [editorHeight, setEditorHeight] = useState(300);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const { bookmarkletUrl, error, isProcessing } = useBookmarkletBuilder(code, shouldMinify);

  const handleRun = useCallback(() => {
    const newEntries: ConsoleEntry[] = [];
    let nextId = Date.now();

    const serialize = (...args: unknown[]) =>
      args
        .map((a) => {
          if (typeof a === "string") return a;
          try { return JSON.stringify(a, null, 2); } catch { return String(a); }
        })
        .join(" ");

    const origLog = console.log;
    const origInfo = console.info;
    const origWarn = console.warn;
    const origError = console.error;

    console.log = (...args) => { newEntries.push({ id: nextId++, type: "log", text: serialize(...args) }); origLog(...args); };
    console.info = (...args) => { newEntries.push({ id: nextId++, type: "info", text: serialize(...args) }); origInfo(...args); };
    console.warn = (...args) => { newEntries.push({ id: nextId++, type: "warn", text: serialize(...args) }); origWarn(...args); };
    console.error = (...args) => { newEntries.push({ id: nextId++, type: "error", text: serialize(...args) }); origError(...args); };

    try {
      // biome-ignore lint/security/noGlobalEval: intentional bookmarklet execution
      (0, eval)(code);
    } catch (e) {
      newEntries.push({ id: nextId++, type: "error", text: String(e) });
    } finally {
      console.log = origLog;
      console.info = origInfo;
      console.warn = origWarn;
      console.error = origError;
    }

    setConsoleLogs((prev) => [...prev, ...newEntries]);
  }, [code]);

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
        <BookmarkletEditor
          code={code}
          onChange={setCode}
          height={editorHeight}
          onHeightChange={setEditorHeight}
          onRun={handleRun}
        />
        <MiniConsole entries={consoleLogs} onClear={() => setConsoleLogs([])} />
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

      <BuildOutput
        bookmarkletUrl={bookmarkletUrl}
        title={title}
        code={code}
        error={error}
        isProcessing={isProcessing}
      />
    </div>
  );
}
