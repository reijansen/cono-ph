import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import { cn } from '@/utils/cn'

const statusStyles = {
  Published: 'bg-brand-700 text-white ring-0',
  'Under Review': 'bg-[#c2bf1f] text-white ring-0',
  Unpublished: 'bg-slate-400 text-white ring-0',
}

export default function SpeciesExplorerCard({ species }) {
  return (
    <Card
      as={Link}
      to={`/species/${species.speciesId}`}
      className="group flex flex-col gap-4 overflow-hidden px-4 py-4 transition hover:border-brand-200 hover:shadow-md sm:px-5 sm:py-5 lg:flex-row lg:items-center lg:gap-6"
    >
      <div className="shrink-0">
        <div className="flex h-[164px] w-full items-center justify-center overflow-hidden rounded-[1.2rem] bg-black sm:h-[160px] lg:w-[230px]">
          <img
            src={species.image}
            alt={species.scientificName}
            className={cn(
              'h-full w-full object-contain',
              species.imagePosition === 'left center' && 'object-left',
              species.imagePosition === 'center center' && 'object-center',
              species.imagePosition === 'right center' && 'object-right',
            )}
          />
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-[clamp(1.6rem,2vw,2rem)] leading-none text-black">
              <span className="font-serif italic">{species.scientificName}</span>
            </h3>
            <p className="text-sm text-brand-700">{species.commonName}</p>
          </div>

          <Badge className={cn('shrink-0 px-4 py-1.5 text-sm font-semibold', statusStyles[species.status])}>
            {species.status}
          </Badge>
        </div>

        <div className="grid gap-1 text-sm text-[var(--app-muted)] sm:grid-cols-2 lg:grid-cols-1">
          <p>
            <span className="font-semibold text-brand-700">Class:</span> {species.className}
          </p>
          <p>
            <span className="font-semibold text-brand-700">Order:</span> {species.orderName}
          </p>
          <p>
            <span className="font-semibold text-brand-700">Family:</span> {species.familyName}
          </p>
          <p>
            <span className="font-semibold text-brand-700">Genus:</span> {species.genusName}
          </p>
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
