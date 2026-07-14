import { ChevronLeft, ChevronRight } from 'lucide-react'

import Button from '@/components/ui/Button'

const pages = [1, 2, 3, 'ellipsis', 67, 68]

export default function SpeciesExplorerPagination() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-4 sm:gap-3">
      <Button variant="ghost" size="sm" className="text-slate-300" disabled>
        <ChevronLeft className="mr-1.5 h-4 w-4 shrink-0" />
        Previous
      </Button>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {pages.map((page) =>
          page === 'ellipsis' ? (
            <span key={page} className="px-3 py-2 text-sm text-[var(--app-text)]">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={
                page === 1
                  ? 'rounded-lg bg-brand-700 px-3 py-2 text-sm font-medium text-white'
                  : 'rounded-lg px-3 py-2 text-sm font-medium text-[var(--app-text)] transition hover:bg-black/5'
              }
            >
              {page}
            </button>
          ),
        )}
      </div>

      <Button variant="ghost" size="sm" className="text-[var(--app-text)]">
        Next
        <ChevronRight className="ml-1.5 h-4 w-4 shrink-0" />
      </Button>
    </div>
  )
}
