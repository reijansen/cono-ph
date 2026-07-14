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
    <div className={cn('mx-auto max-w-[1520px] space-y-8 pb-10', className)}>
      {breadcrumbs.length ? <Breadcrumbs items={breadcrumbs} /> : null}

      <main className="min-w-0 space-y-8">{children}</main>
    </div>
  )
}
