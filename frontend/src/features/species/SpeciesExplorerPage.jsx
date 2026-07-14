import SpeciesExplorerCard from '@/features/species/components/SpeciesExplorerCard'
import SpeciesExplorerFilters from '@/features/species/components/SpeciesExplorerFilters'
import SpeciesExplorerPagination from '@/features/species/components/SpeciesExplorerPagination'
import { speciesExplorerCount, speciesExplorerRecords } from '@/features/species/data/speciesExplorerData'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

export default function SpeciesExplorerPage() {
  return (
    <div className="space-y-8 pb-6">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Species' },
        ]}
      />
      <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)] xl:items-start">
        <aside>
          <SpeciesExplorerFilters />
        </aside>

        <section className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-semibold text-brand-700">{speciesExplorerCount} Species Found</p>
          </div>

          <div className="space-y-5">
            {speciesExplorerRecords.map((species) => (
              <SpeciesExplorerCard key={species.id} species={species} />
            ))}
          </div>

          <SpeciesExplorerPagination />
        </section>
      </div>
    </div>
  )
}
