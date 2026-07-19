import { Download, ExternalLink } from 'lucide-react'

import Pagination from '@/components/ui/Pagination'
import PublicationLayout from '@/features/publications/components/PublicationLayout'
import PublicationSidebar from '@/features/publications/components/PublicationSidebar'
import PublicationTableCard from '@/features/publications/components/PublicationTableCard'
import { usePublicationsExplorerController } from '@/features/publications/controllers/usePublicationsExplorerController'

export default function PublicationsExplorerPage() {
  const {
    breadcrumbs,
    filters,
    filterOptions,
    handleFilterChange,
    handlePageChange,
    pagination,
    resultCount,
    rows,
  } = usePublicationsExplorerController()

  return (
    <PublicationLayout
      breadcrumbs={breadcrumbs}
      sidebar={
        <PublicationSidebar
          filters={filters}
          options={filterOptions}
          onFilterChange={handleFilterChange}
        />
      }
    >
      <PublicationTableCard
        title="Publication Records"
        action={
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-end">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
              {resultCount}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--app-text)] transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        }
      >
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <table className="w-full min-w-[820px] border-separate border-spacing-0">
            <thead>
              <tr className="bg-brand-50/45 text-left text-[0.72rem] uppercase tracking-[0.16em] text-[var(--app-muted)]">
                {[
                  'Publication',
                  'Year',
                  'Journal',
                  'Linked Records',
                  '',
                ].map((column) => (
                  <th key={column || 'action'} className="border-b border-[var(--app-border)] px-4 py-3 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--app-text)]">
              {rows.map((row) => (
                <tr key={row.id} className="transition even:bg-[#fcfcf8] hover:bg-brand-50/60">
                  <td className="max-w-[360px] border-b border-[var(--app-border)] px-4 py-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-[var(--app-text)]">{row.title}</p>
                      <p className="text-xs leading-5 text-[var(--app-muted)]">{row.authors}</p>
                      <p className="text-xs font-medium text-brand-700">{row.doi === 'Unavailable' ? 'DOI unavailable' : row.doi}</p>
                    </div>
                  </td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.year}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.journal}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">
                    <div className="space-y-1 text-xs text-[var(--app-muted)]">
                      <p>{row.linkedSpecies} species</p>
                      <p>{row.linkedConopeptides} conopeptides</p>
                      <p>{row.linkedBiomarkers} biomarkers</p>
                    </div>
                  </td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4 text-right">
                    {row.doi !== 'Unavailable' ? (
                      <a
                        href={`https://doi.org/${row.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--app-muted)] transition hover:bg-brand-50 hover:text-brand-700"
                        aria-label={`Open DOI for ${row.title}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PublicationTableCard>

      <div className="pt-2">
        <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
      </div>
    </PublicationLayout>
  )
}
