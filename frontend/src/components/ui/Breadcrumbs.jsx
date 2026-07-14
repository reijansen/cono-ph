import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn } from '@/utils/cn'

export default function Breadcrumbs({ items = [], className }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[0.82rem] text-[var(--app-muted)] sm:text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`${item.label}-${item.to ?? index}`} className="flex items-center gap-1">
              {item.to && !isLast ? (
                <Link to={item.to} className="transition hover:text-brand-700">
                  {item.label}
                </Link>
              ) : (
                <span className={cn('font-medium', isLast && 'text-[var(--app-text)]')}>
                  {item.label}
                </span>
              )}
              {!isLast ? <ChevronRight className="h-4 w-4 shrink-0" /> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
