import Card from '@/components/ui/Card'

export default function StatCard({ as, label, value, hint, className, ...props }) {
  return (
    <Card as={as} className={className} {...props}>
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--app-muted)]">{label}</p>
      <p className="mt-2 text-[1.55rem] font-semibold tracking-tight text-[var(--app-text)] sm:text-[1.7rem]">{value}</p>
      {hint ? <p className="mt-1 text-[0.92rem] leading-6 text-[var(--app-muted)]">{hint}</p> : null}
    </Card>
  )
}
