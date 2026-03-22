import { useEffect, useRef, useState } from "react";
import { minify } from "terser";

export function useBookmarkletBuilder(code: string, shouldMinify: boolean) {
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
