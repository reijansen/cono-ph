import { ChevronLeft, ChevronRight } from 'lucide-react'

import Button from '@/components/ui/Button'

function buildPages(currentPage, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)

  const pages = [1]
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)
  if (start > 2) pages.push('ellipsis-start')
  for (let page = start; page <= end; page += 1) pages.push(page)
  if (end < totalPages - 1) pages.push('ellipsis-end')
  pages.push(totalPages)
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
        {pages.map((pageNumber) => pageNumber.toString().startsWith('ellipsis') ? (
          <span key={pageNumber} className="btn btn-sm join-item cursor-default border-[var(--app-border)] bg-white text-[var(--app-muted)]">...</span>
        ) : (
          <button key={pageNumber} type="button" onClick={() => onPageChange?.(pageNumber)} className={pageNumber === page ? 'btn btn-sm join-item border-brand-700 bg-brand-700 text-white hover:border-brand-700 hover:bg-brand-700' : 'btn btn-sm join-item border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-brand-200 hover:bg-brand-50'}>{pageNumber}</button>
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
