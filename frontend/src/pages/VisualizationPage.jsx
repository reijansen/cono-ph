import { useEffect, useState } from 'react'

import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import InsightsSection from '@/features/visualization/components/VisualizationInsightsSection'
import MetricsSection from '@/features/visualization/components/VisualizationMetricsSection'
import OverviewCardsSection from '@/features/visualization/components/VisualizationOverviewCardsSection'
import TrendsSection from '@/features/visualization/components/VisualizationTrendsSection'
import { fetchDashboardSummary } from '@/services/catalogService'
import { loadVisualizationBackupData } from '@/features/visualization/data/visualizationBackupData'
import {
  visualizationBreadcrumbs,
  visualizationMeta,
} from '@/features/visualization/data/visualizationMockData'

export default function VisualizationPage() {
  const [visualizationData, setVisualizationData] = useState(null)

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        const loadedData = await fetchDashboardSummary()
        if (active && loadedData) {
          setVisualizationData(loadedData)
          return
        }

        const fallbackData = await loadVisualizationBackupData()
        if (active) {
          setVisualizationData(fallbackData)
        }
      } catch {
        try {
          const fallbackData = await loadVisualizationBackupData()
          if (active) {
            setVisualizationData(fallbackData)
          }
        } catch {
          if (active) {
            setVisualizationData(null)
          }
        }
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [])

  return (
    <VisualizationLayout
      breadcrumbs={visualizationBreadcrumbs}
      title={visualizationMeta.title}
      subtitle={visualizationMeta.subtitle}
    >
      <MetricsSection metrics={visualizationData?.metrics ?? []} />

      <OverviewCardsSection cards={visualizationData?.overviewCards ?? []} />

      <section className="space-y-2 px-1 pt-1">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--app-muted)]">
          Charts and coverage
        </p>
        <p className="max-w-2xl text-sm leading-6 text-[var(--app-muted)]">
          The graphs below show the distribution and coverage views behind the summary numbers above.
        </p>
      </section>

      <TrendsSection
        speciesAreaData={visualizationData?.speciesAreaData ?? []}
        biomarkerBarData={visualizationData?.biomarkerBarData ?? []}
        conopeptideLineData={visualizationData?.conopeptideLineData ?? []}
        biomarkerCoverageData={visualizationData?.biomarkerCoverageData ?? []}
      />

      <InsightsSection crossDataInsights={visualizationData?.crossDataInsights ?? null} />
    </VisualizationLayout>
  )
}
