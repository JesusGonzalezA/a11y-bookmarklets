const AXE_CDN_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js";

declare global {
  interface Window {
    axe?: {
      run(
        context?: Element | Document,
        options?: Record<string, unknown>,
      ): Promise<{
        violations: AxeRawResult[];
        passes: AxeRawResult[];
        incomplete: AxeRawResult[];
        inapplicable: AxeRawResult[];
      }>;
    };
  }
}

interface AxeRawResult {
  id: string;
  description: string;
  impact?: string;
  helpUrl: string;
  tags: string[];
  nodes: { target: string[]; html: string; failureSummary?: string }[];
}

export function loadAxeCore(): Promise<void> {
  if (window.axe) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = AXE_CDN_URL;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load axe-core from CDN"));
    document.head.appendChild(script);
  });
}
