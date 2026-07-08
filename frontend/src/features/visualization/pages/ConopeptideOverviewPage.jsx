import ChartCard from '@/features/visualization/components/ChartCard'
import { DonutChartPlaceholder } from '@/features/visualization/components/ChartPlaceholders'
import MetricCard from '@/features/visualization/components/MetricCard'
import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import VisualizationSidebar from '@/features/visualization/components/VisualizationSidebar'
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

function LengthBarChart() {
  const maxValue = Math.max(...conopeptideLengthBins.map((item) => item.value))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-4">
        <div className="flex h-[320px] flex-col justify-between pb-10 pt-4 text-right text-xs text-[var(--app-muted)]">
          <span>50</span>
          <span>40</span>
          <span>30</span>
          <span>20</span>
          <span>10</span>
          <span>0</span>
        </div>

        <div className="relative h-[320px] rounded-3xl border border-[var(--app-border)] bg-white px-5 pb-12 pt-6">
          <div className="absolute inset-x-5 top-6 h-px bg-[rgba(226,226,212,0.9)]" />
          <div className="absolute inset-x-5 top-[28%] h-px bg-[rgba(226,226,212,0.7)]" />
          <div className="absolute inset-x-5 top-[48%] h-px bg-[rgba(226,226,212,0.7)]" />
          <div className="absolute inset-x-5 top-[68%] h-px bg-[rgba(226,226,212,0.7)]" />
          <div className="absolute inset-x-5 top-[88%] h-px bg-[rgba(226,226,212,0.7)]" />

          <div className="flex h-full items-end gap-5">
            {conopeptideLengthBins.map((bin) => (
              <div key={bin.label} className="flex flex-1 flex-col items-center justify-end gap-3">
                <div className="flex w-full flex-1 items-end justify-center">
                  <div
                    className="w-12 rounded-t-md bg-brand-700 shadow-sm"
                    style={{ height: `${(bin.value / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-center text-xs text-[var(--app-muted)]">{bin.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-4">
        <div className="text-right text-xs font-medium text-[var(--app-muted)]">Number of Precursors</div>
        <div className="text-center text-sm font-semibold text-[var(--app-muted)]">
          Length (Amino Acids)
        </div>
      </div>
    </div>
  )
}

function TableRow({ row }) {
  return (
    <tr className="border-b border-[var(--app-border)] last:border-b-0">
      <td className="px-4 py-3 font-medium text-[var(--app-text)]">{row.name}</td>
      <td className="px-4 py-3 text-[var(--app-muted)]">{row.superfamily}</td>
      <td className="px-4 py-3 text-[var(--app-muted)]">{row.framework}</td>
      <td className="px-4 py-3 text-[var(--app-muted)]">{row.count}</td>
      <td className="px-4 py-3 text-[var(--app-muted)]">{row.species}</td>
    </tr>
  )
}

export default function ConopeptideOverviewPage() {
  return (
    <VisualizationLayout
      breadcrumbs={conopeptideOverviewBreadcrumbs}
      title={conopeptideOverviewMeta.title}
      subtitle={conopeptideOverviewMeta.subtitle}
      sidebar={<VisualizationSidebar />}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {conopeptideOverviewMetrics.map((metric) => (
          <MetricCard key={metric.label} icon={metric.icon} value={metric.value} label={metric.label} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Conopeptide Superfamily Distribution" viewAllLabel="View full list" viewAllTo="/visualization/conopeptides">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-center">
            <div className="grid place-items-center">
              <DonutChartPlaceholder className="min-h-[320px] w-full max-w-[420px]" />
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium text-[var(--app-muted)]">Legend</h3>
              <ul className="space-y-4">
                {conopeptideSuperfamilyLegend.map((item) => (
                  <LegendItem key={item.label} {...item} />
                ))}
              </ul>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Precursor Length Distribution" viewAllLabel="View full list" viewAllTo="/visualization/conopeptides">
          <LengthBarChart />
        </ChartCard>
      </section>

      <ChartCard title="Top 10 Most Abundant Conopeptides" viewAllLabel="View full list" viewAllTo="/visualization/conopeptides">
        <div className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-brand-50/70 text-xs uppercase tracking-wide text-[var(--app-muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Conopeptide / Toxin Name</th>
                  <th className="px-4 py-3 font-medium">Superfamily</th>
                  <th className="px-4 py-3 font-medium">Framework</th>
                  <th className="px-4 py-3 font-medium">Count</th>
                  <th className="px-4 py-3 font-medium">Linked Species</th>
                </tr>
              </thead>
              <tbody>
                {conopeptideTopAbundantRows.map((row) => (
                  <TableRow key={`${row.name}-${row.count}`} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ChartCard>
    </VisualizationLayout>
  )
}
