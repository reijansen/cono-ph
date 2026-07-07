import { useMemo, useState } from 'react'
import { ArrowUpRight, ChevronDown, Download } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import SearchInput from '@/components/ui/SearchInput'
import { cn } from '@/utils/cn'

import { defaultSpeciesDetailId, speciesDetailRecords } from '@/features/species/data/speciesDetailData'

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

function SectionCard({ title, children, className }) {
  return (
    <Card className={cn('!p-0 overflow-hidden', className)}>
      <div className="rounded-t-2xl bg-brand-700 px-5 py-4 text-center text-[1.05rem] font-semibold text-white">
        {title}
      </div>
      <div className="overflow-hidden rounded-b-[1.15rem] px-5 py-2">{children}</div>
    </Card>
  )
}

function StatItem({ value, label }) {
  return (
    <div className="flex min-h-[100px] flex-col items-center justify-center px-3 py-4 text-center">
      <div className="text-[2rem] font-semibold leading-none text-brand-700">{value}</div>
      <div className="mt-3 max-w-[10rem] text-[1rem] leading-6 text-[var(--app-muted)]">{label}</div>
    </div>
  )
}

function FilterSelect({ value, onChange, children, className }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className="h-11 w-full min-w-[246px] appearance-none rounded-2xl border border-[var(--app-border)] bg-white px-4 pr-12 text-sm text-[var(--app-text)] outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
      >
        {children}
      </select>
      <ChevronDown
        className={cn(
          'pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-muted)] transition-transform duration-200',
          isOpen && 'rotate-180',
        )}
      />
    </div>
  )
}

function ConopeptidesTab({ species }) {
  const totalCount = species.statistics[0]?.value ?? species.conopeptides.length
  const [page, setPage] = useState(1)
  const [geneSuperfamily, setGeneSuperfamily] = useState('All Superfamilies')
  const [cysteineFramework, setCysteineFramework] = useState('All Cysteine Frameworks')

  return (
    <div className="space-y-7">
      <div className="space-y-4">
        <h2 className="font-serif text-[clamp(2.8rem,4vw,4.2rem)] leading-[0.95] text-black">
          Conopeptides <span className="text-brand-700">({totalCount})</span>
        </h2>
        <p className="max-w-4xl text-[1.05rem] leading-7 text-[var(--app-muted)]">
          Predicted conopeptides identified from transcriptomic data for this species.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end xl:flex-1">
          <SearchInput placeholder="Search by.." className="w-full lg:max-w-[328px]" />

          <FilterSelect
              value={geneSuperfamily}
              onChange={(event) => setGeneSuperfamily(event.target.value)}
          >
              <option>All Superfamilies</option>
              <option>M</option>
              <option>O1</option>
              <option>T</option>
              <option>A</option>
          </FilterSelect>

          <FilterSelect
              value={cysteineFramework}
              onChange={(event) => setCysteineFramework(event.target.value)}
          >
              <option>All Cysteine Frameworks</option>
              <option>Framework III</option>
              <option>Framework VI/VII</option>
              <option>Framework XII</option>
          </FilterSelect>
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
              setGeneSuperfamily('All Superfamilies')
              setCysteineFramework('All Cysteine Frameworks')
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

      <div className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full border-collapse">
            <thead className="bg-brand-50">
              <tr className="text-left text-sm font-semibold text-brand-800">
                <th className="px-5 py-4">Conopeptide ID</th>
                <th className="px-5 py-4">Gene Superfamily</th>
                <th className="px-5 py-4">Framework</th>
                <th className="px-5 py-4">Specimen ID</th>
                <th className="px-5 py-4">Publication</th>
              </tr>
            </thead>
            <tbody>
              {species.conopeptides.map((row) => (
                <tr key={row.conopeptideId} className="border-t border-[var(--app-border)] transition hover:bg-brand-50/60">
                  <td className="px-5 py-4">
                    <Button
                      as={Link}
                      to={`/conopeptides/${row.conopeptideId}`}
                      variant="ghost"
                    className="h-auto justify-start p-0 text-left text-[1.02rem] font-semibold text-brand-700"
                  >
                      {row.conopeptideId}
                    </Button>
                  </td>
                  <td className="px-5 py-4 text-[var(--app-text)]">{row.geneSuperfamily}</td>
                  <td className="px-5 py-4 text-[var(--app-text)]">{row.framework}</td>
                  <td className="px-5 py-4 text-[var(--app-text)]">{row.specimenId}</td>
                  <td className="px-5 py-4 text-[var(--app-text)]">{row.publication}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      ) : (
        <Card className="border-dashed bg-white/80 text-center text-[var(--app-muted)]">
          This section is not implemented yet.
        </Card>
      )}
    </div>
  )
}
