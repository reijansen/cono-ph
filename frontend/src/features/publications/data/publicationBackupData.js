const PUBLICATION_BACKUP_PATH = '/backup-data/json/publications/latest.json'

function normalizeRecord(record) {
  const linkedSpecies = Number(record['Linked Species'] ?? record.linkedSpecies ?? record.linked_species ?? 0)
  const linkedConopeptides = Number(record['Linked Conopeptides'] ?? record.linkedConopeptides ?? record.linked_conopeptides ?? 0)
  const linkedBiomarkers = Number(record['Linked Biomarkers'] ?? record.linkedBiomarkers ?? record.linked_biomarkers ?? 0)

  return {
    id: String(record['Publication ID'] ?? record.id ?? record.publication_id ?? record.DOI ?? ''),
    title: String(record.Title ?? record.title ?? ''),
    authors: String(record.Authors ?? record.authors ?? ''),
    year: String(record['Year Published'] ?? record.Year ?? record.year ?? ''),
    journal: String(record.Journal ?? record.journal ?? ''),
    doi: String(record.DOI ?? record.doi ?? 'Unavailable'),
    evidenceType: String(record['Evidence Type'] ?? record.evidenceType ?? record.evidence_type ?? ''),
    linkedSpecies,
    linkedConopeptides,
    linkedBiomarkers,
    province: String(record.Province ?? record.province ?? ''),
    status: String(record.Status ?? record.status ?? ''),
  }
}

export async function loadPublicationBackupRows() {
  const response = await fetch(PUBLICATION_BACKUP_PATH, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Backup publication data not found (${response.status})`)
  }

  const records = await response.json()

  if (!Array.isArray(records)) {
    throw new Error('Backup publication data is not an array')
  }

  return records.map(normalizeRecord).filter((record) => record.id)
}
