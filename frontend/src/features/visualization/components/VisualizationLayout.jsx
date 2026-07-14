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
    <div className={cn('mx-auto max-w-[1440px] space-y-8 pb-10', className)}>
      {breadcrumbs.length ? <Breadcrumbs items={breadcrumbs} /> : null}

      <header className="space-y-3">
        <div className="space-y-2">
          <h1 className="text-[clamp(2.2rem,3.8vw,3.3rem)] leading-none tracking-tight text-black">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-4xl text-sm leading-6 text-[var(--app-muted)] sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
      </header>

      <main className="min-w-0 space-y-8">{children}</main>
    </div>
  )
}
