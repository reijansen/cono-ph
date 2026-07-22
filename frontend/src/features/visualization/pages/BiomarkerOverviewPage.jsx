import ChartCard from '@/features/visualization/components/ChartCard'
import { DonutViz, VerticalBarChart } from '@/features/visualization/components/DataVizPrimitives'
import VisualizationMetricPill from '@/features/visualization/components/VisualizationMetricPill'
import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import Table from '@/components/ui/Table'
import { useVisualizationSummary } from '@/features/visualization/hooks/useVisualizationSummary'
import { VisualizationErrorState, VisualizationLoadingState } from '@/features/visualization/components/VisualizationDataStates'
import {
  biomarkerOverviewBreadcrumbs,
  biomarkerOverviewMeta,
} from '@/features/visualization/data/visualizationMockData'

function LegendItem({ label, count, percent, color }) {
  return (
    <li className="flex items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-3">
        <span className={`h-5 w-5 shrink-0 rounded-sm border border-[var(--app-border)] ${color}`} />
        <span className="uppercase tracking-wide text-[var(--app-muted)]">{label}</span>
      </div>
      <span className="text-[var(--app-muted)]">
        {count} ({percent})
      </span>
    </li>
  )
}

function MetricJoinCard({ metric }) {
  return <VisualizationMetricPill metric={metric} />
}

export default function BiomarkerOverviewPage() {
  const { summary, loading, error, reload } = useVisualizationSummary()

  const liveMetrics = [
    { label: 'Total Biomarkers', value: summary?.summary?.biomarkerCount ?? 0 },
    { label: 'Biomarker Types', value: summary?.summary?.biomarkerTypeCount ?? 0 },
    { label: 'Species with Biomarker Data', value: summary?.summary?.speciesWithBiomarkerData ?? 0 },
    { label: 'Biomarker Coverage', value: `${summary?.summary?.biomarkerCoveragePercent ?? 0}%` },
  ]

  const biomarkerCard = summary?.overviewCards?.find((card) => card.id === 'biomarkers')
  const liveTypeLegend = biomarkerCard?.chartData ?? []
  const liveCoverage = summary?.biomarkerCoverageData ?? []
  const liveDensity =
    summary?.biomarkerBarData?.map((item) => ({
      province: item.name,
      biomarker: item.value,
    })) ?? []
  const liveRows = biomarkerCard?.tableRows ?? []
  const liveTypeLegendItems = liveTypeLegend.map((item, index) => ({
    label: item.name,
    count: item.value,
    percent: `${Math.round((item.value / Math.max(liveTypeLegend.reduce((total, entry) => total + entry.value, 0), 1)) * 100)}%`,
    color: ['bg-slate-900', 'bg-[#9eb8e8]', 'bg-[#8be2b2]', 'bg-[#df9ee9]', 'bg-[#aac0e4]', 'bg-brand-200'][index % 6],
  }))

  return (
    <VisualizationLayout
      breadcrumbs={biomarkerOverviewBreadcrumbs}
      title={biomarkerOverviewMeta.title}
      subtitle={biomarkerOverviewMeta.subtitle}
    >
      {loading ? <VisualizationLoadingState label="Loading biomarker visualization" /> : null}
      {error ? <VisualizationErrorState onRetry={reload} /> : null}
      {loading || error ? null : <>
      <section className="join w-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--app-border)] bg-white shadow-[0_10px_26px_rgba(16,16,16,0.04)] xl:flex-row">
        {liveMetrics.map((metric) => (
          <MetricJoinCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:items-start">
        <ChartCard
          title="Biomarker Type Distribution"
          subtitle="Composition-first view of marker usage across sequenced species."
          viewAllLabel="View full list"
          viewAllTo="/visualization/biomarkers"
          className="h-full"
        >
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-center">
            <div className="grid place-items-center">
              <DonutViz data={liveTypeLegend} className="w-full" />
            </div>

            <div className="space-y-4 rounded-3xl border border-[var(--app-border)] bg-brand-50/40 p-4 sm:p-5">
              <h3 className="text-base font-medium text-[var(--app-muted)]">Legend</h3>
              <p className="text-sm leading-6 text-[var(--app-muted)]">
                Marker-type proportions and their record counts are shown together for quick scanning.
              </p>
              <ul className="space-y-3 pt-1">
                {liveTypeLegendItems.map((item) => (
                  <LegendItem key={item.label} {...item} />
                ))}
              </ul>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Biomarker Coverage Across Species"
          subtitle="Coverage split paired with the type composition view."
          viewAllLabel="View full list"
          viewAllTo="/visualization/biomarkers"
          className="h-full"
        >
          <div className="relative grid place-items-center">
            <DonutViz
              data={liveCoverage.map((item) => ({ name: item.label, value: item.value }))}
              centerValue={`${summary?.summary?.biomarkerCoveragePercent ?? 0}%`}
              centerLabel="with data"
              className="w-full"
            />
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <ChartCard
          title="Biomarker Density by Province"
          subtitle="Supporting province-level record density."
          viewAllLabel="View full list"
          viewAllTo="/visualization/biomarkers"
          className="h-full"
        >
          <VerticalBarChart data={liveDensity} labelKey="province" valueKey="biomarker" />
        </ChartCard>

        <ChartCard
          title="Top Biomarker Records"
          subtitle="Definitive evidence layer for biomarker records and accessions."
          viewAllLabel="View full list"
          viewAllTo="/visualization/biomarkers"
          className="xl:col-span-1"
        >
          <Table
            columns={['Biomarker ID', 'Marker Type', 'Species', 'Accession Number', 'Sequence Length', 'Province']}
            className="shadow-none"
          >
            {liveRows.map((row) => (
              <tr key={row.biomarkerId} className="border-b border-[var(--app-border)] last:border-b-0">
                <td className="px-4 py-4 font-medium text-[var(--app-text)]">{row.biomarkerId}</td>
                <td className="px-4 py-4 text-[var(--app-muted)]">{row.markerType}</td>
                <td className="px-4 py-4 text-[var(--app-muted)]">{row.species}</td>
                <td className="px-4 py-4 text-[var(--app-muted)]">{row.accession}</td>
                <td className="px-4 py-4 text-[var(--app-muted)]">{row.sequenceLength}</td>
                <td className="px-4 py-4 text-[var(--app-muted)]">{row.province}</td>
              </tr>
            ))}
          </Table>
        </ChartCard>
      </section>
      </>}
    </VisualizationLayout>
  )
}
