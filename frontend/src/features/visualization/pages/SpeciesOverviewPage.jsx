import { BarChart, BarList, DonutChart } from '@tremor/react'

import ChartCard from '@/features/visualization/components/ChartCard'
import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import {
  speciesOverviewBreadcrumbs,
  speciesOverviewMeta,
  speciesOverviewMetrics,
  speciesProvinceCoverage,
  speciesProvinceLegend,
  speciesSubgenusLegend,
  speciesSubgenusChartData,
  speciesTopSequencedSpecies,
  visualizationMapPreview,
} from '@/features/visualization/data/visualizationMockData'

function LegendItem({ label, color }) {
  return (
    <li className="flex items-center gap-3 text-sm text-[var(--app-muted)]">
      <span className={`h-5 w-5 shrink-0 rounded-sm border border-[var(--app-border)] ${color}`} />
      <span>{label}</span>
    </li>
  )
}

function ZoomControl() {
  return (
    <div className="absolute right-4 top-4 overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white shadow-sm">
      <button
        type="button"
        aria-label="Zoom in"
        className="flex h-10 w-10 items-center justify-center border-b border-[var(--app-border)] text-xl text-[var(--app-text)]"
      >
        +
      </button>
      <button
        type="button"
        aria-label="Zoom out"
        className="flex h-10 w-10 items-center justify-center text-xl text-[var(--app-text)]"
      >
        -
      </button>
    </div>
  )
}

function MetricJoinCard({ metric }) {
  const Icon = metric.icon

  return (
    <div className="join-item flex min-w-0 flex-1 gap-3 border border-[var(--app-border)] bg-white p-3 sm:p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        {Icon ? <Icon className="h-5 w-5" strokeWidth={1.8} /> : null}
      </div>

      <div className="min-w-0">
        <p className="text-[1.35rem] font-semibold tracking-tight text-[var(--app-text)] sm:text-[1.5rem]">
          {metric.value}
        </p>
        <p className="mt-0.5 text-[0.82rem] font-semibold text-brand-700">{metric.label}</p>
        {metric.description ? (
          <p className="mt-1 text-[0.82rem] leading-5 text-[var(--app-muted)]">{metric.description}</p>
        ) : null}
      </div>
    </div>
  )
}

export default function SpeciesOverviewPage() {
  return (
    <VisualizationLayout
      breadcrumbs={speciesOverviewBreadcrumbs}
      title={speciesOverviewMeta.title}
      subtitle={speciesOverviewMeta.subtitle}
    >
      <section className="join w-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--app-border)] bg-white shadow-[0_10px_26px_rgba(16,16,16,0.04)] xl:flex-row">
        {speciesOverviewMetrics.map((metric) => (
          <MetricJoinCard key={metric.label} metric={metric} />
        ))}
      </section>

      <ChartCard
        title="Species Distribution by Province"
        subtitle="Color groups indicate provincial species counts; darker concentrations mean more recorded species."
      >
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_240px] xl:items-start">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-[var(--app-border)] bg-white">
              <img
                src={visualizationMapPreview}
                alt="Species distribution by province preview map"
                className="h-[620px] w-full object-cover object-center"
              />
              <ZoomControl />
            </div>

            <p className="max-w-3xl text-sm leading-6 text-[var(--app-muted)]">
              Use the map to compare distribution density by province before scanning the supporting
              rankings and coverage summary below.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--app-border)] bg-brand-50/40 p-4 sm:p-5">
            <div className="space-y-3">
              <h3 className="text-base font-medium text-[var(--app-muted)]">Legend</h3>
              <p className="text-sm leading-6 text-[var(--app-muted)]">
                Color intensity reflects species count groups in each province.
              </p>
              <ul className="space-y-3 pt-1">
                {speciesProvinceLegend.map((item) => (
                  <LegendItem key={item.label} label={item.label} color={item.color} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </ChartCard>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Top 10 Most Sequenced Species"
          viewAllLabel="View full list"
          viewAllTo="/visualization/species"
          className="h-full"
        >
          <BarList
            data={speciesTopSequencedSpecies.map((item) => ({ name: item.name, value: item.value }))}
            valueFormatter={(value) => `${value}`}
          />
        </ChartCard>

        <ChartCard
          title="Species by Subgenus"
          viewAllLabel="View full list"
          viewAllTo="/visualization/species"
          className="h-full"
        >
          <div className="flex h-full flex-col gap-5">
            <div className="grid place-items-center">
              <DonutChart
                data={speciesSubgenusChartData}
                category="name"
                value="value"
                variant="donut"
                className="h-[260px] w-full"
              />
            </div>

            <div className="space-y-3">
              <ul className="grid gap-3 sm:grid-cols-2">
                {speciesSubgenusLegend.map((item) => (
                  <LegendItem key={item.label} label={item.label} color={item.color} />
                ))}
              </ul>
            </div>
          </div>
        </ChartCard>
      </section>

      <ChartCard
        title="Sequencing Coverage Across Provinces"
        subtitle="A lightweight support chart for province-level sequencing spread."
      >
        <BarChart
          data={speciesProvinceCoverage.map((item) => ({
            province: item.label,
            Species: item.value,
          }))}
          index="province"
          categories={['Species']}
          colors={['indigo']}
          yAxisWidth={40}
          showLegend={false}
          className="h-[340px]"
        />
      </ChartCard>
      </VisualizationLayout>
  )
}
