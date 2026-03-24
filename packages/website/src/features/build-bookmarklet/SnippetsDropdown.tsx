import { useState } from "react";
import { Code2, Highlighter, ListTree, PanelRight, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { SNIPPETS, type Snippet } from "./snippets";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  PanelRight,
  Highlighter,
  ListTree,
  Trash2,
  Code2,
};

interface SnippetsDropdownProps {
  onInsert: (code: string) => void;
  customSnippets?: Snippet[];
  onDeleteSnippet?: (id: string) => void;
}

export function SnippetsDropdown({ onInsert, customSnippets = [], onDeleteSnippet }: SnippetsDropdownProps) {
  const [open, setOpen] = useState(false);

  function handleInsert(snippet: Snippet) {
    onInsert(snippet.code);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="sm" aria-label="Insert code snippet">
            <Code2 aria-hidden="true" />
            Snippets
          </Button>
        }
      />
      <PopoverContent
        side="bottom"
        align="start"
        className="w-80 p-2"
      >
        <p className="px-2 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Snippets
        </p>
        <ul className="space-y-0.5" role="list">
          {SNIPPETS.map((snippet) => {
            const Icon = ICONS[snippet.icon] ?? Code2;
            return (
              <li key={snippet.id}>
                <button
                  type="button"
                  onClick={() => handleInsert(snippet)}
                  className="flex w-full items-start gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                >
                  <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-medium leading-tight">{snippet.name}</span>
                    <span className="text-xs text-muted-foreground leading-tight">
                      {snippet.description}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {customSnippets.length > 0 && (
          <>
            <div className="my-2 border-t border-border" />
            <p className="px-2 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              My Snippets
            </p>
            <ul className="space-y-0.5" role="list">
              {customSnippets.map((snippet) => (
                <li key={snippet.id} className="flex items-start gap-1">
                  <button
                    type="button"
                    onClick={() => handleInsert(snippet)}
                    className="flex flex-1 items-start gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors min-w-0"
                  >
                    <Code2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium leading-tight truncate">{snippet.name}</span>
                  </button>
                  {onDeleteSnippet && (
                    <button
                      type="button"
                      onClick={() => onDeleteSnippet(snippet.id)}
                      className="shrink-0 rounded-md p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                      aria-label={`Delete snippet ${snippet.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
