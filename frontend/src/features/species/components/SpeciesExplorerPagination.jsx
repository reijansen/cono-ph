import { ChevronLeft, ChevronRight } from 'lucide-react'

function getPageNumbers(page, totalPages) {
  const pages = []

  if (totalPages <= 5) {
    for (let index = 1; index <= totalPages; index += 1) {
      pages.push(index)
    }
    return pages
  }

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

  return pages
}

export default function SpeciesExplorerPagination({
  pagination = { page: 1, totalPages: 1 },
  onPageChange = () => {},
}) {
  const { page = 1, totalPages = 1 } = pagination
  const pages = getPageNumbers(page, totalPages)

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="join">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="btn btn-sm join-item border-[var(--app-border)] bg-white text-[var(--app-muted)] disabled:border-[var(--app-border)] disabled:bg-white disabled:text-[var(--app-muted)]"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
        </button>
        {pages.map((page) =>
          page === 'ellipsis' ? (
            <span key={page} className="btn btn-sm btn-disabled join-item border-[var(--app-border)] bg-white text-[var(--app-text)] opacity-100">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={
                page === pagination.page
                  ? 'btn btn-sm join-item border-brand-700 bg-brand-700 text-white hover:border-brand-700 hover:bg-brand-700'
                  : 'btn btn-sm join-item border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-brand-200 hover:bg-brand-50'
              }
            >
              {page}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="btn btn-sm join-item border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-brand-200 hover:bg-brand-50"
        >
          <ChevronRight className="h-4 w-4 shrink-0" />
        </button>
      </div>
    </div>
  )
}
