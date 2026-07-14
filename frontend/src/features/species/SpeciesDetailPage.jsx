import { useMemo, useState } from 'react'
import { ArrowUpRight, Download } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import SearchInput from '@/components/ui/SearchInput'
import SelectWithChevron from '@/components/ui/SelectWithChevron'
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

function ConopeptidesTab({ species }) {
  const totalCount = species.statistics[0]?.value ?? species.conopeptides.length
  const [page, setPage] = useState(1)
  const [geneSuperfamily, setGeneSuperfamily] = useState('All Superfamilies')
  const [cysteineFramework, setCysteineFramework] = useState('All Cysteine Frameworks')

  return (
      <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="font-serif text-[clamp(2rem,3.6vw,3.1rem)] leading-[0.95] text-black">
          Conopeptides <span className="text-brand-700">({totalCount})</span>
        </h2>
        <p className="max-w-4xl text-[0.98rem] leading-7 text-[var(--app-muted)] sm:text-[1.05rem]">
          Predicted conopeptides identified from transcriptomic data for this species.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-4 xl:flex-1 xl:flex-row xl:flex-wrap xl:items-end">
            <SearchInput placeholder="Search by.." className="w-full lg:max-w-[328px]" />

            <SelectWithChevron
              value={geneSuperfamily}
              onChange={(event) => setGeneSuperfamily(event.target.value)}
            >
              <option>All Superfamilies</option>
              <option>M</option>
              <option>O1</option>
              <option>T</option>
              <option>A</option>
            </SelectWithChevron>

            <SelectWithChevron
              value={cysteineFramework}
              onChange={(event) => setCysteineFramework(event.target.value)}
            >
              <option>All Cysteine Frameworks</option>
              <option>Framework III</option>
              <option>Framework VI/VII</option>
              <option>Framework XII</option>
            </SelectWithChevron>
          </div>

          <div className="grid w-full grid-cols-2 self-start overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white shadow-sm sm:w-auto sm:inline-flex xl:self-auto">
            <button
              type="button"
              className="px-5 py-3 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
              onClick={() => {}}
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
          <Button variant="outline" size="md" className="w-full gap-2 px-5 sm:w-auto sm:min-w-[106px]">
            Export
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white shadow-sm">
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <table className="w-full min-w-[760px] border-collapse">
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
                <tr
                  key={row.conopeptideId}
                  className="border-t border-[var(--app-border)] transition hover:bg-brand-50/60"
                >
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

function SpecimensTab({ species }) {
  const totalCount = species.specimens.length
  const [page, setPage] = useState(1)
  const [province, setProvince] = useState('All Provinces')
  const [repository, setRepository] = useState('All Repositories')
  const [sequencingPlatform, setSequencingPlatform] = useState('All Platforms')

  return (
      <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="font-serif text-[clamp(2rem,3.6vw,3.1rem)] leading-[0.95] text-black">
          Specimens <span className="text-brand-700">({totalCount})</span>
        </h2>
        <p className="max-w-4xl text-[0.98rem] leading-7 text-[var(--app-muted)] sm:text-[1.05rem]">
          Individual specimen records collected for this species.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-4 xl:flex-1 xl:flex-row xl:flex-wrap xl:items-end">
            <SearchInput placeholder="Search by.." className="w-full lg:max-w-[328px]" />

            <SelectWithChevron value={province} onChange={(event) => setProvince(event.target.value)}>
              <option>All Provinces</option>
              <option>Cebu</option>
              <option>Bohol</option>
              <option>Palawan</option>
            </SelectWithChevron>

            <SelectWithChevron value={repository} onChange={(event) => setRepository(event.target.value)}>
              <option>All Repositories</option>
              <option>The Marine Science Institute (MSI)</option>
              <option>University Repository</option>
            </SelectWithChevron>

            <SelectWithChevron
              value={sequencingPlatform}
              onChange={(event) => setSequencingPlatform(event.target.value)}
            >
              <option>All Platforms</option>
              <option>Novaseq 6000</option>
              <option>Oxford Nanopore</option>
              <option>PacBio</option>
            </SelectWithChevron>
          </div>

          <div className="grid w-full grid-cols-2 self-start overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white shadow-sm sm:w-auto sm:inline-flex xl:self-auto">
            <button
              type="button"
              className="px-5 py-3 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
              onClick={() => {}}
            >
              Apply Filter
            </button>
            <div className="w-px bg-[var(--app-border)]" />
            <button
              type="button"
              className="px-5 py-3 text-sm font-medium text-[var(--app-muted)] transition hover:bg-brand-50 hover:text-brand-700"
              onClick={() => {
                setProvince('All Provinces')
                setRepository('All Repositories')
                setSequencingPlatform('All Platforms')
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex justify-start">
          <Button variant="outline" size="md" className="w-full gap-2 px-5 sm:w-auto sm:min-w-[106px]">
            Export
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white shadow-sm">
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <table className="w-full min-w-[900px] border-collapse">
            <thead className="bg-brand-50">
              <tr className="text-left text-sm font-semibold text-brand-800">
                <th className="px-5 py-4">Specimen ID</th>
                <th className="px-5 py-4">Author</th>
                <th className="px-5 py-4">Repository</th>
                <th className="px-5 py-4">Province</th>
                <th className="px-5 py-4">Tissue Source</th>
                <th className="px-5 py-4">Sequencing Platform</th>
                <th className="px-5 py-4">Total Conopeptide Sequences</th>
              </tr>
            </thead>
            <tbody>
              {species.specimens.map((specimen) => (
                <tr
                  key={specimen.specimenId}
                  className="border-t border-[var(--app-border)] transition hover:bg-brand-50/60"
                >
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="whitespace-nowrap text-[1.02rem] font-semibold text-brand-700">
                          {specimen.specimenId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top text-[var(--app-text)]">{specimen.author}</td>
                  <td className="px-5 py-4 align-top text-[var(--app-text)]">{specimen.repository}</td>
                  <td className="px-5 py-4 align-top text-[var(--app-text)]">{specimen.province}</td>
                  <td className="px-5 py-4 align-top text-[var(--app-text)]">{specimen.tissueSource}</td>
                  <td className="px-5 py-4 align-top text-[var(--app-text)]">{specimen.sequencingPlatform}</td>
                  <td className="px-5 py-4 align-top text-[var(--app-text)]">
                    {specimen.totalConopeptideSequences}
                  </td>
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

function PublicationCard({ publication }) {
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="space-y-4 px-5 py-5 lg:border-r lg:border-[var(--app-border)]">
          <h3 className="text-[1.15rem] font-semibold leading-8 text-black sm:text-[1.35rem]">
            {publication.title}
          </h3>
          <p className="max-w-4xl text-[1rem] leading-7 text-[var(--app-muted)]">{publication.authors}</p>
          <div className="flex flex-wrap gap-3 text-sm text-[var(--app-muted)]">
            <span className="font-medium text-brand-700">{publication.journal}</span>
            <span>•</span>
            <span>{publication.year}</span>
          </div>
        </div>

        <div className="grid gap-5 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-1 lg:items-center">
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-4 text-sm">
            <div className="contents">
              <dt className="font-semibold text-brand-700">DOI</dt>
              <dd className="break-all text-[var(--app-muted)]">
                <a
                  href={`https://doi.org/${publication.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 transition hover:text-brand-700"
                >
                  https://doi.org/{publication.doi}
                </a>
              </dd>
            </div>
            <div className="contents">
              <dt className="font-semibold text-brand-700">Associated Project</dt>
              <dd className="text-[var(--app-muted)]">{publication.project}</dd>
            </div>
            <div className="contents">
              <dt className="font-semibold text-brand-700">Linked Conopeptides</dt>
              <dd className="text-[var(--app-muted)]">{publication.linkedConopeptidesCount}</dd>
            </div>
          </dl>

          <div className="flex items-end justify-start sm:justify-end lg:justify-start">
            <Button
              as="a"
              href={`https://doi.org/${publication.doi}`}
              target="_blank"
              rel="noreferrer"
              className="gap-2 px-5"
            >
              View Publication
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function PublicationsTab({ species }) {
  const totalCount = species.publications.length
  const [page, setPage] = useState(1)
  const [year, setYear] = useState('All Years')
  const [journal, setJournal] = useState('All Journals')

  return (
      <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="font-serif text-[clamp(2rem,3.6vw,3.1rem)] leading-[0.95] text-black">
          Publications <span className="text-brand-700">({totalCount})</span>
        </h2>
        <p className="max-w-4xl text-[0.98rem] leading-7 text-[var(--app-muted)] sm:text-[1.05rem]">
          Reference papers and related studies associated with this species.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-4 xl:flex-1 xl:flex-row xl:flex-wrap xl:items-end">
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

          <div className="grid w-full grid-cols-2 self-start overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white shadow-sm sm:w-auto sm:inline-flex xl:self-auto">
            <button
              type="button"
              className="px-5 py-3 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
              onClick={() => {}}
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
          <Button variant="outline" size="md" className="w-full gap-2 px-5 sm:w-auto sm:min-w-[106px]">
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

      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)] xl:items-start">
        <div className="overflow-hidden rounded-2xl bg-black">
          <img
            src={species.species.image}
            alt={species.species.imageAlt}
            className="h-[265px] w-full object-contain object-center"
          />
        </div>

        <div className="pt-1">
          <h1 className="font-serif text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.95] text-black">
            {species.species.scientificName}
          </h1>
          <p className="mt-3 text-[clamp(1.1rem,1.8vw,1.5rem)] leading-none text-brand-700">
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
        <div className="flex flex-wrap gap-x-5 gap-y-3 sm:gap-x-10">
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'pb-4 text-[1rem] font-medium transition sm:text-[1.08rem]',
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
          <section className="grid gap-6 lg:grid-cols-3">
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
              <div className="rounded-t-2xl bg-brand-700 px-5 py-4 text-[1rem] font-semibold text-white sm:text-[1.05rem]">
                Publication Information
              </div>

              <div className="grid gap-8 px-5 py-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
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
                      <Button
                        as="a"
                        href={species.publication.doi}
                        target="_blank"
                        rel="noreferrer"
                        className="gap-2 px-5"
                      >
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
