import Card from '@/components/ui/Card'
import { cn } from '@/utils/cn'

export default function BiomarkerTableCard({
  title,
  subtitle,
  resultCount,
  action,
  children,
  className,
}) {
  return (
    <Card className={cn('overflow-hidden p-0', className)}>
      <div className="flex flex-col gap-3 border-b border-[var(--app-border)] px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="space-y-1">
          <h2 className="text-2xl leading-none text-[var(--app-text)]">{title}</h2>
          {subtitle ? <p className="text-sm leading-6 text-[var(--app-muted)]">{subtitle}</p> : null}
        </div>

        {(resultCount || action) ? (
          <div className="flex flex-wrap items-center gap-3 self-start sm:justify-end">
            {resultCount ? (
              <span className="text-sm font-medium text-brand-700">{resultCount}</span>
            ) : null}
            {action}
          </div>
        ) : null}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </Card>
  )
}
