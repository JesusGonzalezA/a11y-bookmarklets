import { useCallback, useEffect, useState } from "react";
import { BookmarkletEditor } from "@/features/build-bookmarklet/BookmarkletEditor";
import { BuildOutput } from "@/features/build-bookmarklet/BuildOutput";
import { MiniConsole, type ConsoleEntry } from "@/features/build-bookmarklet/MiniConsole";
import { useBookmarkletBuilder } from "@/features/build-bookmarklet/useBookmarkletBuilder";
import { useCustomSnippets } from "@/features/build-bookmarklet/useCustomSnippets";
import { DEFAULT_CODE } from "@/features/build-bookmarklet/constants";
import { Separator } from "@/shared/ui/separator";

export function BuilderPage() {
  const [title, setTitle] = useState("My Bookmarklet");
  const [code, setCode] = useState(() => localStorage.getItem("builder:code") ?? DEFAULT_CODE);

  useEffect(() => {
    localStorage.setItem("builder:code", code);
  }, [code]);
  const [shouldMinify, setShouldMinify] = useState(false);
  const [editorHeight, setEditorHeight] = useState(300);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const { bookmarkletUrl, error, isProcessing } = useBookmarkletBuilder(code, shouldMinify);
  const { customSnippets, saveSnippet, removeSnippet } = useCustomSnippets();

  const handleSaveSnippet = useCallback(() => {
    const name = prompt("Snippet name:");
    if (name?.trim()) saveSnippet(name.trim(), code);
  }, [code, saveSnippet]);

  const handleInsertSnippet = useCallback((snippetCode: string) => {
    setCode((prev) => `${prev.trimEnd()}\n\n${snippetCode}`);
  }, []);

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
          onInsertSnippet={handleInsertSnippet}
          onSaveSnippet={handleSaveSnippet}
          customSnippets={customSnippets}
          onDeleteSnippet={removeSnippet}
        />
        <MiniConsole entries={consoleLogs} onClear={() => setConsoleLogs([])} />
      </section>

      <Separator className="mb-10" />

      <BuildOutput
        bookmarkletUrl={bookmarkletUrl}
        title={title}
        onTitleChange={setTitle}
        code={code}
        error={error}
        isProcessing={isProcessing}
        shouldMinify={shouldMinify}
        onMinifyChange={setShouldMinify}
      />
    </div>
  );
}
