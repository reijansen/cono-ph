import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Card from '@/components/ui/Card'
import SpeciesExplorerCard from '@/features/species/components/SpeciesExplorerCard'
import SpeciesExplorerFilters from '@/features/species/components/SpeciesExplorerFilters'
import SpeciesExplorerPagination from '@/features/species/components/SpeciesExplorerPagination'
import { useSpeciesExplorerController } from '@/features/species/controllers/useSpeciesExplorerController'

export default function SpeciesExplorerPage() {
  const {
    breadcrumbs,
    filters,
    filterOptions,
    handleFilterChange,
    handlePageChange,
    pagination,
    records,
    resultCount,
  } = useSpeciesExplorerController()

  return (
    <div className="space-y-2 pb-6">
      <Breadcrumbs
        items={breadcrumbs}
      />
      <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)] xl:items-start">
        <aside>
          <SpeciesExplorerFilters
            filters={filters}
            options={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </aside>

        <section className="space-y-5">
          <Card className="space-y-5 border-transparent p-4 shadow-none sm:p-5 lg:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[1.55rem] leading-none text-[var(--app-text)]">Species Records</h2>
              <p className="self-start rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                {resultCount} Species Found
              </p>
            </div>

            <div className="space-y-5">
              {records.map((species) => (
                <SpeciesExplorerCard key={species.speciesId} species={species} />
              ))}
            </div>

          </Card>

          <SpeciesExplorerPagination pagination={pagination} onPageChange={handlePageChange} />
        </section>
      </div>
    </div>
  )
}
