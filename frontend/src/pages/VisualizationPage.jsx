import { Link } from 'react-router-dom'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ChartCard from '@/features/visualization/components/ChartCard'
import { DonutChartPlaceholder } from '@/features/visualization/components/ChartPlaceholders'
import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import {
  visualizationBreadcrumbs,
  visualizationInsights,
  visualizationMeta,
  visualizationMetrics,
  visualizationOverviewCards,
} from '@/features/visualization/data/visualizationMockData'

function PreviewList({ title, items }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[0.95rem] font-semibold text-[var(--app-muted)]">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate italic text-[var(--app-muted)]">{item.name}</span>
            <span className="shrink-0 text-[var(--app-muted)]">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function InsightCard({ children }) {
  return (
    <div className="rounded-[1.25rem] border border-[var(--app-border)] bg-white p-4 shadow-[0_10px_24px_rgba(16,16,16,0.03)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 h-10 w-10 shrink-0 rounded-full bg-brand-50" />
        <p className="text-sm leading-6 text-[var(--app-muted)]">{children}</p>
      </div>
    </div>
  )
}

function OverviewPreviewCard({ card }) {
  const showStaticMap = Boolean(card.previewImage)
  const Icon = card.icon

  return (
    <ChartCard
      title={card.title}
      viewAllLabel={card.viewAllLabel}
      viewAllTo={card.viewAllTo}
      className="h-full"
    >
      <div className="flex h-full flex-col gap-5">
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            {Icon ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
            ) : null}
            <p className="text-[1rem] font-medium text-[var(--app-muted)]">{card.previewTitle}</p>
          </div>

          {showStaticMap ? (
            <div className="overflow-hidden rounded-3xl border border-[var(--app-border)] bg-white">
              <img
                src={card.previewImage}
                alt={card.previewAlt}
                className="h-[220px] w-full object-cover object-center sm:h-[280px] lg:h-[330px]"
              />
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-[var(--app-border)] bg-white p-3">
              <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-3">
                <DonutChartPlaceholder className="min-h-[300px]" />
              </div>
            </div>
          )}
        </section>

        <div className="flex-1">
          <PreviewList title={card.listTitle} items={card.listItems} />
        </div>

        <div className="pt-1">
          <Button as={Link} to={card.ctaTo} variant="outline" size="lg" className="w-full sm:w-auto sm:min-w-56">
            {card.ctaLabel}
          </Button>
        </div>
      </div>
    </ChartCard>
  )
}

function MetricJoinCard({ metric }) {
  const Icon = metric.icon

  return (
    <div className="join-item flex min-w-0 flex-1 gap-4 border border-[var(--app-border)] bg-white p-4 sm:p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        {Icon ? <Icon className="h-6 w-6" strokeWidth={1.8} /> : null}
      </div>

      <div className="min-w-0">
        <p className="text-[1.65rem] font-semibold tracking-tight text-[var(--app-text)] sm:text-[1.8rem]">
          {metric.value}
        </p>
        <p className="mt-1 text-[0.92rem] font-semibold text-brand-700">{metric.label}</p>
        {metric.description ? (
          <p className="mt-1 text-[0.92rem] leading-6 text-[var(--app-muted)]">{metric.description}</p>
        ) : null}
      </div>
    </div>
  )
}

export default function VisualizationPage() {
  return (
    <VisualizationLayout
      breadcrumbs={visualizationBreadcrumbs}
      title={visualizationMeta.title}
      subtitle={visualizationMeta.subtitle}
    >
      <section className="join w-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--app-border)] bg-white shadow-[0_10px_26px_rgba(16,16,16,0.04)] xl:flex-row">
        {visualizationMetrics.map((metric) => (
          <MetricJoinCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {visualizationOverviewCards.map((card) => (
          <OverviewPreviewCard key={card.id} card={card} />
        ))}
      </section>

      <Card className="space-y-5 bg-brand-50/20 p-5 sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)] xl:items-start">
          <div className="space-y-2">
            <h2 className="text-[1.8rem] leading-none text-black">Cross-Data Insights</h2>
            <p className="text-sm leading-6 text-[var(--app-muted)] sm:text-base">
              Integrated insights across species, conopeptides, and biomarkers.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {visualizationInsights.map((insight) => (
              <InsightCard key={insight}>{insight}</InsightCard>
            ))}
          </div>
        </div>
      </Card>
    </VisualizationLayout>
  )
}
