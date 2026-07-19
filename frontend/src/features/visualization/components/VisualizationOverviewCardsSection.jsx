import { DonutChart, Metric } from '@tremor/react'
import { Link } from 'react-router-dom'

import Button from '@/components/ui/Button'
import ChartCard from '@/features/visualization/components/ChartCard'

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

function OverviewPreviewCard({ card }) {
  const showStaticMap = Boolean(card.previewImage)
  const Icon = card.icon
  const metricValue = card.metricValue ?? '0'
  const metricDescription = card.metricDescription ?? 'No data available'
  const hasChartData = Array.isArray(card.chartData) && card.chartData.length > 0
  const hasListItems = Array.isArray(card.listItems) && card.listItems.length > 0

  return (
    <ChartCard
      title={card.title}
      viewAllLabel={card.viewAllLabel}
      viewAllTo={card.viewAllTo}
      className="h-full"
    >
      <div className="flex h-full flex-col gap-4">
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            {Icon ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
            ) : null}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--app-text)]">{card.previewTitle}</p>
              {!showStaticMap ? <p className="text-xs text-[var(--app-muted)]">{metricDescription}</p> : null}
            </div>
          </div>

          {showStaticMap ? (
            <div className="overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)]">
              <img
                src={card.previewImage}
                alt={card.previewAlt}
                className="h-[220px] w-full object-cover object-center sm:h-[280px] lg:h-[330px]"
              />
            </div>
          ) : (
            <div className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
              <Metric className="text-[2rem] leading-none text-[var(--app-text)]">{metricValue}</Metric>

              <div className="mt-5">
                {hasChartData ? (
                  <DonutChart data={card.chartData} category="name" value="value" variant="donut" className="h-72" />
                ) : (
                  <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-[var(--app-border)] bg-white text-sm text-[var(--app-muted)]">
                    No chart data available
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <div className="flex-1">
          {hasListItems ? (
            <PreviewList title={card.listTitle} items={card.listItems} />
          ) : (
            <div className="rounded-3xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] p-4 text-sm text-[var(--app-muted)]">
              No list items available
            </div>
          )}
        </div>

        <div className="flex justify-center pt-1">
          <Button
            as={Link}
            to={card.ctaTo}
            variant="primary"
            size="lg"
            className="w-full min-w-56 sm:w-auto"
          >
            {card.ctaLabel}
          </Button>
        </div>
      </div>
    </ChartCard>
  )
}

export default function OverviewCardsSection({ cards }) {
  return (
    <section className="grid gap-5 xl:grid-cols-3">
      {cards.map((card) => (
        <OverviewPreviewCard key={card.id} card={card} />
      ))}
    </section>
  )
}
