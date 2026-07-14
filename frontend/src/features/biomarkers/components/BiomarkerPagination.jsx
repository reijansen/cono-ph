import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function BiomarkerPagination({
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
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="join">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
          className="btn btn-sm join-item border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-brand-200 hover:bg-brand-50 disabled:border-[var(--app-border)] disabled:bg-white disabled:text-[var(--app-muted)]"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
        </button>
        {pageNumbers.map((pageNum) =>
          typeof pageNum === 'string' ? (
            <span key={pageNum} className="btn btn-sm btn-disabled join-item border-[var(--app-border)] bg-white text-[var(--app-text)] opacity-100">
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
                  ? 'btn btn-sm join-item border-brand-700 bg-brand-700 text-white hover:border-brand-700 hover:bg-brand-700'
                  : 'btn btn-sm join-item border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-brand-200 hover:bg-brand-50 disabled:border-[var(--app-border)] disabled:bg-white'
              }
            >
              {pageNum}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={page >= totalPages || loading}
          onClick={() => onPageChange(page + 1)}
          className="btn btn-sm join-item border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-brand-200 hover:bg-brand-50 disabled:border-[var(--app-border)] disabled:bg-white disabled:text-[var(--app-muted)]"
        >
          <ChevronRight className="h-4 w-4 shrink-0" />
        </button>
      </div>
    </div>
  )
}
