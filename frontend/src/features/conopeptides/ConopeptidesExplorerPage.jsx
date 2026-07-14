import { ChevronRight, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import ConopeptideLayout from '@/features/conopeptides/components/ConopeptideLayout'
import ConopeptidePagination from '@/features/conopeptides/components/ConopeptidePagination'
import ConopeptideSidebar from '@/features/conopeptides/components/ConopeptideSidebar'
import ConopeptideTableCard from '@/features/conopeptides/components/ConopeptideTableCard'
import {
  conopeptideExplorerBreadcrumbs,
  conopeptideExplorerMeta,
  conopeptideExplorerRows,
  conopeptideFilterOptions,
  conopeptidePagination,
} from '@/features/conopeptides/data/conopeptideMockData'

export default function ConopeptidesExplorerPage() {
  const navigate = useNavigate()

  return (
    <ConopeptideLayout
      breadcrumbs={conopeptideExplorerBreadcrumbs}
      title={conopeptideExplorerMeta.title}
      subtitle={conopeptideExplorerMeta.subtitle}
      sidebar={
        <ConopeptideSidebar
          filters={{
            search: '',
            project: 'All Projects',
            superfamily: 'All Superfamilies',
            province: 'All Provinces',
            municipality: 'All Municipalities',
            cysteineFramework: 'All Cysteine Frameworks',
            status: [],
            hasPredictedPeptide: 'all',
          }}
          options={conopeptideFilterOptions}
          onFilterChange={() => {}}
        />
      }
    >
      <ConopeptideTableCard
        title="Conopeptide Precursors"
        action={
          <div className="flex flex-col items-start gap-3 text-sm font-medium text-[var(--app-muted)] sm:flex-row sm:items-center">
            <span>3,671 results</span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-[var(--app-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--app-text)] transition hover:border-brand-300 hover:text-brand-700"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        }
      >
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <table className="w-full min-w-[760px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[var(--app-muted)]">
                {[
                  'Accession',
                  'Gene Superfamily',
                  'Cysteine Framework',
                  'Predicted Peptide',
                  'Matched Toxin',
                  'Species',
                  'Province',
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
              {conopeptideExplorerRows.map((row) => (
                <tr
                  key={row.accession}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/conopeptides/${row.accession}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`/conopeptides/${row.accession}`)
                    }
                  }}
                  className="cursor-pointer transition hover:bg-brand-50/50 focus:outline-none focus-visible:bg-brand-50/50"
                >
                  <td className="border-b border-[var(--app-border)] px-4 py-4 font-semibold text-brand-700">
                    {row.accession}
                  </td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.superfamily}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.framework}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.predictedPeptide}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.matchedToxin}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.species}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.province}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4 text-right">
                    <ChevronRight className="ml-auto h-5 w-5 text-[var(--app-muted)]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ConopeptidePagination pagination={conopeptidePagination} onPageChange={() => {}} loading={false} />
      </ConopeptideTableCard>
    </ConopeptideLayout>
  )
}
