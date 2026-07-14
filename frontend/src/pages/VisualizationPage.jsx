import { Link } from 'react-router-dom'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ChartCard from '@/features/visualization/components/ChartCard'
import { DonutChartPlaceholder } from '@/features/visualization/components/ChartPlaceholders'
import MetricCard from '@/features/visualization/components/MetricCard'
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

export default function VisualizationPage() {
  return (
    <VisualizationLayout
      breadcrumbs={visualizationBreadcrumbs}
      title={visualizationMeta.title}
      subtitle={visualizationMeta.subtitle}
    >
      <section className="rounded-[1.75rem] border border-brand-100 bg-white/80 p-5 shadow-[0_10px_26px_rgba(16,16,16,0.04)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
              Visualization Gateway
            </p>
            <p className="text-sm leading-6 text-[var(--app-muted)] sm:text-base">
              Start with the broadest species view, then move into conopeptides and biomarkers.
            </p>
          </div>

          <Button as={Link} to={visualizationMeta.primaryCtaTo} size="lg" className="w-full sm:min-w-56 sm:w-auto">
            {visualizationMeta.primaryCtaLabel}
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visualizationMetrics.map((metric) => (
          <MetricCard
            key={metric.label}
            icon={metric.icon}
            value={metric.value}
            label={metric.label}
            description={metric.description}
          />
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
