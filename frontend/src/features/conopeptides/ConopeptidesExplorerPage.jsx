import { ChevronRight, Download } from 'lucide-react'

import ConopeptideLayout from '@/features/conopeptides/components/ConopeptideLayout'
import ConopeptidePagination from '@/features/conopeptides/components/ConopeptidePagination'
import ConopeptideSidebar from '@/features/conopeptides/components/ConopeptideSidebar'
import ConopeptideTableCard from '@/features/conopeptides/components/ConopeptideTableCard'
import { useConopeptidesExplorerController } from '@/features/conopeptides/controllers/useConopeptidesExplorerController'

export default function ConopeptidesExplorerPage() {
  const {
    breadcrumbs,
    filters,
    filterOptions,
    handleFilterChange,
    handlePageChange,
    handleRowKeyDown,
    meta,
    openConopeptide,
    pagination,
    resultCount,
    rows,
  } = useConopeptidesExplorerController()

  return (
    <ConopeptideLayout
      breadcrumbs={breadcrumbs}
      title={meta.title}
      subtitle={meta.subtitle}
      sidebar={
        <ConopeptideSidebar
          filters={filters}
          options={filterOptions}
          onFilterChange={handleFilterChange}
        />
      }
    >
      <ConopeptideTableCard
        title="Conopeptide Precursors"
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
          <table className="w-full min-w-[680px] border-separate border-spacing-0">
            <thead>
              <tr className="bg-brand-50/45 text-left text-[0.72rem] uppercase tracking-[0.16em] text-[var(--app-muted)]">
                {[
                  'Accession',
                  'Species',
                  'Gene Superfamily',
                  'Framework',
                  'Matched Toxin',
                  '',
                ].map((column) => (
                  <th
                    key={column || 'action'}
                    className="border-b border-[var(--app-border)] px-4 py-3 font-semibold"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--app-text)]">
              {rows.map((row) => (
                <tr
                  key={row.accession}
                  role="button"
                  tabIndex={0}
                  onClick={() => openConopeptide(row.accession)}
                  onKeyDown={(event) => handleRowKeyDown(event, row.accession)}
                  className="cursor-pointer transition even:bg-[#fcfcf8] hover:bg-brand-50/60 focus:outline-none focus-visible:bg-brand-50/60"
                >
                  <td className="border-b border-[var(--app-border)] px-4 py-4 font-semibold text-brand-700">
                    {row.accession}
                  </td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4 italic">{row.species}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.superfamily}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.framework}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.matchedToxin}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4 text-right">
                    <ChevronRight className="ml-auto h-5 w-5 text-[var(--app-muted)]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ConopeptideTableCard>

      <div className="pt-2">
        <ConopeptidePagination pagination={pagination} onPageChange={handlePageChange} loading={false} />
      </div>
    </ConopeptideLayout>
  )
}
