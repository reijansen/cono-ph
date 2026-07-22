import Button from '@/components/ui/Button'

export function VisualizationLoadingState({ label = 'Loading data' }) {
  return (
    <section aria-live="polite" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="h-24 animate-pulse rounded-3xl border border-[var(--app-border)] bg-white" />
      ))}
      <span className="sr-only">{label}</span>
    </section>
  )
}

export function VisualizationErrorState({ onRetry }) {
  return (
    <section role="alert" className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-900">
      <h2 className="text-base font-semibold">Visualization data is unavailable</h2>
      <p className="mt-1 text-sm leading-6">The dashboard could not load the current database summary.</p>
      <Button type="button" variant="outline" size="md" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </section>
  )
}
