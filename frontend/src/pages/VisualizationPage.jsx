import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import InsightsSection from '@/features/visualization/components/VisualizationInsightsSection'
import MetricsSection from '@/features/visualization/components/VisualizationMetricsSection'
import OverviewCardsSection from '@/features/visualization/components/VisualizationOverviewCardsSection'
import TrendsSection from '@/features/visualization/components/VisualizationTrendsSection'
import { VisualizationErrorState, VisualizationLoadingState } from '@/features/visualization/components/VisualizationDataStates'
import { useVisualizationSummary } from '@/features/visualization/hooks/useVisualizationSummary'
import {
  visualizationBreadcrumbs,
  visualizationMeta,
} from '@/features/visualization/data/visualizationMockData'

export default function VisualizationPage() {
  const { summary: visualizationData, loading, error, reload } = useVisualizationSummary()

  return (
    <VisualizationLayout
      breadcrumbs={visualizationBreadcrumbs}
      title={visualizationMeta.title}
      subtitle={visualizationMeta.subtitle}
    >
      {loading ? <VisualizationLoadingState label="Loading visualization summary" /> : null}
      {error ? <VisualizationErrorState onRetry={reload} /> : null}
      {!loading && !error ? <MetricsSection metrics={visualizationData?.metrics ?? []} /> : null}
      {!loading && !error ? <OverviewCardsSection cards={visualizationData?.overviewCards ?? []} /> : null}

      <section className="space-y-2 px-1 pt-1">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--app-muted)]">
          Charts and coverage
        </p>
        <p className="max-w-2xl text-sm leading-6 text-[var(--app-muted)]">
          The graphs below show the distribution and coverage views behind the summary numbers above.
        </p>
      </section>

      {!loading && !error ? <TrendsSection
        speciesAreaData={visualizationData?.speciesAreaData ?? []}
        biomarkerBarData={visualizationData?.biomarkerBarData ?? []}
        conopeptideLineData={visualizationData?.conopeptideLineData ?? []}
        biomarkerCoverageData={visualizationData?.biomarkerCoverageData ?? []}
      /> : null}

      {!loading && !error ? <InsightsSection crossDataInsights={visualizationData?.crossDataInsights ?? null} /> : null}
    </VisualizationLayout>
  )
}
