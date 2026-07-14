import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { cn } from '@/utils/cn'

export default function ConopeptideLayout({
  breadcrumbs = [],
  title,
  subtitle,
  sidebar,
  children,
  className,
}) {
  return (
    <div className={cn('w-full space-y-2 pb-10', className)}>
      {breadcrumbs.length ? <Breadcrumbs items={breadcrumbs} /> : null}

      <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:items-start">
        {sidebar ? <aside>{sidebar}</aside> : null}
        <main className="min-w-0 space-y-8">{children}</main>
      </div>
    </div>
  )
}
