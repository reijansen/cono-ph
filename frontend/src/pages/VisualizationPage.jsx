import { lazy, Suspense, useEffect, useState } from 'react'

import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import { loadVisualizationBackupData } from '@/features/visualization/data/visualizationBackupData'
import {
  visualizationBreadcrumbs,
  visualizationMeta,
} from '@/features/visualization/data/visualizationMockData'

const MetricsSection = lazy(() =>
  import('@/features/visualization/components/VisualizationMetricsSection').then((module) => ({
    default: module.default,
  })),
)

const OverviewCardsSection = lazy(() =>
  import('@/features/visualization/components/VisualizationOverviewCardsSection').then((module) => ({
    default: module.default,
  })),
)

const TrendsSection = lazy(() =>
  import('@/features/visualization/components/VisualizationTrendsSection').then((module) => ({
    default: module.default,
  })),
)

const InsightsSection = lazy(() =>
  import('@/features/visualization/components/VisualizationInsightsSection').then((module) => ({
    default: module.default,
  })),
)

function SectionFallback({ className = 'h-64' }) {
  return <div className={`animate-pulse rounded-[1.25rem] border border-[var(--app-border)] bg-white ${className}`} />
}

export default function VisualizationPage() {
  const [visualizationData, setVisualizationData] = useState(null)

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        const backupData = await loadVisualizationBackupData()
        if (active) {
          setVisualizationData(backupData)
        }
      } catch {
        if (active) {
          setVisualizationData(null)
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
      <Suspense fallback={<SectionFallback className="h-28" />}>
        <MetricsSection metrics={visualizationData?.metrics ?? []} />
      </Suspense>

      <Suspense fallback={<SectionFallback className="h-[420px]" />}>
        <OverviewCardsSection cards={visualizationData?.overviewCards ?? []} />
      </Suspense>

      <Suspense fallback={<SectionFallback className="h-[360px]" />}>
        <TrendsSection
          speciesAreaData={visualizationData?.speciesAreaData ?? []}
          biomarkerBarData={visualizationData?.biomarkerBarData ?? []}
          conopeptideLineData={visualizationData?.conopeptideLineData ?? []}
          biomarkerCoverageData={visualizationData?.biomarkerCoverageData ?? []}
        />
      </Suspense>

      <Suspense fallback={<SectionFallback className="h-64" />}>
        <InsightsSection insights={visualizationData?.insights ?? []} />
      </Suspense>
    </VisualizationLayout>
  )
}
