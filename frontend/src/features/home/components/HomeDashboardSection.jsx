import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import mapImage from '@/assets/map.png'
import StatCard from '@/components/ui/StatCard'
import { cn } from '@/utils/cn'

import {
  discoveryTrend,
  homeMetrics,
  recentPublications,
  recentSpecies,
  specimenDistribution,
  superfamilyBreakdown,
} from '../data/homeDashboardData'

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="space-y-3 text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-brand-500">{eyebrow}</p>
      <h2 className="text-[clamp(2rem,3.2vw,3rem)] leading-none text-black">{title}</h2>
      <p className="mx-auto max-w-3xl text-sm leading-7 text-[var(--app-muted)] sm:text-base">
        {description}
      </p>
    </div>
  )
}

function MetricTile({ metric }) {
  return (
    <StatCard
      as="div"
      title={metric.detail}
      label={metric.label}
      value={metric.value}
      hint={metric.delta}
      className={cn(
        'text-left shadow-none hover:shadow-sm',
        'border-[var(--app-border)] bg-white',
      )}
    />
  )
}

function ListSection({ title, description, children }) {
  return (
    <section className="space-y-3 border-t border-brand-100 pt-5">
      <div>
        <h3 className="text-[0.95rem] font-semibold text-black">{title}</h3>
        <p className="mt-1 text-xs text-[var(--app-muted)]">{description}</p>
      </div>
      {children}
    </section>
  )
}

function SuperfamilyBarChart() {
  const total = superfamilyBreakdown.reduce((sum, item) => sum + item.value, 0)

  return (
    <ListSection title="Conopeptides by Superfamily" description="Bar graph breakdown">
      <div className="overflow-hidden rounded-[1.75rem] border border-[var(--app-border)] bg-white px-5 py-5 shadow-[0_10px_26px_rgba(16,16,16,0.04)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-base font-semibold text-[var(--app-text)]">Conopeptides by Superfamily</h4>
            <p className="mt-1 text-xs text-[var(--app-muted)]">Annotated counts by family group</p>
          </div>
          <div className="rounded-full border border-[var(--app-border)] bg-[#f7f7f8] px-3 py-1 text-sm text-black shadow-sm">
            {total}
          </div>
        </div>

        <div className="mt-4 flex h-48 items-end gap-4 rounded-[1.5rem] bg-[#fafafa] px-4 pb-4 pt-3">
          {superfamilyBreakdown.map((item) => {
            const tallest = Math.max(...superfamilyBreakdown.map((entry) => entry.value))
            const height = `${Math.max((item.value / tallest) * 100, 18)}%`

            return (
              <div key={item.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2" title={`${item.label} family: ${item.value}%`}>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-[1.25rem] shadow-sm"
                    style={{ height, backgroundColor: item.color }}
                  />
                </div>
                <span className="text-xs text-[var(--app-muted)]">{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </ListSection>
  )
}

function SpecimenPieChart() {
  const total = specimenDistribution.reduce((sum, item) => sum + item.value, 0)

  return (
    <ListSection title="Specimen Distribution" description="Pie chart breakdown">
      <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex justify-center">
          <div className="relative h-36 w-36 rounded-full border-[18px] border-brand-300 border-r-brand-700 border-b-brand-700 bg-white shadow-sm" title="Regional composition">
            <div className="absolute inset-[22%] rounded-full bg-white" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-semibold text-black">{total.toFixed(1)}%</div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--app-muted)]">curated</div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white">
          {specimenDistribution.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 border-b border-[var(--app-border)] px-4 py-3 last:border-b-0"
              title={`${item.label} region share`}
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-black">{item.label}</span>
              </div>
              <span className="text-sm text-[var(--app-muted)]">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </ListSection>
  )
}

function DiscoveryLineChart() {
  const yearOptions = [
    { label: '2016-2025', start: 2016, end: 2025 },
    { label: '2018-2025', start: 2018, end: 2025 },
    { label: '2020-2025', start: 2020, end: 2025 },
    { label: '2023-2025', start: 2023, end: 2025 },
  ]
  const [rangeIndex, setRangeIndex] = useState(0)

  const { start, end } = yearOptions[rangeIndex]
  const filteredTrend = discoveryTrend.filter((item) => {
    const year = Number(item.year)
    return year >= start && year <= end
  })

  const linePoints = useMemo(() => {
    if (!filteredTrend.length) return ''

    const widthStep = filteredTrend.length === 1 ? 0 : 100 / (filteredTrend.length - 1)
    const maxValue = Math.max(...filteredTrend.map((item) => item.value))
    return filteredTrend
      .map((item, index) => {
        const x = 8 + index * widthStep * 0.84
        const y = 50 - (item.value / maxValue) * 34
        return `${x},${y}`
      })
      .join(' ')
  }, [filteredTrend])

  const maxValue = Math.max(...filteredTrend.map((item) => item.value))

  return (
    <ListSection title="Conopeptide Discoveries Over Time" description="Line graph with year filters">
      <div className="overflow-hidden rounded-[1.75rem] border border-[var(--app-border)] bg-white px-5 py-5 shadow-[0_10px_26px_rgba(16,16,16,0.04)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="mt-1 text-xs text-[var(--app-muted)]">Filtered by publication year range</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-[var(--app-border)] bg-[#f7f7f8] px-3 py-1 text-sm text-black shadow-sm">
              {yearOptions[rangeIndex].label}
            </div>
            <button
              type="button"
              onClick={() => setRangeIndex((current) => (current - 1 + yearOptions.length) % yearOptions.length)}
              className="rounded-full border border-[var(--app-border)] bg-[#f7f7f8] p-2 text-[var(--app-muted)] shadow-sm transition hover:bg-brand-50 hover:text-black"
              aria-label="Previous year range"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
            </button>
            <button
              type="button"
              onClick={() => setRangeIndex((current) => (current + 1) % yearOptions.length)}
              className="rounded-full border border-[var(--app-border)] bg-[#f7f7f8] p-2 text-[var(--app-muted)] shadow-sm transition hover:bg-brand-50 hover:text-black"
              aria-label="Next year range"
            >
              <ChevronRight className="h-4 w-4 shrink-0" />
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--app-border)] bg-[#f7f7f8] p-2 text-[var(--app-muted)] shadow-sm transition hover:bg-brand-50 hover:text-black"
              aria-label="Chart options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-[48px_1fr] gap-2">
          <div className="relative h-[280px] pt-3 text-[11px] text-[var(--app-muted)]">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-sm text-black">
              Number of Conopeptides
            </span>
          </div>

          <div className="rounded-[1.5rem] bg-[#fafafa] px-3 pb-3 pt-2">
            <svg viewBox="0 0 100 60" className="h-[250px] w-full overflow-visible">
              <defs>
                <linearGradient id="discoveryLineFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#b79cf0" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#b79cf0" stopOpacity="0" />
                </linearGradient>
              </defs>

              {[15, 30, 45, 60].map((y) => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#ece8ef" strokeDasharray="1.5 2.5" />
              ))}

              {[0, 20, 40, 60, 80, 100].map((x) => (
                <line key={x} x1={x} y1="10" x2={x} y2="50" stroke="#f0edf4" />
              ))}

              <line x1="0" y1="50" x2="100" y2="50" stroke="#e7e2ed" />

              {linePoints ? (
                <>
                  <polygon points={`8,50 ${linePoints} 92,50`} fill="url(#discoveryLineFill)" />
                  <polyline
                    fill="none"
                    stroke="#b79cf0"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={linePoints}
                    vectorEffect="non-scaling-stroke"
                  />
                </>
              ) : null}

              {filteredTrend.map((item, index) => {
                const x = filteredTrend.length === 1 ? 50 : 8 + (index / (filteredTrend.length - 1)) * 84
                const y = 50 - (item.value / maxValue) * 34
                return (
                  <g key={item.year}>
                    <circle cx={x} cy={y} r="1.2" fill="#ffffff" stroke="#111827" strokeWidth="0.8" />
                    <circle cx={x} cy={y} r="0.55" fill="#b79cf0" />
                  </g>
                )
              })}
            </svg>

            <div className="mt-1 flex items-center justify-between gap-4 px-1 text-[11px] text-[var(--app-muted)]">
              <span>{start}</span>
              <span>Publication Year</span>
              <span>{end}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[var(--app-muted)]">
          <span>Range: {start} to {end}</span>
          <span>Latest year on the right</span>
        </div>
      </div>
    </ListSection>
  )
}

export default function HomeDashboardSection() {
  return (
    <section className="space-y-7 border-t border-brand-100 pt-8">
      <SectionHeading
        eyebrow="Interactive Dashboard"
        title="Explore species, peptides, publications, and updates"
        description="Reusable data modules for the home dashboard with metric tiles, publication lists, species lists, and readable summary sections."
      />

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {homeMetrics.map((metric) => (
              <MetricTile key={metric.key} metric={metric} />
            ))}
          </div>

          <SuperfamilyBarChart />
          <SpecimenPieChart />
        </div>

        <div className="space-y-6">
          <section className="overflow-hidden rounded-[2rem] border border-[var(--app-border)] bg-white shadow-[0_10px_26px_rgba(16,16,16,0.04)]">
            <img
              src={mapImage}
              alt="Philippine map preview"
              className="h-[240px] w-full object-cover sm:h-[320px] lg:h-full"
            />
          </section>
        </div>
      </div>

      <section className="space-y-5 border-t border-brand-100 pt-8">
        <DiscoveryLineChart />
      </section>

      <section className="space-y-6">
        <ListSection title="Top 3 Recent Species" description="Sorted by linked publication date">
          <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
            {recentSpecies.map((species, index) => (
              <div
                key={species.id}
                title={species.name}
                className="min-w-[250px] rounded-2xl border border-[var(--app-border)] bg-white px-4 py-4 shadow-sm sm:min-w-[280px]"
              >
                <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--app-muted)]">
                  #{index + 1}
                </div>
                <div className="mt-2 text-base font-semibold text-black">{species.name}</div>
                <div className="mt-1 text-sm text-[var(--app-muted)]">{species.locality}</div>
                <div className="mt-3 text-xs text-brand-700">{species.status}</div>
                <div className="mt-4 text-xs text-brand-700">
                  <div className="font-semibold">{species.publicationDate}</div>
                  <div>{species.id}</div>
                </div>
              </div>
            ))}
          </div>
        </ListSection>

        <ListSection title="Top 3 Recent Publications" description="Most recent by publication date">
          <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
            {recentPublications.map((publication, index) => (
              <div
                key={publication.id}
                title={publication.title}
                className="min-w-[250px] rounded-2xl border border-[var(--app-border)] bg-white px-4 py-4 shadow-sm sm:min-w-[280px]"
              >
                <div className="space-y-2">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--app-muted)]">
                    #{index + 1}
                  </div>
                  <h4 className="text-base font-semibold text-black">{publication.title}</h4>
                  <p className="text-sm text-[var(--app-muted)]">
                    {publication.authors} · {publication.journal}
                  </p>
                </div>
                <div className="mt-4 text-xs text-brand-700">
                  <div className="font-semibold">{publication.publicationDate}</div>
                  <div>{publication.id}</div>
                </div>
              </div>
            ))}
          </div>
        </ListSection>
      </section>
    </section>
  )
}
