import { useCallback } from "react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  label: string;
}

export function CodeBlock({ code, label }: CodeBlockProps) {
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
  }, [code]);

  return (
    <div className="relative group">
      <section aria-label={label}>
        <pre className="bg-muted border border-border rounded-lg p-4 overflow-x-auto text-sm font-mono">
          <code>{code}</code>
        </pre>
      </section>
      <Button
        variant="secondary"
        size="xs"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
      >
        Copy
      </Button>
    </div>
  );
}
