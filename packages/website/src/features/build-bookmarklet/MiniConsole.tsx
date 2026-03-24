import { useRef, useState } from "react";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export type ConsoleEntry = {
  id: number;
  type: "log" | "info" | "warn" | "error";
  text: string;
};

interface MiniConsoleProps {
  entries: ConsoleEntry[];
  onClear: () => void;
}

export function MiniConsole({ entries, onClear }: MiniConsoleProps) {
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const errorCount = entries.filter((e) => e.type === "error").length;
  const warnCount = entries.filter((e) => e.type === "warn").length;
  const logCount = entries.filter((e) => e.type === "log" || e.type === "info").length;

  return (
    <div className="rounded-b-lg border-x border-b border-border overflow-hidden font-mono text-xs">
      <div className="flex items-center gap-1 px-3 py-2 bg-muted/50">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 flex-1 text-left text-xs font-medium text-foreground hover:text-foreground/80 transition-colors"
          aria-expanded={open}
          aria-controls="mini-console-body"
        >
          {open ? <ChevronDown className="size-3.5 shrink-0" /> : <ChevronRight className="size-3.5 shrink-0" />}
          Console
          {logCount > 0 && (
            <span className="ml-1 rounded px-1.5 py-px bg-secondary text-secondary-foreground font-medium">{logCount}</span>
          )}
          {errorCount > 0 && (
            <span className="ml-1 rounded px-1.5 py-px bg-destructive/50 text-destructive-foreground font-medium">{errorCount} error{errorCount !== 1 && "s"}</span>
          )}
          {warnCount > 0 && (
            <span className="ml-1 rounded px-1.5 py-px bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100 font-medium">{warnCount} warning{warnCount !== 1 && "s"}</span>
          )}
        </button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onClear}
          disabled={entries.length === 0}
          aria-label="Clear console"
          title="Clear console"
        >
          <Trash2 />
        </Button>
      </div>
      {open && (
        <div
          id="mini-console-body"
          ref={listRef}
          className="h-40 overflow-y-auto bg-background p-2 space-y-0.5 border-t border-border"
        >
          {entries.length === 0 ? (
            <p className="text-muted-foreground select-none py-1 px-1">
              No output yet. Press Run to execute your code.
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  "px-1.5 py-1 rounded whitespace-pre-wrap break-all leading-relaxed",
                  entry.type === "error" && "text-destructive bg-destructive/10",
                  entry.type === "warn" && "text-amber-800 dark:text-amber-200 bg-amber-500/15",
                  (entry.type === "log" || entry.type === "info") && "text-foreground",
                )}
              >
                {entry.type === "error" && <span className="mr-1.5">✕</span>}
                {entry.type === "warn" && <span className="mr-1.5">⚠</span>}
                {entry.text}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
