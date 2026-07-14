import { ChevronRight, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import BiomarkerLayout from '@/features/biomarkers/components/BiomarkerLayout'
import BiomarkerPagination from '@/features/biomarkers/components/BiomarkerPagination'
import BiomarkerSidebar from '@/features/biomarkers/components/BiomarkerSidebar'
import BiomarkerTableCard from '@/features/biomarkers/components/BiomarkerTableCard'
import {
  biomarkerExplorerBreadcrumbs,
  biomarkerExplorerInitialFilters,
  biomarkerExplorerMeta,
  biomarkerExplorerResultCount,
  biomarkerExplorerRows,
  biomarkerFilterOptions,
  biomarkerPagination,
} from '@/features/biomarkers/data/biomarkerMockData'

export default function BiomarkersExplorerPage() {
  const navigate = useNavigate()

  return (
    <BiomarkerLayout
      breadcrumbs={biomarkerExplorerBreadcrumbs}
      title={biomarkerExplorerMeta.title}
      subtitle={biomarkerExplorerMeta.subtitle}
      sidebar={
        <BiomarkerSidebar
          filters={biomarkerExplorerInitialFilters}
          options={biomarkerFilterOptions}
          onFilterChange={() => {}}
        />
      }
    >
      <BiomarkerTableCard
        title="Biomarker Records"
        resultCount={biomarkerExplorerResultCount}
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-[var(--app-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--app-text)] transition hover:border-brand-300 hover:text-brand-700"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        }
      >
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <table className="w-full min-w-[760px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[var(--app-muted)]">
                {[
                  'Biomarker ID',
                  'Marker Type',
                  'Species',
                  'Accession Number',
                  'Sequence Length',
                  'Province',
                  'Status',
                ].map((column) => (
                  <th key={column} className="border-b border-[var(--app-border)] px-4 py-3 font-semibold">
                    {column}
                  </th>
                ))}
                <th className="border-b border-[var(--app-border)] px-4 py-3 font-semibold" />
              </tr>
            </thead>

            <tbody className="text-sm text-[var(--app-text)]">
              {biomarkerExplorerRows.map((row) => (
                <tr
                  key={row.biomarkerId}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/biomarkers/${row.biomarkerId}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`/biomarkers/${row.biomarkerId}`)
                    }
                  }}
                  className="cursor-pointer transition hover:bg-brand-50/40 focus:outline-none focus-visible:bg-brand-50/40"
                >
                  <td className="border-b border-[var(--app-border)] px-4 py-4 font-semibold text-brand-700">
                    {row.biomarkerId}
                  </td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.markerType}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.species}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.accession}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.sequenceLength}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.province}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4">{row.status}</td>
                  <td className="border-b border-[var(--app-border)] px-4 py-4 text-right">
                    <ChevronRight className="ml-auto h-5 w-5 text-[var(--app-muted)]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <BiomarkerPagination pagination={biomarkerPagination} onPageChange={() => {}} loading={false} />
      </BiomarkerTableCard>
    </BiomarkerLayout>
  )
}
