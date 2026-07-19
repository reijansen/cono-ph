export default function InsightsSection({ crossDataInsights }) {
  const summary = crossDataInsights?.summary ?? []
  const highlights = crossDataInsights?.highlights ?? []

  return (
    <section className="rounded-[1.25rem] border border-[var(--app-border)] bg-white p-4 shadow-[0_10px_24px_rgba(16,16,16,0.04)] sm:p-5">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-start">
        <div className="space-y-3">
          <div className="space-y-2">
            <h2 className="text-[1.5rem] leading-tight text-[var(--app-text)] sm:text-[1.7rem]">Cross-data insights</h2>
            <p className="max-w-2xl text-sm leading-6 text-[var(--app-muted)]">
              Species, conopeptide, biomarker, and publication records are summarized together so the relationships are
              visible at a glance.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {summary.map((item) => (
              <div key={item.label} className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-muted)]">
                  {item.label}
                </p>
                <p className="mt-2 text-[1.5rem] font-semibold tracking-tight text-[var(--app-text)]">{item.value}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--app-muted)]">{item.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold text-[var(--app-text)]">Key takeaways</h3>
          <p className="text-sm leading-6 text-[var(--app-muted)]">
            The most important relationships distilled from the loaded records.
          </p>

          <div className="space-y-2">
            {highlights.map((highlight) => (
              <div key={highlight.title} className="rounded-2xl border border-[var(--app-border)] px-4 py-3">
                <p className="text-sm font-semibold text-[var(--app-text)]">{highlight.title}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--app-muted)]">{highlight.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
