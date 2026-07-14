import { cn } from '@/utils/cn'
import Card from '@/components/ui/Card'

export default function MetricCard({ icon: Icon, value, label, description, className }) {
  return (
    <Card className={cn('p-3 sm:p-4', className)}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          {Icon ? <Icon className="h-5 w-5" strokeWidth={1.8} /> : null}
        </div>

        <div className="min-w-0">
          <p className="text-[1.35rem] font-semibold tracking-tight text-[var(--app-text)] sm:text-[1.5rem]">{value}</p>
          <p className="mt-0.5 text-[0.82rem] font-semibold text-brand-700">{label}</p>
          {description ? (
            <p className="mt-1 text-[0.82rem] leading-5 text-[var(--app-muted)]">{description}</p>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
