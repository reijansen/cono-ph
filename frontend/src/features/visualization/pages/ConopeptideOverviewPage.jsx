import ChartCard from '@/features/visualization/components/ChartCard'
import {
  BarChartPlaceholder,
  DonutChartPlaceholder,
} from '@/features/visualization/components/ChartPlaceholders'
import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import Table from '@/components/ui/Table'
import {
  conopeptideLengthBins,
  conopeptideOverviewBreadcrumbs,
  conopeptideOverviewMeta,
  conopeptideOverviewMetrics,
  conopeptideSuperfamilyLegend,
  conopeptideTopAbundantRows,
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

export default function ConopeptideOverviewPage() {
  return (
    <VisualizationLayout
      breadcrumbs={conopeptideOverviewBreadcrumbs}
      title={conopeptideOverviewMeta.title}
      subtitle={conopeptideOverviewMeta.subtitle}
    >
      <section className="join w-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--app-border)] bg-white shadow-[0_10px_26px_rgba(16,16,16,0.04)] xl:flex-row">
        {conopeptideOverviewMetrics.map((metric) => (
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
              <DonutChartPlaceholder className="min-h-[340px] w-full max-w-[430px]" />
            </div>

            <div className="space-y-3 rounded-3xl border border-[var(--app-border)] bg-brand-50/40 p-4 sm:p-5">
              <h3 className="text-base font-medium text-[var(--app-muted)]">Legend</h3>
              <p className="text-sm leading-6 text-[var(--app-muted)]">
                Counts and percentages reflect the relative abundance of each superfamily group.
              </p>
              <ul className="space-y-3 pt-1">
                {conopeptideSuperfamilyLegend.map((item) => (
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
          <BarChartPlaceholder
            items={conopeptideLengthBins}
            yAxisLabel="Number of Precursors"
            xAxisLabel="Length (Amino Acids)"
            className="min-h-[420px]"
          />
        </ChartCard>
      </section>

      <ChartCard
        title="Top 10 Most Abundant Conopeptides"
        subtitle="Ranked abundance table with a research-oriented reading order."
        viewAllLabel="View full list"
        viewAllTo="/visualization/conopeptides"
      >
        <Table
          columns={['Conopeptide / Toxin Name', 'Superfamily', 'Framework', 'Count', 'Linked Species']}
          className="shadow-none"
        >
          {conopeptideTopAbundantRows.map((row) => (
            <tr key={`${row.name}-${row.count}`} className="border-b border-[var(--app-border)] last:border-b-0">
              <td className="px-4 py-4 font-medium text-[var(--app-text)]">{row.name}</td>
              <td className="px-4 py-4 text-[var(--app-muted)]">{row.superfamily}</td>
              <td className="px-4 py-4 text-[var(--app-muted)]">{row.framework}</td>
              <td className="px-4 py-4 text-[var(--app-muted)]">{row.count}</td>
              <td className="px-4 py-4 text-[var(--app-muted)]">{row.species}</td>
            </tr>
          ))}
        </Table>
      </ChartCard>
    </VisualizationLayout>
  )
}
