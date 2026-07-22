import ChartCard from '@/features/visualization/components/ChartCard'
import { DonutViz, HorizontalBarChart, VerticalBarChart } from '@/features/visualization/components/DataVizPrimitives'
import VisualizationMetricPill from '@/features/visualization/components/VisualizationMetricPill'
import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import { useVisualizationSummary } from '@/features/visualization/hooks/useVisualizationSummary'
import { VisualizationErrorState, VisualizationLoadingState } from '@/features/visualization/components/VisualizationDataStates'
import {
  speciesOverviewBreadcrumbs,
  speciesOverviewMeta,
  speciesProvinceLegend,
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
  return <VisualizationMetricPill metric={metric} />
}

export default function SpeciesOverviewPage() {
  const { summary, loading, error, reload } = useVisualizationSummary()

  const liveMetrics = [
    { label: 'Total Species', value: summary?.summary?.speciesCount ?? 0 },
    { label: 'Subgenera', value: summary?.summary?.subgenusCount ?? 0 },
    { label: 'Provinces', value: summary?.summary?.provinceCount ?? 0 },
    { label: 'Species with Sequence Data', value: summary?.summary?.speciesWithSequenceData ?? 0 },
  ].map((metric) => ({ ...metric, value: String(metric.value) }))

  const liveProvinceCoverage = summary?.speciesAreaData?.map((item) => ({
    province: item.province,
    Species: item.Species,
  })) ?? []

  const liveTopSpecies = summary?.overviewCards?.find((card) => card.id === 'species')?.listItems ?? []
  const liveSubgenusData = summary?.speciesSubgenusData ?? []
  const liveSubgenusLegend = liveSubgenusData.map((item, index) => ({
    label: item.name,
    color: ['bg-slate-900', 'bg-[#9eb8e8]', 'bg-[#8be2b2]', 'bg-[#df9ee9]', 'bg-[#aac0e4]', 'bg-brand-200'][index % 6],
  }))

  return (
    <VisualizationLayout
      breadcrumbs={speciesOverviewBreadcrumbs}
      title={speciesOverviewMeta.title}
      subtitle={speciesOverviewMeta.subtitle}
    >
      {loading ? <VisualizationLoadingState label="Loading species visualization" /> : null}
      {error ? <VisualizationErrorState onRetry={reload} /> : null}
      {loading || error ? null : <>
      <section className="join w-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--app-border)] bg-white shadow-[0_10px_26px_rgba(16,16,16,0.04)] xl:flex-row">
        {liveMetrics.map((metric) => (
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
          <HorizontalBarChart data={liveTopSpecies} />
        </ChartCard>

        <ChartCard
          title="Species by Subgenus"
          viewAllLabel="View full list"
          viewAllTo="/visualization/species"
          className="h-full"
        >
          <div className="flex h-full flex-col gap-5">
            <div className="grid place-items-center">
              <DonutViz data={liveSubgenusData} className="w-full" />
            </div>

            <div className="space-y-3">
              <ul className="grid gap-3 sm:grid-cols-2">
                {liveSubgenusLegend.map((item) => (
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
        <VerticalBarChart data={liveProvinceCoverage} labelKey="province" valueKey="Species" />
      </ChartCard>
      </>}
    </VisualizationLayout>
  )
}
