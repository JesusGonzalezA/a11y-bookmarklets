export function HowToInstall() {
  const steps = [
    {
      key: "show-bar",
      text: (
        <>
          Make sure your browser&apos;s <strong>bookmarks bar</strong> is visible.
        </>
      ),
    },
    {
      key: "drag",
      text: (
        <>
          <strong>Drag</strong> any bookmarklet button below into your bookmarks bar.
        </>
      ),
    },
    {
      key: "click",
      text: (
        <>
          Navigate to any webpage and <strong>click the bookmarklet</strong> to run the audit.
        </>
      ),
    },
  ];

  return (
    <section aria-labelledby="install-heading" className="mb-16">
      <h2 id="install-heading" className="text-2xl font-semibold tracking-tight mb-6">
        How to install
      </h2>
      <ol className="space-y-4 list-none">
        {steps.map((step, i) => (
          <li key={step.key} className="flex gap-4 items-start">
            <span
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="pt-1">{step.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
