import { apiClient } from './api.js'

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
    rawDataInNcbiSra: Boolean(row.rawDataInNcbiSra ?? row.raw_data_in_ncbi_sra ?? false),
    image: String(row.image ?? ''),
    imagePosition: String(row.imagePosition ?? 'center center'),
  }
}

function normalizeConopeptideRow(row) {
  return {
    accession: String(row.accession ?? ''),
    superfamily: String(row.superfamily ?? ''),
    framework: String(row.framework ?? row.cysteineFramework ?? ''),
    predictedPeptide: String(row.predictedPeptide ?? ''),
    matchedToxin: String(row.matchedToxin ?? ''),
    species: String(row.speciesName ?? row.species ?? ''),
    speciesId: String(row.speciesId ?? ''),
    specimenId: String(row.specimenId ?? row.speciesId ?? ''),
    geneSuperfamily: String(row.superfamily ?? ''),
  }
}

function normalizeBiomarkerRow(row) {
  return {
    biomarkerId: String(row.biomarkerId ?? ''),
    markerType: String(row.markerType ?? ''),
    species: String(row.speciesName ?? row.species ?? ''),
    accession: String(row.accession ?? 'Unavailable'),
    sequenceLength: String(row.sequenceLength ?? 'Unavailable'),
    province: String(row.province ?? ''),
    status: String(row.validationStatus ?? row.status ?? 'Unavailable'),
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
  const rows = await fetchList('/species')
  return rows.map(normalizeSpeciesRow)
}

export async function fetchSpeciesDetail(speciesId) {
  return fetchDetail(`/species/${speciesId}`, 'species detail')
}

export async function fetchConopeptideExplorerRows() {
  const rows = await fetchList('/conopeptides')
  return rows.map(normalizeConopeptideRow)
}

export async function fetchConopeptideDetail(accession) {
  return fetchDetail(`/conopeptides/${accession}`, 'conopeptide detail')
}

export async function fetchBiomarkerExplorerRows() {
  const rows = await fetchList('/biomarkers')
  return rows.map(normalizeBiomarkerRow)
}

export async function fetchBiomarkerDetail(biomarkerId) {
  return fetchDetail(`/biomarkers/${biomarkerId}`, 'biomarker detail')
}

export async function fetchPublicationExplorerRows() {
  const rows = await fetchList('/publications')
  return rows.map(normalizePublicationRow)
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

