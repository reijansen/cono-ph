import ChartCard from '@/features/visualization/components/ChartCard'
import { DonutViz, VerticalBarChart } from '@/features/visualization/components/DataVizPrimitives'
import VisualizationMetricPill from '@/features/visualization/components/VisualizationMetricPill'
import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import Table from '@/components/ui/Table'
import { useVisualizationSummary } from '@/features/visualization/hooks/useVisualizationSummary'
import { VisualizationErrorState, VisualizationLoadingState } from '@/features/visualization/components/VisualizationDataStates'
import {
  conopeptideOverviewBreadcrumbs,
  conopeptideOverviewMeta,
} from '@/features/visualization/data/visualizationMockData'

function LegendItem({ label, count, percent, color }) {
  return (
    <li className="flex items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-3">
        <span className={`h-5 w-5 rounded-sm border border-[var(--app-border)] ${color}`} />
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

export default function ConopeptideOverviewPage() {
  const { summary, loading, error, reload } = useVisualizationSummary()

  const liveMetrics = [
    { label: 'Total Precursors', value: summary?.summary?.conopeptideCount ?? 0 },
    { label: 'Superfamilies', value: summary?.summary?.superfamilyCount ?? 0 },
    { label: 'Unique Peptides', value: summary?.summary?.uniquePeptideCount ?? 0 },
    { label: 'Species with Conopeptides', value: summary?.summary?.speciesWithConopeptides ?? 0 },
  ].map((metric) => ({ ...metric, value: String(metric.value) }))

  const conopeptideCard = summary?.overviewCards?.find((card) => card.id === 'conopeptides')
  const liveSuperfamilies = conopeptideCard?.chartData ?? []
  const liveLengthBins = summary?.conopeptideLineData ?? []
  const liveTopRows = conopeptideCard?.tableRows ?? []
  const liveSuperfamilyLegend = liveSuperfamilies.map((item, index) => ({
    label: item.name,
    count: item.value,
    percent: `${Math.round((item.value / Math.max(liveSuperfamilies.reduce((total, entry) => total + entry.value, 0), 1)) * 100)}%`,
    color: ['bg-slate-900', 'bg-[#9eb8e8]', 'bg-[#8be2b2]', 'bg-[#df9ee9]', 'bg-[#aac0e4]', 'bg-brand-200'][index % 6],
  }))

  return (
    <VisualizationLayout
      breadcrumbs={conopeptideOverviewBreadcrumbs}
      title={conopeptideOverviewMeta.title}
      subtitle={conopeptideOverviewMeta.subtitle}
    >
      {loading ? <VisualizationLoadingState label="Loading conopeptide visualization" /> : null}
      {error ? <VisualizationErrorState onRetry={reload} /> : null}
      {loading || error ? null : <>
      <section className="join w-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--app-border)] bg-white shadow-[0_10px_26px_rgba(16,16,16,0.04)] xl:flex-row">
        {liveMetrics.map((metric) => (
          <MetricJoinCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] xl:items-start">
        <ChartCard
          title="Conopeptide Superfamily Distribution"
          subtitle="Composition-first view across the dominant superfamilies."
          viewAllLabel="View full list"
          viewAllTo="/visualization/conopeptides"
          className="h-full"
        >
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-center">
            <div className="grid place-items-center">
              <DonutViz data={liveSuperfamilies} className="w-full" />
            </div>

            <div className="space-y-3 rounded-3xl border border-[var(--app-border)] bg-brand-50/40 p-4 sm:p-5">
              <h3 className="text-base font-medium text-[var(--app-muted)]">Legend</h3>
              <p className="text-sm leading-6 text-[var(--app-muted)]">
                Counts and percentages reflect the relative abundance of each superfamily group.
              </p>
              <ul className="space-y-3 pt-1">
                {liveSuperfamilyLegend.map((item) => (
                  <LegendItem key={item.label} {...item} />
                ))}
              </ul>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Precursor Length Distribution"
          subtitle="A paired view of peptide length bins to compare against superfamily composition."
          viewAllLabel="View full list"
          viewAllTo="/visualization/conopeptides"
          className="h-full"
        >
          <VerticalBarChart data={liveLengthBins} labelKey="range" valueKey="count" />
        </ChartCard>
      </section>

      <ChartCard
        title="Top 10 Most Abundant Conopeptides"
        subtitle="Ranked abundance table with a research-oriented reading order."
        viewAllLabel="View full list"
        viewAllTo="/visualization/conopeptides"
      >
          <Table
            columns={['Conopeptide / Toxin Name', 'Matched Toxin', 'Superfamily', 'Framework', 'Records', 'Linked Species']}
            className="shadow-none"
          >
          {liveTopRows.map((row) => (
            <tr key={`${row.name}-${row.count}`} className="border-b border-[var(--app-border)] last:border-b-0">
              <td className="px-4 py-4 font-medium text-[var(--app-text)]">{row.name}</td>
              <td className="px-4 py-4 text-[var(--app-muted)]">{row.matchedToxin}</td>
              <td className="px-4 py-4 text-[var(--app-muted)]">{row.superfamily}</td>
              <td className="px-4 py-4 text-[var(--app-muted)]">{row.framework}</td>
              <td className="px-4 py-4 text-[var(--app-muted)]">{row.count}</td>
              <td className="px-4 py-4 text-[var(--app-muted)]">{row.species}</td>
            </tr>
          ))}
        </Table>
      </ChartCard>
      </>}
    </VisualizationLayout>
  )
}
