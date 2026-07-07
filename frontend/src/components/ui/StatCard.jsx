import Card from '@/components/ui/Card'

export default function StatCard({ as, label, value, hint, className, ...props }) {
  return (
    <Card as={as} className={className} {...props}>
      <p className="text-sm font-medium text-[var(--app-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--app-text)]">{value}</p>
      {hint ? <p className="mt-1 text-sm text-[var(--app-muted)]">{hint}</p> : null}
    </Card>
  )
}
