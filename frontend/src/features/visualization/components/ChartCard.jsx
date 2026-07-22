import { Link } from 'react-router-dom'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { cn } from '@/utils/cn'

export default function ChartCard({
  title,
  subtitle,
  viewAllTo,
  viewAllLabel = 'View full list',
  viewAllVariant = 'link',
  children,
  className,
}) {
  return (
    <Card className={cn('overflow-hidden p-0', className)}>
      <div className="flex items-start justify-between gap-3 border-b border-[var(--app-border)] px-5 py-4 sm:px-6">
        <div className="space-y-1">
          <h2 className="text-[1.5rem] leading-none text-[var(--app-text)]">{title}</h2>
          {subtitle ? <p className="text-sm leading-6 text-[var(--app-muted)]">{subtitle}</p> : null}
        </div>
        {viewAllTo && viewAllVariant === 'button' ? (
          <Button as={Link} to={viewAllTo} size="sm" className="shrink-0 rounded-xl px-4">
            {viewAllLabel}
          </Button>
        ) : viewAllTo ? (
          <Link
            to={viewAllTo}
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--app-muted)] transition hover:text-brand-700"
          >
            <span>{viewAllLabel}</span>
          </Link>
        ) : null}
      </div>

      <div className="p-4 sm:p-5 lg:p-6">{children}</div>
    </Card>
  )
}
