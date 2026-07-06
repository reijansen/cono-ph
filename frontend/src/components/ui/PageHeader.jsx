import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { cn } from '@/utils/cn'

export default function PageHeader({ title, description, breadcrumbs, actions, className }) {
  return (
    <div className={cn('space-y-4', className)}>
      {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--app-text)] sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-sm leading-6 text-[var(--app-muted)] sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}
