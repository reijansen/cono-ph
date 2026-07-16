import speciesShellImage from '@/assets/HomeShell.png'

const SPECIES_BACKUP_PATH = '/backup-data/json/species/latest.json'
const TAXONOMIC_BACKUP_PATH = '/backup-data/json/taxonomic/latest.json'

function toDirectImageUrl(value) {
  const link = String(value ?? '').trim()

  if (!link) {
    return speciesShellImage
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

function normalizeSpeciesRecord(record) {
  return {
    speciesId: String(record['Species ID'] ?? record.speciesId ?? record.species_id ?? record.id ?? ''),
    scientificName: String(record['Scientific name'] ?? record.scientificName ?? record.scientific_name ?? ''),
    commonName: String(record['Common name'] ?? record.commonName ?? record.common_name ?? ''),
    subgenus: String(record.Subgenus ?? record.subgenus ?? ''),
    className: String(record.Class ?? record.className ?? record.class ?? ''),
    orderName: String(record.Order ?? record.orderName ?? record.order ?? ''),
    familyName: String(record.Family ?? record.familyName ?? record.family ?? ''),
    genusName: String(record.Genus ?? record.genusName ?? record.genus ?? ''),
    province: String(record.Province ?? record.province ?? ''),
    municipality: String(record.Municipality ?? record.municipality ?? ''),
    precursorsCount: Number(record['Number of conopeptides'] ?? record.precursorsCount ?? record.precursors_count ?? 0),
    status: String(record.DOI ?? record.status ?? 'Unavailable') === 'Unpublished' ? 'Unpublished' : 'Published',
    project: String(record.Project ?? record.project ?? ''),
    diet: String(record['Diet type'] ?? record.diet ?? ''),
    sequencingPlatform: String(record['Sequencing platform'] ?? record.sequencingPlatform ?? record.sequencing_platform ?? ''),
    tissueSource: String(record['Tissue source'] ?? record.tissueSource ?? record.tissue_source ?? ''),
    rawDataInNcbiSra: Boolean(record.rawDataInNcbiSra ?? record.raw_data_in_ncbi_sra ?? false),
    image: toDirectImageUrl(record['Shell image'] ?? record.image ?? record.imageUrl ?? record.image_url),
    imagePosition: 'center center',
  }
}

function normalizeTaxonomicRecord(record) {
  return {
    speciesId: String(record['Species ID'] ?? record.speciesId ?? record.species_id ?? ''),
    className: String(record.Class ?? record.className ?? record.class ?? ''),
    orderName: String(record.Order ?? record.orderName ?? record.order ?? ''),
    familyName: String(record.Family ?? record.familyName ?? record.family ?? ''),
    genusName: String(record.Genus ?? record.genusName ?? record.genus ?? ''),
    subgenus: String(record.Subgenus ?? record.subgenus ?? ''),
    tissueSource: String(record['Tissue source'] ?? record.tissueSource ?? record.tissue_source ?? ''),
  }
}

async function loadJsonRows(pathname) {
  const response = await fetch(pathname, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Backup data not found (${response.status})`)
  }

  const records = await response.json()

  if (!Array.isArray(records)) {
    throw new Error('Backup data is not an array')
  }

  return records
}

export async function loadSpeciesBackupRecords() {
  const [speciesRows, taxonomicRows] = await Promise.all([
    loadJsonRows(SPECIES_BACKUP_PATH),
    loadJsonRows(TAXONOMIC_BACKUP_PATH),
  ])

  const taxonomicBySpeciesId = new Map(
    taxonomicRows.map((record) => {
      const normalized = normalizeTaxonomicRecord(record)
      return [normalized.speciesId, normalized]
    }),
  )

  return speciesRows
    .map((record) => {
      const normalized = normalizeSpeciesRecord(record)
      const taxonomic = taxonomicBySpeciesId.get(normalized.speciesId) ?? {}

      return {
        ...normalized,
        className: normalized.className || taxonomic.className,
        orderName: normalized.orderName || taxonomic.orderName,
        familyName: normalized.familyName || taxonomic.familyName,
        genusName: normalized.genusName || taxonomic.genusName,
        subgenus: normalized.subgenus || taxonomic.subgenus,
        tissueSource: normalized.tissueSource || taxonomic.tissueSource || '',
        image: normalized.image || speciesShellImage,
      }
    })
    .filter((record) => record.speciesId)
}
