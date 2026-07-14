import { ChevronLeft, ChevronRight } from 'lucide-react'

const pages = [1, 2, 3, 'ellipsis', 67, 68]

export default function SpeciesExplorerPagination() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="join">
        <button
          type="button"
          disabled
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
              className={
                page === 1
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
          className="btn btn-sm join-item border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-brand-200 hover:bg-brand-50"
        >
          <ChevronRight className="h-4 w-4 shrink-0" />
        </button>
      </div>
    </div>
  )
}
