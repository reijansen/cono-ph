import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn } from '@/utils/cn'

export default function Breadcrumbs({ items = [], className }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-[var(--app-muted)]">
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
              {!isLast ? <ChevronRight className="h-4 w-4" /> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
