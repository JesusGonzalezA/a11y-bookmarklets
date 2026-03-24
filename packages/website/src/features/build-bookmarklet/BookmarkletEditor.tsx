import { useCallback, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Play, Save } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { browserCompletions } from "./browserCompletions";
import type { Snippet } from "./snippets";
import { SnippetsDropdown } from "./SnippetsDropdown";

interface BookmarkletEditorProps {
  code: string;
  onChange: (value: string) => void;
  height: number;
  onHeightChange: (height: number) => void;
  onRun?: () => void;
  onInsertSnippet?: (code: string) => void;
  onSaveSnippet?: () => void;
  customSnippets?: Snippet[];
  onDeleteSnippet?: (id: string) => void;
}

export function BookmarkletEditor({ code, onChange, height, onHeightChange, onRun, onInsertSnippet, onSaveSnippet, customSnippets, onDeleteSnippet }: BookmarkletEditorProps) {
  const extensions = useMemo(() => [javascript(), browserCompletions], []);

  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      const startY = e.clientY;
      const startHeight = height;
      const target = e.currentTarget;
      target.setPointerCapture(e.pointerId);

      const onMove = (ev: PointerEvent) => {
        onHeightChange(Math.max(150, startHeight + ev.clientY - startY));
      };
      const onUp = () => {
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerup", onUp);
      };
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
    },
    [height, onHeightChange],
  );

  return (
    <div className="rounded-t-lg border border-border overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border-b border-border">
        <SnippetsDropdown
          onInsert={onInsertSnippet ?? (() => {})}
          customSnippets={customSnippets}
          onDeleteSnippet={onDeleteSnippet}
        />
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onSaveSnippet}
          disabled={!onSaveSnippet || !code.trim()}
          aria-label="Save as snippet"
          title="Save as Snippet"
        >
          <Save />
          Save as Snippet
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRun}
          disabled={!onRun}
          aria-label="Run bookmarklet code"
          title="Run code"
        >
          <Play />
          Run
        </Button>
      </div>
      <CodeMirror
        value={code}
        onChange={onChange}
        extensions={extensions}
        height={`${height}px`}
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
        aria-valuenow={height}
        aria-valuemin={150}
        aria-label="Resize code editor"
        tabIndex={0}
        className="h-2 cursor-row-resize bg-muted hover:bg-muted-foreground/20 transition-colors flex items-center justify-center"
      >
        <div className="w-8 h-0.5 rounded-full bg-muted-foreground/40" />
      </div>
    </div>
  );
}
