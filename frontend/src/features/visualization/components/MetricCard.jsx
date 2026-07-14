import { cn } from '@/utils/cn'
import Card from '@/components/ui/Card'

export default function MetricCard({ icon: Icon, value, label, description, className }) {
  return (
    <Card className={cn('p-4 sm:p-5', className)}>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          {Icon ? <Icon className="h-6 w-6" strokeWidth={1.8} /> : null}
        </div>

        <div className="min-w-0">
          <p className="text-[1.9rem] font-semibold tracking-tight text-[var(--app-text)]">{value}</p>
          <p className="mt-1 text-sm font-semibold text-brand-700">{label}</p>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-[var(--app-muted)]">{description}</p>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
