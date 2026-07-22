import { apiClient } from './api.js'

const explorerFetchLimit = 10000

function toQueryString(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) return
    if (Array.isArray(value)) {
      query.set(key, value.join(','))
      return
    }
    query.set(key, String(value))
  })
  const result = query.toString()
  return result ? `?${result}` : ''
}

function normalizeSpeciesRow(row) {
  return {
    speciesId: String(row.speciesId ?? row.species_id ?? ''),
    scientificName: String(row.scientificName ?? row.scientific_name ?? ''),
    commonName: String(row.commonName ?? row.common_name ?? ''),
    subgenus: String(row.subgenus ?? ''),
    className: String(row.className ?? row.class_name ?? ''),
    orderName: String(row.orderName ?? row.order_name ?? ''),
    familyName: String(row.familyName ?? row.family_name ?? ''),
    genusName: String(row.genusName ?? row.genus_name ?? ''),
    province: String(row.province ?? ''),
    municipality: String(row.municipality ?? ''),
    precursorsCount: Number(row.precursorsCount ?? row.numConopeptides ?? 0),
    diet: String(row.diet ?? row.diet_type ?? ''),
    sequencingPlatform: String(row.sequencingPlatform ?? row.sequencing_platform ?? ''),
    tissueSource: String(row.tissueSource ?? row.tissue_source ?? ''),
    specimenDepositories: String(row.specimenDepositories ?? row.specimen_depositories ?? row.specimenRepository ?? row.specimen_repository ?? ''),
    rawDataInNcbiSra: Boolean(row.rawDataInNcbiSra ?? row.raw_data_in_ncbi_sra ?? false),
    image: String(row.image ?? ''),
    imageFallback: String(row.imageFallback ?? row.image_fallback ?? ''),
    imagePosition: String(row.imagePosition ?? 'center center'),
    specimenCount: Number(row.specimenCount ?? 1),
    specimenIds: Array.isArray(row.specimenIds) ? row.specimenIds.map(String) : [],
    doi: String(row.doi ?? ''),
  }
}

function toNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeText(value) {
  return String(value ?? '').trim().toLowerCase()
}

function hasUsableSequence(value) {
  const sequence = String(value ?? '').trim()
  const normalized = normalizeText(sequence)
  if (!sequence || ['unavailable', 'n/a', 'na', 'none', '-'].includes(normalized)) return false

  const compactSequence = sequence.toUpperCase().replace(/[\s.-]/g, '')
  return compactSequence.length >= 10 && /^[ACGTURYSWKMBDHVN]+$/.test(compactSequence)
}

function normalizeDoi(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//, '')
    .replace(/^doi:\s*/, '')
    .replace(/[.,;\s]+$/, '')
}

function splitDoiList(value) {
  return String(value ?? '')
    .split(/[,;]+/)
    .map(normalizeDoi)
    .filter((item) => item && item !== 'unavailable' && item !== 'unpublished')
}

function doiListIncludes(value, doi) {
  const normalizedDoi = normalizeDoi(doi)
  if (!normalizedDoi) return false
  return splitDoiList(value).includes(normalizedDoi)
}

function uniqueCount(rows, idGetter) {
  return new Set(rows.map(idGetter).filter(Boolean)).size
}

function buildSpecimensFromSpeciesRows(detail, rows) {
  const scientificName = detail?.species?.scientificName
  const requestedSpeciesId = detail?.speciesId
  const matchingRows = rows.filter((row) => {
    if (scientificName && normalizeText(row.scientificName) === normalizeText(scientificName)) return true
    if (requestedSpeciesId && row.speciesId === requestedSpeciesId) return true
    return false
  })

  return matchingRows.map((row) => ({
    specimenId: row.speciesId,
    author: 'Unavailable',
    repository: row.specimenDepositories || 'Unavailable',
    province: row.province || 'Unavailable',
    municipality: row.municipality || 'Unavailable',
    tissueSource: row.tissueSource || 'Unavailable',
    sequencingPlatform: row.sequencingPlatform || 'Unavailable',
    totalConopeptideSequences: String(toNumber(row.precursorsCount ?? row.numConopeptides)),
    doi: row.doi || 'Unavailable',
    project: row.project || 'Unavailable',
  }))
}

function withSpecimenFallback(detail, rows) {
  if (!detail || (Array.isArray(detail.specimens) && detail.specimens.length > 0)) return detail

  const specimens = buildSpecimensFromSpeciesRows(detail, rows)
  if (!specimens.length) return detail

  const totalConopeptides = specimens.reduce(
    (sum, specimen) => sum + toNumber(specimen.totalConopeptideSequences),
    0,
  )

  return {
    ...detail,
    specimens,
    molecular: {
      ...detail.molecular,
      specimensSequenced: String(specimens.length),
      totalConopeptides: String(totalConopeptides),
    },
    statistics: Array.isArray(detail.statistics)
      ? detail.statistics.map((stat) => {
          if (stat.label === 'Conopeptide Precursors') return { ...stat, value: String(totalConopeptides) }
          if (stat.label === 'Specimens Sequenced') return { ...stat, value: String(specimens.length) }
          return stat
        })
      : detail.statistics,
  }
}

function normalizeConopeptideRow(row) {
  return {
    accession: String(row.accession ?? ''),
    superfamily: String(row.superfamily ?? ''),
    framework: String(row.framework ?? row.cysteineFramework ?? ''),
    predictedPeptide: String(row.predictedPeptide ?? ''),
    maturePeptideSequence: String(row.maturePeptideSequence ?? row.mature_peptide_sequence ?? ''),
    matchedToxin: String(row.matchedToxin ?? ''),
    species: String(row.speciesName ?? row.species ?? ''),
    speciesId: String(row.speciesId ?? ''),
    specimenId: String(row.specimenId ?? row.speciesId ?? ''),
    geneSuperfamily: String(row.superfamily ?? ''),
    doi: String(row.doi ?? ''),
  }
}

function normalizeBiomarkerRow(row) {
  return {
    biomarkerId: String(row.biomarkerId ?? ''),
    speciesId: String(row.speciesId ?? row.species_id ?? ''),
    markerType: String(row.markerType ?? ''),
    species: String(row.speciesName ?? row.species ?? ''),
    accession: String(row.accession ?? 'Unavailable'),
    sequenceLength: String(row.sequenceLength ?? 'Unavailable'),
    sequence: String(row.sequence ?? ''),
    province: String(row.province ?? ''),
    status: String(row.validationStatus ?? row.status ?? 'Unavailable'),
    publicationDoi: String(row.publicationDoi ?? row.publication_doi ?? ''),
  }
}

function normalizePublicationRow(row) {
  return {
    id: String(row.publicationId ?? row.id ?? ''),
    title: String(row.title ?? ''),
    authors: String(row.authors ?? ''),
    year: String(row.year ?? ''),
    journal: String(row.journal ?? ''),
    doi: String(row.doi ?? 'Unavailable'),
    evidenceType: String(row.evidenceType ?? ''),
    linkedSpecies: Number(row.linkedSpecies ?? 0),
    linkedConopeptides: Number(row.linkedConopeptides ?? 0),
    linkedBiomarkers: Number(row.linkedBiomarkers ?? 0),
    province: String(row.province ?? ''),
    status: String(row.status ?? ''),
  }
}

function onlyBarcodeBiomarkerRows(rows) {
  const referencedSpeciesIds = new Set(rows.map((row) => row.speciesId).filter(Boolean))
  return rows.filter((row) => {
    if (!row.biomarkerId) return false
    if (row.speciesId && row.biomarkerId === row.speciesId) return false
    if (referencedSpeciesIds.has(row.biomarkerId)) return false
    return true
  })
}

function enrichPublicationLinkCounts(publications, speciesRows, conopeptideRows, biomarkerRows) {
  return publications.map((publication) => {
    const linkedSpecies = uniqueCount(
      speciesRows.filter((species) => doiListIncludes(species.doi, publication.doi)),
      (species) => species.speciesId,
    )
    const linkedConopeptides = uniqueCount(
      conopeptideRows.filter((conopeptide) => doiListIncludes(conopeptide.doi, publication.doi)),
      (conopeptide) => conopeptide.accession,
    )
    const linkedBiomarkers = uniqueCount(
      biomarkerRows.filter((biomarker) => doiListIncludes(biomarker.publicationDoi, publication.doi)),
      (biomarker) => biomarker.biomarkerId,
    )

    return {
      ...publication,
      linkedSpecies: linkedSpecies || publication.linkedSpecies,
      linkedConopeptides: linkedConopeptides || publication.linkedConopeptides,
      linkedBiomarkers: linkedBiomarkers || publication.linkedBiomarkers,
    }
  })
}

function buildPublicationsFromRows(detail, publications) {
  const scientificName = normalizeText(detail?.species?.scientificName)
  const specimens = Array.isArray(detail?.specimens) ? detail.specimens : []
  const specimenDoiEntries = specimens.flatMap((specimen) =>
    splitDoiList(specimen.doi).map((doi) => ({
      doi,
      specimenId: specimen.specimenId,
    })),
  )

  return publications
    .map((publication) => {
      const publicationDoi = normalizeDoi(publication.doi)
      const title = normalizeText(publication.title)
      const matchedSpecimenIds = Array.from(
        new Set(
          specimenDoiEntries
            .filter((entry) => publicationDoi && entry.doi === publicationDoi)
            .map((entry) => entry.specimenId)
            .filter(Boolean),
        ),
      )
      const matchedBySpeciesName = scientificName && title.includes(scientificName)

      if (!matchedSpecimenIds.length && !matchedBySpeciesName) return null

      return {
        ...publication,
        specimenId: matchedSpecimenIds.length
          ? matchedSpecimenIds.join(', ')
          : specimens.map((specimen) => specimen.specimenId).filter(Boolean).join(', '),
      }
    })
    .filter(Boolean)
}

async function withPublicationFallback(detail) {
  if (!detail || (Array.isArray(detail.publications) && detail.publications.length > 0)) return detail

  try {
    const publications = await fetchPublicationExplorerRows()
    const matchedPublications = buildPublicationsFromRows(detail, publications)
    if (!matchedPublications.length) return detail

    return {
      ...detail,
      publications: matchedPublications,
    }
  } catch {
    return detail
  }
}

async function withBiomarkerCountFallback(detail) {
  if (!detail) return detail

  try {
    const biomarkers = await fetchBiomarkerExplorerRows()
    const scientificName = normalizeText(detail?.species?.scientificName)
    const specimenIds = new Set(
      (Array.isArray(detail.specimens) ? detail.specimens : [])
        .map((specimen) => String(specimen.specimenId ?? '').trim())
        .filter(Boolean),
    )
    const matchedBiomarkerIds = biomarkers
      .filter((biomarker) => {
        if (!hasUsableSequence(biomarker.sequence)) return false
        if (biomarker.speciesId && specimenIds.has(biomarker.speciesId)) return true
        return scientificName && normalizeText(biomarker.species) === scientificName
      })
      .map((biomarker) => biomarker.biomarkerId)
      .filter(Boolean)

    return {
      ...detail,
      molecular: {
        ...detail.molecular,
        totalRecordedBiomarkers: String(new Set(matchedBiomarkerIds).size),
      },
    }
  } catch {
    return detail
  }
}

async function fetchList(pathname, fallbackKey) {
  const response = await apiClient.get(pathname)
  if (!response.success) throw new Error(response.message || `Failed to fetch ${fallbackKey}`)
  return response.data || []
}

async function fetchDetail(pathname, fallbackKey) {
  const response = await apiClient.get(pathname)
  if (!response.success) throw new Error(response.message || `Failed to fetch ${fallbackKey}`)
  return response.data || null
}

export async function fetchSpeciesExplorerRows() {
  const rows = await fetchList(`/species${toQueryString({ limit: explorerFetchLimit, sortBy: 'scientificName', order: 'ASC' })}`)
  return rows.map(normalizeSpeciesRow)
}

export async function fetchSpeciesDetail(speciesId) {
  const detail = await fetchDetail(`/species/${speciesId}`, 'species detail')
  if (!detail) return detail

  const rows = await fetchSpeciesExplorerRows()
  const withSpecimens = withSpecimenFallback(detail, rows)
  const withPublications = await withPublicationFallback(withSpecimens)
  return withBiomarkerCountFallback(withPublications)
}

export async function fetchConopeptideExplorerRows() {
  const rows = await fetchList(`/conopeptides${toQueryString({ limit: explorerFetchLimit, sortBy: 'speciesName', order: 'ASC' })}`)
  return rows.map(normalizeConopeptideRow)
}

export async function fetchConopeptideDetail(accession) {
  return fetchDetail(`/conopeptides/${accession}`, 'conopeptide detail')
}

export async function fetchBiomarkerExplorerRows() {
  const rows = await fetchList(`/biomarkers${toQueryString({ limit: explorerFetchLimit, sortBy: 'speciesName', order: 'ASC' })}`)
  return onlyBarcodeBiomarkerRows(rows.map(normalizeBiomarkerRow))
}

export async function fetchBiomarkerDetail(biomarkerId) {
  return fetchDetail(`/biomarkers/${biomarkerId}`, 'biomarker detail')
}

export async function fetchPublicationExplorerRows() {
  const rows = await fetchList(`/publications${toQueryString({ limit: explorerFetchLimit, sortBy: 'year', order: 'DESC' })}`)
  const publications = rows.map(normalizePublicationRow)
  const needsFallback = publications.some(
    (publication) => !publication.linkedSpecies && !publication.linkedConopeptides && !publication.linkedBiomarkers,
  )

  if (!needsFallback) return publications

  try {
    const [speciesRows, conopeptideRows, biomarkerRows] = await Promise.all([
      fetchSpeciesExplorerRows(),
      fetchConopeptideExplorerRows(),
      fetchBiomarkerExplorerRows(),
    ])

    return enrichPublicationLinkCounts(publications, speciesRows, conopeptideRows, biomarkerRows)
  } catch {
    return publications
  }
}

export async function fetchDashboardSummary() {
  const response = await apiClient.get('/dashboard/summary')
  if (!response.success) throw new Error(response.message || 'Failed to fetch dashboard summary')
  return response.data
}

export async function fetchSpeciesFilters() {
  const response = await apiClient.get('/taxonomy/filters')
  if (!response.success) throw new Error(response.message || 'Failed to fetch taxonomy filters')
  return response.data || {}
}

