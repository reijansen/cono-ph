import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Card from '@/components/ui/Card'
import { useSpeciesDetail } from '@/hooks/useSpecies'
import { cn } from '@/utils/cn'

const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Conopeptides', value: 'conopeptides' },
  { label: 'Specimens', value: 'specimens' },
  { label: 'Publications', value: 'publications' },
]

function InfoList({ items }) {
  return (
    <dl className="space-y-0">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            'grid grid-cols-1 gap-2 py-5 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:gap-4',
            index !== items.length - 1 && 'border-b border-[#e6e1dc]',
          )}
        >
          <dt className="text-[1.05rem] font-semibold text-[var(--app-muted)]">{item.label}</dt>
          <dd className="text-[1.03rem] leading-7 text-[var(--app-text)] sm:text-right">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function OverviewTab({ species }) {
  if (!species) return null

  const infoItems = [
    { label: 'Scientific Name', value: species.scientific_name || 'N/A' },
    { label: 'Common Name', value: species.common_name || 'N/A' },
    { label: 'Related Publications', value: species.num_related_publications || 0 },
  ]

  if (species.created_at) {
    infoItems.push({
      label: 'Date Added',
      value: new Date(species.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    })
  }

  return (
    <div className="space-y-7">
      <div className="space-y-4">
        <h2 className="font-serif text-[clamp(2.8rem,4vw,4.2rem)] leading-[0.95] text-black">
          Overview
        </h2>
        <p className="max-w-4xl text-[1.05rem] leading-7 text-[var(--app-muted)]">
          General information about this species.
        </p>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="rounded-t-2xl bg-brand-700 px-5 py-4 text-center text-[1.05rem] font-semibold text-white">
          Species Information
        </div>
        <div className="overflow-hidden rounded-b-[1.15rem] px-5 py-2">
          <InfoList items={infoItems} />
        </div>
      </Card>
    </div>
  )
}

function ComingSoonTab({ label }) {
  return (
    <div className="space-y-7">
      <div className="space-y-4">
        <h2 className="font-serif text-[clamp(2.8rem,4vw,4.2rem)] leading-[0.95] text-black">
          {label}
        </h2>
        <p className="max-w-4xl text-[1.05rem] leading-7 text-[var(--app-muted)]">
          This section is coming soon. We're working on bringing you more detailed information about {label.toLowerCase()}.
        </p>
      </div>

      <Card className="p-8 text-center">
        <p className="text-[var(--app-muted)]">Content coming soon...</p>
      </Card>
    </div>
  )
}

export default function SpeciesDetailPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const { species, loading, error } = useSpeciesDetail(Number(id))

  if (loading) {
    return (
      <div className="space-y-8 pb-6">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Species', to: '/species' },
            { label: 'Loading...' },
          ]}
        />
        <div className="text-center">
          <p className="text-[var(--app-muted)]">Loading species details...</p>
        </div>
      </div>
    )
  }

  if (error || !species) {
    return (
      <div className="space-y-8 pb-6">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Species', to: '/species' },
            { label: 'Error' },
          ]}
        />
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error || 'Species not found'}</p>
          <Link to="/species" className="text-sm text-red-600 underline hover:text-red-800">
            Back to Species List
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-6">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Species', to: '/species' },
          { label: species.scientific_name },
        ]}
      />

      <section className="space-y-2">
        <h1 className="text-[clamp(3.25rem,4.6vw,4.6rem)] leading-none text-black">
          <span className="font-serif italic">{species.scientific_name}</span>
        </h1>
        {species.common_name && (
          <p className="max-w-3xl text-sm leading-6 text-[var(--app-muted)] sm:text-base">
            {species.common_name}
          </p>
        )}
      </section>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-[#e6e1dc] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'px-4 py-3 text-sm font-medium whitespace-nowrap transition border-b-2 -mb-[2px]',
              activeTab === tab.value
                ? 'text-brand-700 border-brand-700'
                : 'text-[var(--app-muted)] border-transparent hover:text-[var(--app-text)]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <section>
        {activeTab === 'overview' && <OverviewTab species={species} />}
        {activeTab === 'conopeptides' && <ComingSoonTab label="Conopeptides" />}
        {activeTab === 'specimens' && <ComingSoonTab label="Specimens" />}
        {activeTab === 'publications' && <ComingSoonTab label="Publications" />}
      </section>
    </div>
  )
}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end xl:flex-1 xl:flex-nowrap">
            <SearchInput placeholder="Search by.." className="w-full lg:max-w-[328px]" />

            <SelectWithChevron value={year} onChange={(event) => setYear(event.target.value)}>
              <option>All Years</option>
              <option>2020</option>
              <option>2021</option>
              <option>2022</option>
            </SelectWithChevron>

            <SelectWithChevron value={journal} onChange={(event) => setJournal(event.target.value)}>
              <option>All Journals</option>
              <option>Marine Drugs</option>
              <option>Frontiers in Marine Science</option>
              <option>Journal of Proteomics</option>
            </SelectWithChevron>
          </div>

          <div className="inline-flex items-stretch self-start overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white shadow-sm xl:self-auto">
            <button
              type="button"
              className="px-5 py-3 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
              onClick={() => {
                // mock-only action
              }}
            >
              Apply Filter
            </button>
            <div className="w-px bg-[var(--app-border)]" />
            <button
              type="button"
              className="px-5 py-3 text-sm font-medium text-[var(--app-muted)] transition hover:bg-brand-50 hover:text-brand-700"
              onClick={() => {
                setYear('All Years')
                setJournal('All Journals')
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex justify-start">
          <Button variant="outline" size="md" className="min-w-[106px] gap-2 px-5">
            Export
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        {species.publications.map((publication) => (
          <PublicationCard key={publication.doi} publication={publication} />
        ))}
      </div>

      <Pagination page={page} totalPages={4} onPageChange={setPage} />
    </div>
  )
}

export default function SpeciesDetailPage() {
  const { speciesId } = useParams()
  const species = useMemo(() => {
    return (
      speciesDetailRecords.find((record) => record.speciesId === speciesId) ??
      speciesDetailRecords.find((record) => record.speciesId === defaultSpeciesDetailId)
    )
  }, [speciesId])

  const [activeTab, setActiveTab] = useState('overview')

  if (!species) {
    return null
  }

  return (
    <div className="space-y-8 pb-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Species', to: '/species' },
          { label: species.species.scientificName },
        ]}
      />

      <section className="grid gap-8 lg:grid-cols-[378px_minmax(0,1fr)] lg:items-start">
        <div className="overflow-hidden rounded-2xl bg-black">
          <img
            src={species.species.image}
            alt={species.species.imageAlt}
            className="h-[265px] w-full object-contain object-center"
          />
        </div>

        <div className="pt-1">
          <h1 className="font-serif text-[clamp(3rem,5vw,5.1rem)] leading-[0.95] text-black">
            {species.species.scientificName}
          </h1>
          <p className="mt-3 text-[clamp(1.45rem,2vw,2rem)] leading-none text-brand-700">
            {species.species.commonName}
          </p>
          <p className="mt-2 text-[1rem] text-[var(--app-muted)]">
            Subgenus: <span className="text-[var(--app-text)]">{species.species.subgenus}</span>
          </p>

          <div className="mt-8 border-t border-brand-300">
            <div className="grid divide-x divide-brand-300 sm:grid-cols-2 xl:grid-cols-5">
              {species.statistics.map((stat) => (
                <StatItem key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-300">
        <div className="flex flex-wrap gap-4 sm:gap-12">
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'pb-4 text-[1.15rem] font-medium transition',
                  isActive ? 'text-brand-700' : 'text-brand-700/80 hover:text-brand-700',
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </section>

      {activeTab === 'overview' ? (
        <div className="space-y-8">
          <section className="grid gap-8 lg:grid-cols-3">
            <SectionCard title="Taxonomy and Biological Information">
              <InfoList
                items={[
                  { label: 'Scientific Name', value: species.taxonomy.scientificName },
                  { label: 'Common Name', value: species.taxonomy.commonName },
                  { label: 'Organisms Diet', value: species.taxonomy.organismsDiet },
                  { label: 'Subgenus', value: species.taxonomy.subgenus },
                  { label: 'Anatomical Sample', value: species.taxonomy.anatomicalSample },
                  { label: 'Tissue Source', value: species.taxonomy.tissueSource },
                ]}
              />
            </SectionCard>

            <SectionCard title="Collection Information">
              <InfoList
                items={[
                  { label: 'Province', value: species.collection.province },
                  { label: 'Municipality', value: species.collection.municipality },
                  { label: 'Philippine Standard Geographic Code (PSGC)', value: species.collection.psgc },
                  { label: 'Specimen Repository', value: species.collection.specimenRepository },
                ]}
              />
            </SectionCard>

            <SectionCard title="Molecular & Sequencing Information">
              <InfoList
                items={[
                  { label: 'Specimens Sequenced', value: species.molecular.specimensSequenced },
                  { label: 'Total Conopeptides', value: species.molecular.totalConopeptides },
                  { label: 'Total Gene Superfamilies', value: species.molecular.totalGeneSuperfamilies },
                  { label: 'Sequencing Platform', value: species.molecular.sequencingPlatform },
                  { label: 'COI Marker', value: species.molecular.coiMarker },
                  {
                    label: 'Raw Data Availability in NCBI SRA',
                    value: species.molecular.rawDataAvailable,
                  },
                  { label: 'SRA Accession', value: species.molecular.sraAccession },
                ]}
              />
            </SectionCard>
          </section>

          <section>
            <Card className="!p-0 overflow-hidden">
              <div className="rounded-t-2xl bg-brand-700 px-5 py-4 text-[1.05rem] font-semibold text-white">
                Publication Information
              </div>

              <div className="grid gap-8 px-5 py-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="space-y-8">
                  <div>
                    <p className="text-[1.05rem] font-semibold text-[var(--app-muted)]">DOI</p>
                    <a
                      href={species.publication.doi}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex break-all text-[1rem] text-[var(--app-muted)] underline underline-offset-2 transition hover:text-brand-700"
                    >
                      {species.publication.doi}
                    </a>
                  </div>

                  <div>
                    <p className="text-[1.05rem] font-semibold text-[var(--app-muted)]">Authors</p>
                    <p className="mt-1 max-w-[34rem] text-[1rem] leading-7 text-[var(--app-muted)]">
                      {species.publication.authors}
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <p className="text-[1.05rem] font-semibold text-[var(--app-muted)]">Title of Paper</p>
                    <p className="mt-1 max-w-[48rem] text-[1rem] leading-7 text-[var(--app-muted)]">
                      {species.publication.title}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[1.05rem] font-semibold text-[var(--app-muted)]">
                        Associated Project
                      </p>
                      <p className="mt-1 text-[1rem] text-[var(--app-muted)]">
                        {species.publication.project}
                      </p>
                    </div>

                    <div className="flex items-end justify-start sm:justify-end">
                      <Button as="a" href={species.publication.doi} target="_blank" rel="noreferrer" className="gap-2 px-5">
                        View Publication
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </div>
      ) : activeTab === 'conopeptides' ? (
        <ConopeptidesTab species={species} />
      ) : activeTab === 'specimens' ? (
        <SpecimensTab species={species} />
      ) : activeTab === 'publications' ? (
        <PublicationsTab species={species} />
      ) : (
        <Card className="border-dashed bg-white/80 text-center text-[var(--app-muted)]">
          This section is not implemented yet.
        </Card>
      )}
    </div>
  )
}
