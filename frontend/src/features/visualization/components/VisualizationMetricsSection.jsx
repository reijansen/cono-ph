export default function MetricsSection({ metrics }) {
  return (
    <section className="join w-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--app-border)] bg-white shadow-[0_10px_26px_rgba(16,16,16,0.04)] xl:flex-row">
      {metrics.map((metric) => {
        const Icon = metric.icon

        return (
          <div key={metric.label} className="join-item flex min-w-0 flex-1 gap-4 border border-[var(--app-border)] bg-white p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              {Icon ? <Icon className="h-6 w-6" strokeWidth={1.8} /> : null}
            </div>

            <div className="min-w-0">
              <p className="text-[1.65rem] font-semibold tracking-tight text-[var(--app-text)] sm:text-[1.8rem]">
                {metric.value}
              </p>
              <p className="mt-1 text-[0.92rem] font-semibold text-brand-700">{metric.label}</p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
