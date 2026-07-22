import { cn } from '@/utils/cn'

const chartColors = ['#526615', '#9dbb55', '#d6a84f', '#86a7a1', '#c47c61', '#8791bd', '#b2a36c', '#6b7280']

export function EmptyChart({ label = 'No data available', className }) {
  return (
    <div className={cn('grid min-h-56 place-items-center rounded-3xl border border-dashed border-[var(--app-border)] bg-[#fbfcf8] px-5 text-center text-sm text-[var(--app-muted)]', className)}>
      {label}
    </div>
  )
}

export function DonutViz({ data = [], valueKey = 'value', labelKey = 'name', centerValue, centerLabel, className }) {
  const total = data.reduce((sum, item) => sum + Number(item[valueKey] || 0), 0)
  if (!data.length || !total) return <EmptyChart className={className} />

  let offset = 0
  const segments = data.map((item, index) => {
    const percent = (Number(item[valueKey] || 0) / total) * 100
    const segment = `${chartColors[index % chartColors.length]} ${offset}% ${offset + percent}%`
    offset += percent
    return segment
  })

  return (
    <div className={cn('grid gap-5 sm:grid-cols-[minmax(180px,230px)_1fr] sm:items-center', className)}>
      <div className="relative mx-auto grid h-48 w-48 place-items-center rounded-full" style={{ background: `conic-gradient(${segments.join(', ')})` }}>
        <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center shadow-inner">
          <div>
            <div className="text-2xl font-semibold text-[var(--app-text)]">{centerValue ?? total}</div>
            {centerLabel ? <div className="mt-1 max-w-20 text-[10px] uppercase tracking-[0.14em] text-[var(--app-muted)]">{centerLabel}</div> : null}
          </div>
        </div>
      </div>
      <ul className="space-y-2.5" aria-label="Chart legend">
        {data.map((item, index) => {
          const value = Number(item[valueKey] || 0)
          return (
            <li key={`${item[labelKey]}-${index}`} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                <span className="truncate text-[var(--app-muted)]">{item[labelKey]}</span>
              </span>
              <span className="shrink-0 font-semibold text-[var(--app-text)]">{value}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function VerticalBarChart({ data = [], labelKey = 'label', valueKey = 'value', className }) {
  const max = Math.max(...data.map((item) => Number(item[valueKey] || 0)), 1)
  if (!data.length) return <EmptyChart className={className} />

  return (
    <div className={cn('flex min-h-64 items-end gap-2 overflow-x-auto rounded-3xl bg-[#fbfcf8] px-4 pb-4 pt-6 sm:gap-4', className)}>
      {data.map((item, index) => {
        const value = Number(item[valueKey] || 0)
        return (
          <div key={`${item[labelKey]}-${index}`} className="flex min-w-14 flex-1 flex-col items-center gap-2">
            <span className="text-xs font-semibold text-[var(--app-text)]">{value}</span>
            <div className="flex h-40 w-full items-end rounded-t-xl bg-brand-50">
              <div className="w-full rounded-t-xl bg-brand-700 transition-[height]" style={{ height: `${Math.max((value / max) * 100, 3)}%` }} />
            </div>
            <span className="max-w-20 truncate text-center text-[11px] text-[var(--app-muted)]" title={item[labelKey]}>{item[labelKey]}</span>
          </div>
        )
      })}
    </div>
  )
}

export function HorizontalBarChart({ data = [], labelKey = 'name', valueKey = 'value', className }) {
  const max = Math.max(...data.map((item) => Number(item[valueKey] || 0)), 1)
  if (!data.length) return <EmptyChart className={className} />

  return (
    <div className={cn('space-y-4', className)}>
      {data.map((item, index) => {
        const value = Number(item[valueKey] || 0)
        return (
          <div key={`${item[labelKey]}-${index}`} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-[var(--app-muted)]" title={item[labelKey]}>{item[labelKey]}</span>
              <span className="font-semibold text-[var(--app-text)]">{value}</span>
            </div>
            <div className="h-2 rounded-full bg-brand-50">
              <div className="h-2 rounded-full bg-brand-700" style={{ width: `${Math.max((value / max) * 100, 3)}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function AreaChartViz({ data = [], labelKey = 'year', valueKey = 'value', className }) {
  if (!data.length) return <EmptyChart className={className} />
  const max = Math.max(...data.map((item) => Number(item[valueKey] || 0)), 1)
  const points = data.map((item, index) => {
    const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100
    const y = 92 - (Number(item[valueKey] || 0) / max) * 78
    return { ...item, x, y }
  })
  const polyline = points.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <div className={cn('rounded-3xl bg-[#fbfcf8] p-4', className)}>
      <svg viewBox="0 0 100 100" className="h-64 w-full" role="img" aria-label="Trend chart">
        {[20, 44, 68, 92].map((y) => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#dfe5d6" strokeWidth="0.5" />)}
        <polygon points={`0,92 ${polyline} 100,92`} fill="#526615" fillOpacity="0.12" />
        <polyline points={polyline} fill="none" stroke="#526615" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="1.5" fill="white" stroke="#526615" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />)}
      </svg>
      <div className="mt-2 flex justify-between gap-3 text-[11px] text-[var(--app-muted)]">
        <span>{data[0][labelKey]}</span>
        <span>{data[data.length - 1][labelKey]}</span>
      </div>
    </div>
  )
}
