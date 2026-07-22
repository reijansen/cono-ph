import VisualizationMetricPill from '@/features/visualization/components/VisualizationMetricPill'

export default function MetricsSection({ metrics }) {
  return (
    <section className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => <VisualizationMetricPill key={metric.label} metric={metric} />)}
    </section>
  )
}
