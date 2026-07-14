import { ChevronLeft, ChevronRight } from 'lucide-react'

import Button from '@/components/ui/Button'

function buildPages(currentPage, totalPages) {
  const pages = []

  for (let page = 1; page <= totalPages; page += 1) {
    pages.push(page)
  }

  return pages
}

import { cn } from '@/utils/cn'

export default function Pagination({ page = 1, totalPages = 1, onPageChange, className }) {
  const pages = buildPages(page, totalPages)

  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-3', className)}>
      <div className="join">
        <button
          type="button"
          onClick={() => onPageChange?.(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="btn btn-sm join-item border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-brand-200 hover:bg-brand-50 disabled:border-[var(--app-border)] disabled:bg-white disabled:text-[var(--app-muted)]"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
        </button>
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange?.(pageNumber)}
            className={
              pageNumber === page
                ? 'btn btn-sm join-item border-brand-700 bg-brand-700 text-white hover:border-brand-700 hover:bg-brand-700'
                : 'btn btn-sm join-item border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-brand-200 hover:bg-brand-50'
            }
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="btn btn-sm join-item border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-brand-200 hover:bg-brand-50 disabled:border-[var(--app-border)] disabled:bg-white disabled:text-[var(--app-muted)]"
        >
          <ChevronRight className="h-4 w-4 shrink-0" />
        </button>
      </div>
    </div>
  )
}
