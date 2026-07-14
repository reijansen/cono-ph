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

      <section className="space-y-2">
        <h1 className="text-[clamp(2.4rem,4vw,3.5rem)] leading-none text-black">
          Species Explorer
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-[var(--app-muted)] sm:text-base">
          Browse and explore Philippine cone snail species and specimen records.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
        <aside>
          <SpeciesExplorerFilters />
        </aside>

        <section className="space-y-5">
          <div className="flex items-center justify-between">
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
