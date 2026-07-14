import Card from '@/components/ui/Card'

export default function StatCard({ as, label, value, hint, className, ...props }) {
  return (
    <Card as={as} className={className} {...props}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-muted)]">{label}</p>
      <p className="mt-2 text-[1.7rem] font-semibold text-[var(--app-text)]">{value}</p>
      {hint ? <p className="mt-1 text-sm text-[var(--app-muted)]">{hint}</p> : null}
    </Card>
  )
}
