import { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Play } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface BookmarkletEditorProps {
  code: string;
  onChange: (value: string) => void;
  height: number;
  onHeightChange: (height: number) => void;
  onRun?: () => void;
}

export function BookmarkletEditor({ code, onChange, height, onHeightChange, onRun }: BookmarkletEditorProps) {
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
      <div className="flex items-center justify-end gap-2 px-3 py-1.5 bg-muted/50 border-b border-border">
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
        extensions={[javascript()]}
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
