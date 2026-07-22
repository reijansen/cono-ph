import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { cn } from '@/utils/cn'

export default function VisualizationLayout({
  breadcrumbs = [],
  title,
  subtitle,
  children,
  className,
}) {
  return (
    <div className={cn('w-full space-y-2 pb-10', className)}>
      {breadcrumbs.length ? <Breadcrumbs items={breadcrumbs} /> : null}

      <header className="space-y-2 pb-2 pt-4 sm:pb-3">
        <h1 className="text-[clamp(2rem,4vw,3.5rem)] leading-none tracking-tight text-[var(--app-text)]">
          {title}
        </h1>
        {subtitle ? <p className="max-w-3xl text-sm leading-7 text-[var(--app-muted)] sm:text-base">{subtitle}</p> : null}
      </header>

      <main className="min-w-0 space-y-8">{children}</main>
    </div>
  )
}
