import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Download } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import SearchInput from '@/components/ui/SearchInput'
import SelectWithChevron from '@/components/ui/SelectWithChevron'
import { cn } from '@/utils/cn'
import { fetchSpeciesDetail } from '@/services/catalogService'

import speciesShellImage from '@/assets/HomeShell.png'

const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Conopeptides', value: 'conopeptides' },
  { label: 'Specimens', value: 'specimens' },
  { label: 'Publications', value: 'publications' },
]

const tabPageSize = 5

function InfoList({ items }) {
  return (
    <dl className="space-y-0">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            'grid grid-cols-1 gap-1 py-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:gap-4',
            index !== items.length - 1 && 'border-b border-[#e6e1dc]',
          )}
        >
          <dt className="text-[0.9rem] font-semibold text-[var(--app-muted)]">{item.label}</dt>
          <dd className="text-[0.98rem] leading-7 text-[var(--app-text)] sm:text-right">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function SectionCard({ title, children, className }) {
  return (
    <Card className={cn('!p-0 overflow-hidden', className)}>
      <div className="border-b border-[var(--app-border)] bg-white px-5 py-4 text-[1rem] font-semibold text-brand-700">
        {title}
      </div>
      <div className="overflow-hidden px-5 py-1">{children}</div>
    </Card>
  )
}

function StatItem({ value, label }) {
  return (
    <div className="join-item flex min-h-[104px] min-w-0 flex-1 basis-0 flex-col items-center justify-center border-b border-brand-300 bg-white px-3 py-4 text-center last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0 xl:px-4">
      <div className="max-w-full break-words text-[clamp(1.15rem,1.9vw,1.65rem)] font-semibold leading-tight text-brand-700">
        {value}
      </div>
      <div className="mt-2 max-w-full text-[0.85rem] leading-5 text-[var(--app-muted)] sm:max-w-[8.5rem]">
        {label}
      </div>
    </div>
  )
}

function valueOrUnavailable(...values) {
  const value = values.find((item) => String(item ?? '').trim())
  return value == null ? 'Unavailable' : String(value)
}

function normalizeText(value) {
  return String(value ?? '').trim().toLowerCase()
}

function uniqueSorted(values) {
  return Array.from(new Set(values.map((value) => String(value ?? '').trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  )
}

function matchesSearch(search, values) {
  const term = normalizeText(search)
  if (!term) return true
  return values.some((value) => normalizeText(value).includes(term))
}

function paginateRows(rows, page, pageSize = tabPageSize) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  return {
    page: safePage,
    totalPages,
    rows: rows.slice(start, start + pageSize),
  }
}

function firstAuthorSurname(authors) {
  const firstAuthor = String(authors ?? '').split(',')[0]?.trim()
  if (!firstAuthor) return 'Unavailable'
  const parts = firstAuthor.split(/\s+/).filter(Boolean)
  return parts.at(-1) || firstAuthor
}

function visibleHeaderStats(statistics = []) {
  const hiddenLabels = new Set(['Raw Data in NCBI SRA'])
  return statistics.filter((stat) => !hiddenLabels.has(stat.label))
}

function ConopeptidesTab({ species }) {
  const conopeptides = Array.isArray(species.conopeptides) ? species.conopeptides : []
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [geneSuperfamily, setGeneSuperfamily] = useState('All Superfamilies')
  const [cysteineFramework, setCysteineFramework] = useState('All Cysteine Frameworks')

  const geneSuperfamilyOptions = useMemo(
    () => uniqueSorted(conopeptides.map((row) => row.geneSuperfamily ?? row.superfamily)),
    [conopeptides],
  )
  const frameworkOptions = useMemo(
    () => uniqueSorted(conopeptides.map((row) => row.framework ?? row.cysteineFramework)),
    [conopeptides],
  )
  const filteredRows = useMemo(() => {
    return conopeptides.filter((row) => {
      if (geneSuperfamily !== 'All Superfamilies' && row.geneSuperfamily !== geneSuperfamily && row.superfamily !== geneSuperfamily) {
        return false
      }
      if (
        cysteineFramework !== 'All Cysteine Frameworks' &&
        row.framework !== cysteineFramework &&
        row.cysteineFramework !== cysteineFramework
      ) {
        return false
      }

      return matchesSearch(search, [
        row.conopeptideId,
        row.geneSuperfamily,
        row.superfamily,
        row.framework,
        row.specimenId,
        row.matchedToxin,
        row.percentSimilarity,
      ])
    })
  }, [conopeptides, geneSuperfamily, cysteineFramework, search])

  const { page: currentPage, totalPages, rows } = useMemo(
    () => paginateRows(filteredRows, page),
    [filteredRows, page],
  )

  useEffect(() => {
    setPage(1)
  }, [search, geneSuperfamily, cysteineFramework])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="font-serif text-[clamp(2rem,3.6vw,3.1rem)] leading-[0.95] text-black">
          Conopeptides <span className="text-brand-700">({filteredRows.length})</span>
        </h2>
        <p className="max-w-4xl text-[0.98rem] leading-7 text-[var(--app-muted)] sm:text-[1.05rem]">
          Predicted conopeptides identified from transcriptomic data for this species.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-4 xl:flex-1 xl:flex-row xl:flex-wrap xl:items-end">
            <SearchInput
              placeholder="Search by.."
              className="w-full lg:max-w-[328px]"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  setPage(1)
                }
              }}
            />

            <SelectWithChevron
              value={geneSuperfamily}
              onChange={(event) => setGeneSuperfamily(event.target.value)}
            >
              <option>All Superfamilies</option>
              {geneSuperfamilyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>

            <SelectWithChevron
              value={cysteineFramework}
              onChange={(event) => setCysteineFramework(event.target.value)}
            >
              <option>All Cysteine Frameworks</option>
              {frameworkOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </div>

          <div className="grid w-full grid-cols-2 self-start overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white shadow-sm sm:w-auto sm:inline-flex xl:self-auto">
            <button
              type="button"
              className="px-5 py-3 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
              onClick={() => setPage(1)}
            >
              Apply Filter
            </button>
            <div className="w-px bg-[var(--app-border)]" />
            <button
              type="button"
              className="px-5 py-3 text-sm font-medium text-[var(--app-muted)] transition hover:bg-brand-50 hover:text-brand-700"
              onClick={() => {
                setSearch('')
                setGeneSuperfamily('All Superfamilies')
                setCysteineFramework('All Cysteine Frameworks')
                setPage(1)
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
                <th className="px-5 py-4">Matched Toxin</th>
                <th className="px-5 py-4">Percent Similarity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
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
                  <td className="px-5 py-4 text-[var(--app-text)]">
                    {valueOrUnavailable(row.matchedToxin, row.matched_toxin)}
                  </td>
                  <td className="px-5 py-4 text-[var(--app-text)]">
                    {valueOrUnavailable(row.percentSimilarity, row.percent_similarity, row.sourcePercentSimilarity, row.source_percent_similarity)}
                  </td>
                </tr>
              ))}
              {!rows.length ? (
                <tr>
                  <td className="px-5 py-8 text-center text-[var(--app-muted)]" colSpan={6}>
                    No conopeptides matched your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

function SpecimensTab({ species }) {
  const specimens = Array.isArray(species.specimens) ? species.specimens : []
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [province, setProvince] = useState('All Provinces')
  const [repository, setRepository] = useState('All Repositories')
  const [sequencingPlatform, setSequencingPlatform] = useState('All Platforms')

  const provinceOptions = useMemo(() => uniqueSorted(specimens.map((specimen) => specimen.province)), [specimens])
  const repositoryOptions = useMemo(() => uniqueSorted(specimens.map((specimen) => specimen.repository)), [specimens])
  const platformOptions = useMemo(
    () => uniqueSorted(specimens.map((specimen) => specimen.sequencingPlatform)),
    [specimens],
  )
  const filteredRows = useMemo(() => {
    return specimens.filter((specimen) => {
      if (province !== 'All Provinces' && specimen.province !== province) return false
      if (repository !== 'All Repositories' && specimen.repository !== repository) return false
      if (sequencingPlatform !== 'All Platforms' && specimen.sequencingPlatform !== sequencingPlatform) return false

      return matchesSearch(search, [
        specimen.specimenId,
        specimen.author,
        specimen.repository,
        specimen.province,
        specimen.municipality,
        specimen.tissueSource,
        specimen.sequencingPlatform,
        specimen.doi,
        specimen.project,
      ])
    })
  }, [specimens, province, repository, sequencingPlatform, search])

  const { page: currentPage, totalPages, rows } = useMemo(
    () => paginateRows(filteredRows, page),
    [filteredRows, page],
  )

  useEffect(() => {
    setPage(1)
  }, [search, province, repository, sequencingPlatform])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="font-serif text-[clamp(2rem,3.6vw,3.1rem)] leading-[0.95] text-black">
          Specimens <span className="text-brand-700">({filteredRows.length})</span>
        </h2>
        <p className="max-w-4xl text-[0.98rem] leading-7 text-[var(--app-muted)] sm:text-[1.05rem]">
          Individual specimen records collected for this species.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-4 xl:flex-1 xl:flex-row xl:flex-wrap xl:items-end">
            <SearchInput
              placeholder="Search by.."
              className="w-full lg:max-w-[328px]"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  setPage(1)
                }
              }}
            />

            <SelectWithChevron value={province} onChange={(event) => setProvince(event.target.value)}>
              <option>All Provinces</option>
              {provinceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>

            <SelectWithChevron value={repository} onChange={(event) => setRepository(event.target.value)}>
              <option>All Repositories</option>
              {repositoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>

            <SelectWithChevron
              value={sequencingPlatform}
              onChange={(event) => setSequencingPlatform(event.target.value)}
            >
              <option>All Platforms</option>
              {platformOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </div>

          <div className="grid w-full grid-cols-2 self-start overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white shadow-sm sm:w-auto sm:inline-flex xl:self-auto">
            <button
              type="button"
              className="px-5 py-3 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
              onClick={() => setPage(1)}
            >
              Apply Filter
            </button>
            <div className="w-px bg-[var(--app-border)]" />
            <button
              type="button"
              className="px-5 py-3 text-sm font-medium text-[var(--app-muted)] transition hover:bg-brand-50 hover:text-brand-700"
              onClick={() => {
                setSearch('')
                setProvince('All Provinces')
                setRepository('All Repositories')
                setSequencingPlatform('All Platforms')
                setPage(1)
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
              {rows.map((specimen) => (
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
              {!rows.length ? (
                <tr>
                  <td className="px-5 py-8 text-center text-[var(--app-muted)]" colSpan={7}>
                    No specimens matched your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
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
              <dd className="text-[var(--app-muted)]">
                {publication.linkedConopeptides ?? publication.linkedConopeptidesCount ?? 'Unavailable'}
              </dd>
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
  const publications = Array.isArray(species.publications) ? species.publications : []
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [year, setYear] = useState('All Years')
  const [journal, setJournal] = useState('All Journals')

  const yearOptions = useMemo(() => uniqueSorted(publications.map((publication) => publication.year)), [publications])
  const journalOptions = useMemo(() => uniqueSorted(publications.map((publication) => publication.journal)), [publications])
  const filteredRows = useMemo(() => {
    return publications.filter((publication) => {
      if (year !== 'All Years' && publication.year !== year) return false
      if (journal !== 'All Journals' && publication.journal !== journal) return false

      return matchesSearch(search, [
        publication.title,
        publication.authors,
        publication.journal,
        publication.year,
        publication.doi,
        publication.evidenceType,
        publication.specimenId,
      ])
    })
  }, [publications, year, journal, search])

  const { page: currentPage, totalPages, rows } = useMemo(
    () => paginateRows(filteredRows, page),
    [filteredRows, page],
  )

  useEffect(() => {
    setPage(1)
  }, [search, year, journal])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="font-serif text-[clamp(2rem,3.6vw,3.1rem)] leading-[0.95] text-black">
          Publications <span className="text-brand-700">({filteredRows.length})</span>
        </h2>
        <p className="max-w-4xl text-[0.98rem] leading-7 text-[var(--app-muted)] sm:text-[1.05rem]">
          Reference papers and related studies associated with this species.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-4 xl:flex-1 xl:flex-row xl:flex-wrap xl:items-end">
            <SearchInput
              placeholder="Search by.."
              className="w-full lg:max-w-[328px]"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  setPage(1)
                }
              }}
            />

            <SelectWithChevron value={year} onChange={(event) => setYear(event.target.value)}>
              <option>All Years</option>
              {yearOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>

            <SelectWithChevron value={journal} onChange={(event) => setJournal(event.target.value)}>
              <option>All Journals</option>
              {journalOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </div>

          <div className="grid w-full grid-cols-2 self-start overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white shadow-sm sm:w-auto sm:inline-flex xl:self-auto">
            <button
              type="button"
              className="px-5 py-3 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
              onClick={() => setPage(1)}
            >
              Apply Filter
            </button>
            <div className="w-px bg-[var(--app-border)]" />
            <button
              type="button"
              className="px-5 py-3 text-sm font-medium text-[var(--app-muted)] transition hover:bg-brand-50 hover:text-brand-700"
              onClick={() => {
                setSearch('')
                setYear('All Years')
                setJournal('All Journals')
                setPage(1)
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
                <th className="px-5 py-4">Journal</th>
                <th className="px-5 py-4">Year</th>
                <th className="px-5 py-4">DOI</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((publication) => (
                <tr
                  key={publication.doi || publication.publicationId || publication.title}
                  className="border-t border-[var(--app-border)] transition hover:bg-brand-50/60"
                >
                  <td className="px-5 py-4 align-top text-[var(--app-text)]">
                    {publication.specimenId || publication.specimen_id || 'Unavailable'}
                  </td>
                  <td className="px-5 py-4 align-top text-[var(--app-text)]">
                    {firstAuthorSurname(publication.authors)}
                  </td>
                  <td className="px-5 py-4 align-top text-[var(--app-text)]">
                    {publication.journal || 'Unavailable'}
                  </td>
                  <td className="px-5 py-4 align-top text-[var(--app-text)]">
                    {publication.year || 'Unavailable'}
                  </td>
                  <td className="break-all px-5 py-4 align-top text-[var(--app-text)]">
                    {publication.doi && publication.doi !== 'Unavailable' ? (
                      <a
                        href={publication.doi.startsWith('http') ? publication.doi : `https://doi.org/${publication.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2 transition hover:text-brand-700"
                      >
                        {publication.doi}
                      </a>
                  ) : (
                      'Unavailable'
                    )}
                  </td>
                </tr>
              ))}
              {!rows.length ? (
                <tr>
                  <td className="px-5 py-8 text-center text-[var(--app-muted)]" colSpan={5}>
                    No publications matched your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

export default function SpeciesDetailPage() {
  const { speciesId } = useParams()
  const [speciesSource, setSpeciesSource] = useState([])
  const species = useMemo(() => {
    return (
      speciesSource.find((record) => record.speciesId === speciesId) ??
      speciesSource[0]
    )
  }, [speciesId, speciesSource])

  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    let active = true

    async function loadSpecies() {
      try {
        const liveRecord = await fetchSpeciesDetail(speciesId)
        if (active && liveRecord) {
          setSpeciesSource([liveRecord])
        }
      } catch {
        if (active) {
          setSpeciesSource([])
        }
      }
    }

    loadSpecies()

    return () => {
      active = false
    }
  }, [speciesId])

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
            src={species.species.image || species.species.imageFallback || speciesShellImage}
            alt={species.species.imageAlt ?? species.species.scientificName}
            onError={(event) => {
              const fallback = species.species.imageFallback || speciesShellImage
              if (!event.currentTarget.dataset.fallbackApplied) {
                event.currentTarget.dataset.fallbackApplied = 'true'
                event.currentTarget.src = fallback
              }
            }}
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
          <p className="mt-2 text-[1rem] text-[var(--app-muted)]">
            Diet: <span className="text-[var(--app-text)]">{species.species.diet || species.taxonomy.organismsDiet || 'Unavailable'}</span>
          </p>

          <div className="mt-8">
            <div className="join join-vertical w-full overflow-hidden rounded-2xl border border-brand-300 bg-white lg:join-horizontal">
              {visibleHeaderStats(species.statistics).map((stat) => (
                <StatItem key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap gap-2 rounded-2xl border border-brand-200 bg-[#f7f6ef] p-2">
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'rounded-xl px-4 py-2.5 text-[0.98rem] font-semibold text-brand-700 transition sm:px-6 sm:text-[1.04rem]',
                  isActive
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'text-brand-700/80 hover:bg-white hover:text-brand-800',
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
            <SectionCard title="Taxonomy Information">
              <InfoList
                items={[
                  { label: 'Scientific Name', value: species.taxonomy.scientificName },
                  { label: 'Common Name', value: species.taxonomy.commonName },
                  { label: 'Class', value: species.taxonomy.className },
                  { label: 'Order', value: species.taxonomy.orderName },
                  { label: 'Family', value: species.taxonomy.familyName },
                  { label: 'Genus', value: species.taxonomy.genusName },
                  { label: 'Subgenus', value: species.taxonomy.subgenus },
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
                  { label: 'Tissue Source', value: species.collection.tissueSource },
                ]}
              />
            </SectionCard>

            <SectionCard title="Molecular & Sequencing Information">
              <InfoList
                items={[
                  { label: 'Specimens Sequenced', value: species.molecular.specimensSequenced },
                  { label: 'Total Conopeptides', value: species.molecular.totalConopeptides },
                  { label: 'Sequencing Platform', value: species.molecular.sequencingPlatform },
                  {
                    label: 'Total Recorded Biomarkers',
                    value: species.molecular.totalRecordedBiomarkers ?? 'Unavailable',
                  },
                  { label: 'SRA Accession', value: species.molecular.sraAccession },
                ]}
              />
            </SectionCard>
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
