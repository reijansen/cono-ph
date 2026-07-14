import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import Card from '@/components/ui/Card'
import { cn } from '@/utils/cn'

export default function ConopeptideTableCard({
  title,
  subtitle,
  actionLabel = 'View full list',
  actionTo,
  action,
  children,
  className,
}) {
  return (
    <Card className={cn('overflow-hidden p-0', className)}>
      <div className="flex flex-col gap-3 border-b border-[var(--app-border)] px-5 py-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-[1.55rem] leading-none text-[var(--app-text)]">{title}</h2>
          {subtitle ? <p className="text-sm leading-6 text-[var(--app-muted)]">{subtitle}</p> : null}
        </div>
        {action
          ? action
          : actionTo ? (
              <Link
                to={actionTo}
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--app-muted)] transition hover:text-brand-700"
              >
                <span>{actionLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
      </div>

      <div className="p-4 sm:p-5 lg:p-6">{children}</div>
    </Card>
  )
}
