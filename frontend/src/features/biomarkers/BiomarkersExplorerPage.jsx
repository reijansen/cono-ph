import { ChevronRight, Download } from 'lucide-react'

import BiomarkerLayout from '@/features/biomarkers/components/BiomarkerLayout'
import BiomarkerPagination from '@/features/biomarkers/components/BiomarkerPagination'
import BiomarkerSidebar from '@/features/biomarkers/components/BiomarkerSidebar'
import BiomarkerTableCard from '@/features/biomarkers/components/BiomarkerTableCard'
import { useBiomarkersExplorerController } from '@/features/biomarkers/controllers/useBiomarkersExplorerController'

export default function BiomarkersExplorerPage() {
  const {
    breadcrumbs,
    filters,
    filterOptions,
    handleFilterChange,
    handlePageChange,
    handleRowKeyDown,
    meta,
    openBiomarker,
    pagination,
    resultCount,
    rows,
  } = useBiomarkersExplorerController()

  return (
    <BiomarkerLayout
      breadcrumbs={breadcrumbs}
      title={meta.title}
      subtitle={meta.subtitle}
      sidebar={
        <BiomarkerSidebar
          filters={filters}
          options={filterOptions}
          onFilterChange={handleFilterChange}
        />
      }
    >
      <BiomarkerTableCard
        title="Biomarker Records"
        resultCount={resultCount}
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--app-text)] transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        }
      >
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <table className="w-full min-w-[760px] border-separate border-spacing-0">
            <thead>
              <tr className="bg-brand-50/45 text-left text-[0.72rem] uppercase tracking-[0.16em] text-[var(--app-muted)]">
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
              {rows.map((row) => (
                <tr
                  key={row.biomarkerId}
                  role="button"
                  tabIndex={0}
                  onClick={() => openBiomarker(row.biomarkerId)}
                  onKeyDown={(event) => handleRowKeyDown(event, row.biomarkerId)}
                  className="cursor-pointer transition even:bg-[#fcfcf8] hover:bg-brand-50/50 focus:outline-none focus-visible:bg-brand-50/50"
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
      </BiomarkerTableCard>

      <div className="pt-2">
        <BiomarkerPagination pagination={pagination} onPageChange={handlePageChange} loading={false} />
      </div>
    </BiomarkerLayout>
  )
}
