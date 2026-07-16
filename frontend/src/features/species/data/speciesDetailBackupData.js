const SPECIES_DETAIL_BACKUP_PATH = '/backup-data/json/species/latest.json'
const TAXONOMIC_DETAIL_BACKUP_PATH = '/backup-data/json/taxonomic/latest.json'

function toDirectImageUrl(value) {
  const link = String(value ?? '').trim()

  if (!link) {
    return ''
  }

  if (link.startsWith('species-image/') || link.startsWith('/species-image/')) {
    return link.startsWith('/') ? link : `/${link}`
  }

  if (link.startsWith('species-images/') || link.startsWith('/species-images/')) {
    return link.startsWith('/') ? link : `/${link}`
  }

  const driveMatch = link.match(/drive\.google\.com\/file\/d\/([^/]+)/i)
  if (driveMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`
  }

  return link
}

function normalizeTaxonomicRecord(record) {
  return {
    speciesId: String(record['Species ID'] ?? record.speciesId ?? ''),
    className: String(record.Class ?? record.className ?? ''),
    orderName: String(record.Order ?? record.orderName ?? ''),
    familyName: String(record.Family ?? record.familyName ?? ''),
    genusName: String(record.Genus ?? record.genusName ?? ''),
    subgenus: String(record.Subgenus ?? record.subgenus ?? ''),
  }
}

function normalizeRecord(record, taxonomic = {}) {
  return {
    speciesId: String(record['Species ID'] ?? record.speciesId ?? ''),
    species: {
      scientificName: String(record['Scientific name'] ?? record.scientificName ?? ''),
      commonName: String(record['Common name'] ?? record.commonName ?? ''),
      subgenus: taxonomic.subgenus || String(record.Subgenus ?? record.subgenus ?? ''),
      className: taxonomic.className || String(record.Class ?? record.className ?? ''),
      orderName: taxonomic.orderName || String(record.Order ?? record.orderName ?? ''),
      familyName: taxonomic.familyName || String(record.Family ?? record.familyName ?? ''),
      genusName: taxonomic.genusName || String(record.Genus ?? record.genusName ?? ''),
      image: toDirectImageUrl(record['Shell image'] ?? record.image ?? record.imageUrl ?? record.image_url),
    },
    taxonomy: {
      scientificName: String(record['Scientific name'] ?? record.scientificName ?? ''),
      commonName: String(record['Common name'] ?? record.commonName ?? ''),
      className: taxonomic.className || String(record.Class ?? record.className ?? ''),
      orderName: taxonomic.orderName || String(record.Order ?? record.orderName ?? ''),
      familyName: taxonomic.familyName || String(record.Family ?? record.familyName ?? ''),
      genusName: taxonomic.genusName || String(record.Genus ?? record.genusName ?? ''),
      subgenus: taxonomic.subgenus || String(record.Subgenus ?? record.subgenus ?? ''),
      organismsDiet: String(record['Diet type'] ?? record.dietType ?? 'Unavailable'),
      anatomicalSample: 'Venom gland',
    },
    collection: {
      province: String(record.Province ?? record.province ?? 'Unavailable'),
      municipality: String(record.Municipality ?? record.municipality ?? 'Unavailable'),
      psgc: 'Unavailable',
      specimenRepository: String(record['Specimen Depositories'] ?? record.specimenDepositories ?? 'Unavailable'),
      tissueSource: String(record['Tissue source'] ?? record.tissueSource ?? 'Unavailable'),
    },
    molecular: {
      specimensSequenced: String(record['Number of CO1 records'] ?? 'Unavailable'),
      totalConopeptides: String(record['Number of conopeptides'] ?? 'Unavailable'),
      totalGeneSuperfamilies: 'Unavailable',
      sequencingPlatform: 'Unavailable',
      coiMarker: String(record['Number of CO1 records'] ?? 'Unavailable'),
      rawDataAvailable: 'Unavailable',
      sraAccession: 'Unavailable',
    },
    publication: {
      doi: String(record.DOI ?? record.doi ?? 'Unavailable'),
      title: `Backup record for ${String(record['Scientific name'] ?? record.scientificName ?? '')}`,
      authors: 'Unavailable',
      project: 'Unavailable',
    },
    statistics: [
      { label: 'Conopeptide Precursors', value: String(record['Number of conopeptides'] ?? 'Unavailable') },
      { label: 'Total Gene Superfamilies', value: 'Unavailable' },
      { label: 'Specimens Sequenced', value: String(record['Number of CO1 records'] ?? 'Unavailable') },
      { label: 'Sequencing Platform', value: 'Unavailable' },
      { label: 'Raw Data in NCBI SRA', value: 'Unavailable' },
    ],
    conopeptides: [],
    specimens: [],
    publications: [],
  }
}

export async function loadSpeciesBackupDetails() {
  const [response, taxonomicResponse] = await Promise.all([
    fetch(SPECIES_DETAIL_BACKUP_PATH, { cache: 'no-store' }),
    fetch(TAXONOMIC_DETAIL_BACKUP_PATH, { cache: 'no-store' }),
  ])

  if (!response.ok) {
    throw new Error(`Backup species data not found (${response.status})`)
  }

  const records = await response.json()

  if (!Array.isArray(records)) {
    throw new Error('Backup species data is not an array')
  }

  const taxonomicRecords = taxonomicResponse.ok ? await taxonomicResponse.json() : []
  const taxonomicBySpeciesId = new Map(
    Array.isArray(taxonomicRecords)
      ? taxonomicRecords.map((record) => {
          const normalized = normalizeTaxonomicRecord(record)
          return [normalized.speciesId, normalized]
        })
      : [],
  )

  return records
    .map((record) => normalizeRecord(record, taxonomicBySpeciesId.get(String(record['Species ID'] ?? ''))))
    .filter((record) => record.speciesId)
}
