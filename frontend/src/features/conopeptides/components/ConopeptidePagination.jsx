import { ChevronLeft, ChevronRight } from 'lucide-react'

import Button from '@/components/ui/Button'

export default function ConopeptidePagination({
  pagination = { page: 1, totalPages: 1 },
  onPageChange = () => {},
  loading = false,
}) {
  const { page = 1, totalPages = 1 } = pagination

  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let index = 1; index <= totalPages; index += 1) {
        pages.push(index)
      }
    } else {
      pages.push(1)

      if (page > 3) {
        pages.push('ellipsis-start')
      }

      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)
      for (let index = start; index <= end; index += 1) {
        if (!pages.includes(index)) {
          pages.push(index)
        }
      }

      if (page < totalPages - 2) {
        pages.push('ellipsis-end')
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-4 sm:gap-3">
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-300"
        disabled={page <= 1 || loading}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="mr-1.5 h-4 w-4 shrink-0" />
        Previous
      </Button>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {pageNumbers.map((pageNum) =>
          typeof pageNum === 'string' ? (
            <span key={pageNum} className="px-3 py-2 text-sm text-[var(--app-text)]">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              type="button"
              disabled={loading}
              onClick={() => onPageChange(pageNum)}
              className={
                pageNum === page
                  ? 'rounded-lg bg-brand-700 px-3 py-2 text-sm font-medium text-white'
                  : 'rounded-lg px-3 py-2 text-sm font-medium text-[var(--app-text)] transition hover:bg-black/5 disabled:opacity-50'
              }
            >
              {pageNum}
            </button>
          ),
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="text-[var(--app-text)]"
        disabled={page >= totalPages || loading}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRight className="ml-1.5 h-4 w-4 shrink-0" />
      </Button>
    </div>
  )
}
