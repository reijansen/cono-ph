import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '@/components/ui/Card'

/**
 * Species Explorer Card
 * Displays species information in a card format
 * Works with API data structure
 */
export default function SpeciesExplorerCard({ species }) {
  if (!species) return null

  const {
    id,
    scientific_name = '',
    common_name = '',
    num_related_publications = 0,
    created_at = '',
  } = species

  return (
    <Card
      as={Link}
      to={`/species/${id}`}
      className="group flex flex-col gap-4 overflow-hidden px-4 py-4 transition hover:border-brand-200 hover:shadow-md sm:px-5 sm:py-5 lg:flex-row lg:items-center lg:gap-6"
    >
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <h3 className="text-[clamp(1.3rem,2vw,1.8rem)] leading-tight text-black truncate">
              <span className="font-serif italic">{scientific_name}</span>
            </h3>
            {common_name && <p className="text-sm text-brand-700 truncate">{common_name}</p>}
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-brand-700 opacity-0 transition group-hover:opacity-100" />
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-[var(--app-muted)]">
          <div>
            <span className="font-semibold text-black">{num_related_publications}</span> Publications
          </div>
          {created_at && (
            <div className="text-xs">
              Added {new Date(created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
          <p>
            <span className="font-semibold text-brand-700">Subgenus:</span> {species.subgenus}
          </p>
          <p>
            <span className="font-semibold text-brand-700">Province:</span> {species.province}
          </p>
          <p>
            <span className="font-semibold text-brand-700">Conopeptide precursors:</span>{' '}
            {species.precursorsCount}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end self-stretch text-[var(--app-muted)] lg:w-8">
        <ChevronRight className="h-6 w-6 shrink-0 transition group-hover:translate-x-0.5 group-hover:text-black" />
      </div>
    </Card>
  )
}
