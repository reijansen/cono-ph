import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'

/**
 * Pagination component for species explorer
 * Displays page numbers and navigation controls
 */
export default function SpeciesExplorerPagination({
  pagination = { page: 1, totalPages: 1 },
  onPageChange = () => {},
  loading = false,
}) {
  const { page = 1, totalPages = 1 } = pagination

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Show ellipsis if current page is far from start
      if (page > 3) {
        pages.push('ellipsis')
      }

      // Show pages around current page
      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      // Show ellipsis if current page is far from end
      if (page < totalPages - 2) {
        pages.push('ellipsis')
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
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

      <div className="flex flex-wrap items-center gap-2">
        {pageNumbers.map((pageNum) =>
          pageNum === 'ellipsis' ? (
            <span key={`${pageNum}-${Math.random()}`} className="px-3 py-2 text-sm text-[var(--app-text)]">
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
