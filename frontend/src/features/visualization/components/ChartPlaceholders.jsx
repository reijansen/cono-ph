import { cn } from '@/utils/cn'

function PlaceholderFrame({ title, className, children }) {
  return (
    <div
      className={cn(
        'flex min-h-[280px] flex-col rounded-3xl border border-dashed border-brand-200 bg-brand-50/40 p-4 sm:p-5',
        className,
      )}
    >
      <p className="text-sm font-semibold text-brand-800">{title}</p>
      <div className="mt-4 flex min-h-0 flex-1 items-center justify-center">{children}</div>
    </div>
  )
}

export function DonutChartPlaceholder({ className, sizeClassName = 'h-48 w-48' }) {
  return (
    <PlaceholderFrame title="Donut chart placeholder" className={className}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full border-[18px] border-brand-300 border-r-brand-700 border-b-brand-700 bg-white shadow-sm',
          sizeClassName,
        )}
      />
    </PlaceholderFrame>
  )
}

export function BarChartPlaceholder({
  className,
  items = [40, 68, 50, 82, 60, 72],
  yAxisLabel = 'Number of Species',
  xAxisLabel = 'Length (Amino Acids)',
  yAxisMarks = [100, 75, 50, 25, 0],
  barClassName = 'bg-brand-700/90',
  barWidthClassName = 'w-12',
}) {
  const maxValue = Math.max(1, ...items.map((item) => item.value ?? item))

  return (
    <PlaceholderFrame title="Bar chart placeholder" className={className}>
      <div className="space-y-4">
        <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-4">
          <div className="flex h-[320px] flex-col justify-between pb-10 pt-4 text-right text-xs text-[var(--app-muted)]">
            {yAxisMarks.map((mark) => (
              <span key={mark}>{mark}</span>
            ))}
          </div>

          <div className="relative h-[320px] rounded-3xl border border-[var(--app-border)] bg-white px-5 pb-12 pt-6">
            <div className="absolute inset-x-5 top-6 h-px bg-[rgba(226,226,212,0.9)]" />
            <div className="absolute inset-x-5 top-[28%] h-px bg-[rgba(226,226,212,0.7)]" />
            <div className="absolute inset-x-5 top-[48%] h-px bg-[rgba(226,226,212,0.7)]" />
            <div className="absolute inset-x-5 top-[68%] h-px bg-[rgba(226,226,212,0.7)]" />
            <div className="absolute inset-x-5 top-[88%] h-px bg-[rgba(226,226,212,0.7)]" />

            <div className="flex h-full items-end gap-5">
              {items.map((item, index) => {
                const value = item.value ?? item
                const label = item.label ?? `${index + 1}`

                return (
                  <div key={`${label}-${index}`} className="flex flex-1 flex-col items-center justify-end gap-3">
                    <div className="flex w-full flex-1 items-end justify-center">
                      <div
                        className={cn(barWidthClassName, 'rounded-t-md shadow-sm', barClassName)}
                        style={{ height: `${(value / maxValue) * 100}%` }}
                      />
                    </div>
                    <span className="text-center text-xs text-[var(--app-muted)]">{label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-4">
          <div className="text-right text-xs font-medium text-[var(--app-muted)]">{yAxisLabel}</div>
          <div className="text-center text-sm font-semibold text-[var(--app-muted)]">{xAxisLabel}</div>
        </div>
      </div>
    </PlaceholderFrame>
  )
}

export function MapPlaceholder({ className }) {
  return (
    <PlaceholderFrame title="Map placeholder" className={className}>
      <div className="relative h-56 w-full rounded-3xl border border-[var(--app-border)] bg-white">
        <div className="absolute inset-0 bg-brand-50/70" />
        <div className="absolute inset-6 rounded-2xl border border-dashed border-brand-200" />
        <div className="absolute left-8 top-8 h-20 w-24 rounded-[32%_68%_58%_42%/49%_48%_52%_51%] bg-brand-200/80" />
        <div className="absolute right-14 top-16 h-24 w-18 rounded-[55%_45%_44%_56%/45%_42%_58%_55%] bg-brand-300/80" />
        <div className="absolute bottom-10 left-16 h-16 w-16 rounded-[41%_59%_63%_37%/48%_42%_58%_52%] bg-brand-700/20" />
      </div>
    </PlaceholderFrame>
  )
}

export function TablePlaceholder({ className }) {
  const rows = Array.from({ length: 5 })

  return (
    <PlaceholderFrame title="Table placeholder" className={className}>
      <div className="w-full overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white">
        <div className="grid grid-cols-4 gap-3 border-b border-[var(--app-border)] bg-brand-50/60 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
          <span>Label</span>
          <span>Count</span>
          <span>Coverage</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-[var(--app-border)]">
          {rows.map((_, index) => (
            <div key={index} className="grid grid-cols-4 gap-3 px-4 py-3">
              <span className="h-3.5 rounded-full bg-brand-100" />
              <span className="h-3.5 rounded-full bg-brand-200" />
              <span className="h-3.5 rounded-full bg-brand-100" />
              <span className="h-3.5 rounded-full bg-brand-200" />
            </div>
          ))}
        </div>
      </div>
    </PlaceholderFrame>
  )
}

export function GaugePlaceholder({
  className,
  value = 76,
  label = 'Gauge placeholder',
  details = 'Species with biomarker data',
}) {
  return (
    <PlaceholderFrame title="Gauge placeholder" className={className}>
      <div className="grid place-items-center">
        <div className="relative flex h-[300px] w-[300px] items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[24px] border-brand-300 border-r-brand-700 border-b-brand-700 bg-white" />
          <div className="absolute inset-[18px] rounded-full bg-white shadow-sm" />
          <div className="relative z-10 text-center">
            <div className="text-4xl font-semibold text-[var(--app-text)]">{value}%</div>
            <p className="mt-2 text-sm text-[var(--app-muted)]">{label}</p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-[var(--app-muted)]">{details}</div>
      </div>
    </PlaceholderFrame>
  )
}

export function RankedListPlaceholder({
  className,
  items = [],
  leftHeader = 'Label',
  rightHeader = 'Value',
  axisLabel = '',
  valueFormatter = (value) => value,
  showBars = true,
}) {
  const maxValue = Math.max(1, ...items.map((item) => item.value))

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_32px] gap-4 text-xs text-[var(--app-muted)]">
        <span>{leftHeader}</span>
        <span>{rightHeader}</span>
        <span />
      </div>

      <ul className="space-y-4">
        {items.map((item) => {
          const width = `${Math.max((item.value / maxValue) * 100, 10)}%`

          return (
            <li
              key={item.label}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_32px] items-center gap-4 text-sm"
            >
              <span className="truncate italic text-[var(--app-muted)]">{item.label}</span>
              {showBars ? (
                <div className="h-1.5 rounded-full bg-brand-100">
                  <div className="h-1.5 rounded-full bg-brand-700" style={{ width }} />
                </div>
              ) : (
                <span className="text-[var(--app-muted)]">{valueFormatter(item.value)}</span>
              )}
              <span className="text-right text-[var(--app-muted)]">{valueFormatter(item.value)}</span>
            </li>
          )
        })}
      </ul>

      {axisLabel ? <div className="text-center text-sm font-semibold text-[var(--app-muted)]">{axisLabel}</div> : null}
    </div>
  )
}
