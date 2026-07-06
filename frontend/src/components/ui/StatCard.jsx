import Card from '@/components/ui/Card'

export default function StatCard({ label, value, hint, className }) {
  return (
    <Card className={className}>
      <p className="text-sm font-medium text-[var(--app-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--app-text)]">{value}</p>
      {hint ? <p className="mt-1 text-sm text-[var(--app-muted)]">{hint}</p> : null}
    </Card>
  )
}
