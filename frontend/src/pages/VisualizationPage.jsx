import { Link } from 'react-router-dom'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ChartCard from '@/features/visualization/components/ChartCard'
import {
  BarChartPlaceholder,
  DonutChartPlaceholder,
} from '@/features/visualization/components/ChartPlaceholders'
import MetricCard from '@/features/visualization/components/MetricCard'
import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import VisualizationSidebar from '@/features/visualization/components/VisualizationSidebar'
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
      <h3 className="text-base font-medium text-[var(--app-muted)]">{title}</h3>
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
    <div className="rounded-2xl border border-[var(--app-border)] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 h-12 w-12 shrink-0 rounded-full bg-brand-50" />
        <p className="text-sm leading-6 text-[var(--app-muted)]">{children}</p>
      </div>
    </div>
  )
}

function OverviewPreviewCard({ card }) {
  const showStaticMap = Boolean(card.previewImage)

  return (
    <ChartCard
      title={card.title}
      viewAllLabel={card.viewAllLabel}
      viewAllTo={card.viewAllTo}
      className="h-full"
    >
      <div className="space-y-5">
        <section className="space-y-3">
          <p className="text-lg font-medium text-[var(--app-muted)]">{card.previewTitle}</p>

          {showStaticMap ? (
            <div className="overflow-hidden rounded-3xl border border-[var(--app-border)] bg-white">
              <img
                src={card.previewImage}
                alt={card.previewAlt}
                className="h-[330px] w-full object-cover object-center"
              />
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-[var(--app-border)] bg-white p-3">
              <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-3">
                {card.id === 'conopeptides' ? (
                  <DonutChartPlaceholder className="min-h-[300px]" />
                ) : (
                  <DonutChartPlaceholder className="min-h-[300px]" />
                )}
              </div>
            </div>
          )}
        </section>

        {card.secondaryTitle ? (
          <div className="rounded-2xl border border-[var(--app-border)] bg-brand-50/40 p-3">
            {card.id === 'conopeptides' ? (
              <BarChartPlaceholder className="min-h-[220px]" />
            ) : (
              <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-brand-200 bg-white/70 px-4 text-center text-sm text-[var(--app-muted)]">
                {card.secondaryTitle}
              </div>
            )}
          </div>
        ) : null}

        <PreviewList title={card.listTitle} items={card.listItems} />

        <div className="flex justify-center pt-1">
          <Button as={Link} to={card.ctaTo} variant="outline" size="lg" className="min-w-56">
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
      sidebar={<VisualizationSidebar />}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

      <section className="grid gap-6 xl:grid-cols-3">
        {visualizationOverviewCards.map((card) => (
          <OverviewPreviewCard key={card.id} card={card} />
        ))}
      </section>

      <Card className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <div className="space-y-2">
            <h2 className="text-3xl leading-none text-black">Cross-Data Insights</h2>
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
