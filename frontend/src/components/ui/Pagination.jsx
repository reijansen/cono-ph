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
    <div className={cn('flex flex-wrap items-center justify-between gap-3', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange?.(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Previous
      </Button>

      <div className="flex flex-wrap items-center gap-2">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange?.(pageNumber)}
            className={
              pageNumber === page
                ? 'rounded-full bg-brand-600 px-3 py-2 text-sm font-medium text-white'
                : 'rounded-full border border-[var(--app-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--app-text)]'
            }
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        Next
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  )
}
