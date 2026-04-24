type LoadingOverlayProps = {
  visible: boolean;
  currentStep: number;
};

const steps = [
  "Segmenting by speaker",
  "Identifying commitments & owners",
  "Classifying blockers, risks, waiting-on-client",
  "Linking to source quotes",
];

export default function LoadingOverlay({
  visible,
  currentStep,
}: LoadingOverlayProps) {
  if (!visible) {
    return null;
  }

  const activeStep = Math.max(0, Math.min(currentStep, steps.length - 1));

  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-[rgba(6,8,11,0.62)] backdrop-blur-sm">
      <div className="panel w-full max-w-[420px] border-line-2 bg-[linear-gradient(180deg,rgba(26,30,38,0.98),rgba(15,17,21,0.99))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.46)]">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line-2 bg-bg-2 shadow-[0_0_0_1px_var(--accent-glow)]">
            <div className="h-5 w-5 animate-spinSlow rounded-full border-2 border-line-2 border-t-accent" />
          </div>

          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-faint">
              Parsing
            </div>
            <h2 className="mt-1 text-lg font-semibold text-fg">
              Structuring consulting work
            </h2>
            <p className="mt-2 text-sm leading-6 text-fg-dim">
              Building a clean board from the raw source so tasks, risks, and
              client dependencies are easier to review.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2.5">
          {steps.map((label, index) => {
            const isDone = index < activeStep;
            const isCurrent = index === activeStep;

            return (
              <div
                key={label}
                className={`flex items-center gap-3 rounded-[8px] border px-3 py-3 transition ${
                  isDone
                    ? "border-[rgba(34,197,94,0.25)] bg-[rgba(15,42,26,0.42)]"
                    : isCurrent
                      ? "border-[rgba(124,122,255,0.4)] bg-[rgba(42,42,106,0.3)]"
                      : "border-line bg-[rgba(20,23,29,0.7)]"
                }`}
              >
                <div
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] ${
                    isDone
                      ? "border-[rgba(34,197,94,0.3)] bg-ok-weak text-ok"
                      : isCurrent
                        ? "border-[rgba(124,122,255,0.4)] bg-bg-1 text-accent"
                        : "border-line-2 bg-bg-1 text-fg-faint"
                  }`}
                >
                  {isDone ? (
                    "✓"
                  ) : isCurrent ? (
                    <div className="h-3.5 w-3.5 animate-spinSlow rounded-full border-2 border-line-2 border-t-accent" />
                  ) : (
                    <span className="mono">{index + 1}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div
                    className={`text-sm font-medium ${
                      isDone ? "text-fg" : isCurrent ? "text-fg" : "text-fg-dim"
                    }`}
                  >
                    {label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
