const BIOMARKER_BACKUP_PATH = '/backup-data/json/barcodes/latest.json'

function normalizeRecord(record) {
  return {
    biomarkerId: String(record['Specimen ID'] ?? record.biomarkerId ?? record.biomarker_id ?? ''),
    markerType: String(record['Gene Marker'] ?? record.markerType ?? record.marker_type ?? 'Unavailable'),
    species: String(record['Species Name'] ?? record.species ?? ''),
    accession: String(record['External Accession'] ?? record.accession ?? record.externalAccession ?? 'Unavailable'),
    sequenceLength: String(record['Sequence Length (bp)'] ?? record.sequenceLength ?? record.sequence_length ?? 'Unavailable'),
    province: String(record.Province ?? record.province ?? ''),
    status: String(record['Validation Status of CO1 Sequences'] ?? record.status ?? 'Unavailable'),
  }
}

export async function loadBiomarkerBackupRows() {
  const response = await fetch(BIOMARKER_BACKUP_PATH, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Backup biomarker data not found (${response.status})`)
  }

  const records = await response.json()

  if (!Array.isArray(records)) {
    throw new Error('Backup biomarker data is not an array')
  }

  return records.map(normalizeRecord).filter((record) => record.biomarkerId)
}
